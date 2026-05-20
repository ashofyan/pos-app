import React, {useCallback, useEffect, useRef, useState} from 'react';
import ProductGrid from '../components/ProductGrid';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  useWindowDimensions,
  Alert,
} from 'react-native';

import {useAuthStore} from '../../auth/store/auth.store';

import {useShiftStore} from '../../shift/store/shift.store';

import {
  removeShiftSession,
  saveShiftSession,
} from '../../shift/storage/shift.storage';

import {getProducts} from '../api/product.api';

import {AccountingProduct} from '../types/product.types';

import OpenStoreModal from '../../shift/components/OpenStoreModal';
import {useCashierFilterStore} from '../store/cashier-filter.store.ts';
import {AccountingCategory} from '../types/category.types.ts';
import {getCategories} from '../api/category.api.ts';
import ProductSearch from '../components/ProductSearch.tsx';
import CategoryFilter from '../components/CategoryFilter.tsx';
import {useDebounce} from 'use-debounce';
import AppIcon from '../../../shared/ui/AppIcon.tsx';
import OrderTypeDialog, {
  getOrderTypeLabel,
  OrderType,
} from '../components/OrderTypeDialog.tsx';
import DiscountDialog, {
  defaultDiscountOptions,
  DiscountForm,
  getDiscountLabel,
} from '../components/DiscountDialog.tsx';
import PaymentDialog, {PaymentMethod} from '../components/PaymentDialog.tsx';
import CheckoutSuccessDialog from '../components/CheckoutSuccessDialog.tsx';
import {checkoutOrder} from '../api/checkout.api.ts';
import CashierSidebar from '../components/CashierSidebar.tsx';

type CartItem = {
  product: AccountingProduct;
  quantity: number;
};

const formatCurrency = (value: number) =>
  `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

const getProductColumnCount = (width: number, height: number) => {
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= 600;

  if (isLandscape) {
    return width >= 1200 ? 5 : 4;
  }

  return isTablet ? 3 : 2;
};

const getPaymentMethodId = (method: PaymentMethod) => {
  const paymentMethodMap: Record<PaymentMethod, number> = {
    cash: 1,
    'transfer-bca': 2,
    'transfer-bni': 3,
    qris: 4,
  };

  return paymentMethodMap[method];
};

const formatOrderDate = (date: Date) =>
  date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export default function CashierDashboardScreen() {
  const {width, height} = useWindowDimensions();
  const [products, setProducts] = useState<AccountingProduct[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const [productLoading, setProductLoading] = useState(false);
  const [openVisible, setOpenVisible] = useState(false);
  const user = useAuthStore(state => state.user);
  const tenant = useAuthStore(state => state.tenant);
  const logout = useAuthStore(state => state.logout);
  const activeShift = useShiftStore(state => state.activeShift);
  const setActiveShift = useShiftStore(state => state.setActiveShift);
  const clearShift = useShiftStore(state => state.clearShift);
  const [categories, setCategories] = useState<AccountingCategory[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [orderTypeVisible, setOrderTypeVisible] = useState(false);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [discountVisible, setDiscountVisible] = useState(false);
  const [discountNominal, setDiscountNominal] = useState('');
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(
    null,
  );
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successOrderNumber, setSuccessOrderNumber] = useState('');
  const [successOrderDate, setSuccessOrderDate] = useState('');

  const search = useCashierFilterStore(state => state.search);

  const setSearch = useCashierFilterStore(state => state.setSearch);

  const categoryId = useCashierFilterStore(state => state.categoryId);

  const setCategoryId = useCashierFilterStore(state => state.setCategoryId);

  const [debouncedSearch] = useDebounce(search, 500);

  const hasInitialized = useRef(false);
  const hasLoadedInitialProducts = useRef(false);
  const orderNumberRef = useRef(Date.now().toString());

  const fetchProducts = useCallback(async () => {
    try {
      setProductLoading(true);

      const response = await getProducts({
        q: debouncedSearch,
        page: 1,
        perpage: 20,
        category_id: categoryId,
      });

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProductLoading(false);
    }
  }, [categoryId, debouncedSearch]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();

      setCategories(response.data);
    } catch (error: any) {
      console.log(
        'CATEGORY RESPONS',
        JSON.stringify(error?.response?.data.message),
      );
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      if (!activeShift) {
        setOpenVisible(true);
      }

      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (error) {
      console.log(error);
    } finally {
      setInitialLoading(false);
    }
  }, [activeShift, fetchCategories, fetchProducts]);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!hasLoadedInitialProducts.current) {
      hasLoadedInitialProducts.current = true;
      return;
    }

    fetchProducts();
  }, [fetchProducts]);

  const handleOpenStore = async (amount: number) => {
    try {
      if (!user || !tenant) {
        return;
      }

      const shift = {
        shift_id: Date.now().toString(),

        cashier_id: user.id,
        cashier_name: user.name,

        tenant_id: tenant.id,

        opening_balance: amount,

        opened_at: new Date().toISOString(),

        closed_at: null,

        status: 'open' as const,
      };

      await saveShiftSession(shift);

      setActiveShift(shift);

      setOpenVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddProduct = (product: AccountingProduct) => {
    setCartItems(current => {
      const existing = current.find(item => item.product.id === product.id);

      if (existing) {
        return current.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          product,
          quantity: 1,
        },
      ];
    });
  };

  const handleDecreaseProduct = (productId: number) => {
    setCartItems(current =>
      current
        .map(item =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter(item => item.quantity > 0),
    );
  };

  const handleLogout = async () => {
    try {
      await removeShiftSession();

      clearShift();
      setCartItems([]);
      setCustomerName('');
      setOrderType(null);
      setTableNumber('');
      setDiscountNominal('');
      setSelectedDiscountId(null);
      setPaymentVisible(false);
      setSuccessVisible(false);
      setSearch('');
      setCategoryId(null);
    } catch (error) {
      console.log(error);
    } finally {
      logout();
    }
  };

  const handleSubmitOrderType = (form: {
    orderType: OrderType;
    tableNumber: string;
  }) => {
    setOrderType(form.orderType);
    setTableNumber(form.tableNumber);
    setOrderTypeVisible(false);
  };

  const handleSubmitDiscount = (form: DiscountForm) => {
    setDiscountNominal(form.nominal);
    setSelectedDiscountId(form.selectedDiscountId);
    setDiscountVisible(false);
  };

  const resetOrderForm = () => {
    setCartItems([]);
    setCustomerName('');
    setOrderType(null);
    setTableNumber('');
    setDiscountNominal('');
    setSelectedDiscountId(null);
    orderNumberRef.current = Date.now().toString();
  };

  const handlePay = async (method: PaymentMethod, paidAmount: number) => {
    try {
      if (!user || !tenant) {
        return;
      }

      setCheckoutLoading(true);

      const checkoutDate = new Date();
      const response = await checkoutOrder({
        dining_type: orderType === 'dine-in' ? 'dine_in' : 'fast_food',
        item_ids: cartItems.flatMap(item =>
          Array.from({length: item.quantity}, () => item.product.id),
        ),
        vendor_id: Number(tenant.id),
        payment_method_id: getPaymentMethodId(method),
        paid_amount: Math.max(Math.round(paidAmount), Math.round(total)),
        discount: Math.round(discountValue),
        service_charge: 0,
        tax_total: 0,
        created_by: user.id,
      });

      setPaymentVisible(false);
      setSuccessOrderNumber(
        response.data?.order_number ||
          response.order_number ||
          orderNumberRef.current,
      );
      setSuccessOrderDate(
        response.data?.order_date ||
          response.order_date ||
          formatOrderDate(checkoutDate),
      );
      setSuccessVisible(true);
    } catch (error: any) {
      console.log('CHECKOUT ERROR', JSON.stringify(error?.response?.data));
      Alert.alert(
        'Checkout gagal',
        error?.response?.data?.message || 'Terjadi kesalahan saat checkout.',
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleNewOrder = () => {
    setSuccessVisible(false);
    resetOrderForm();
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.product.selling_price) * item.quantity,
    0,
  );

  const selectedDiscount = defaultDiscountOptions.find(
    option => option.id === selectedDiscountId,
  );
  const discountValue = selectedDiscount?.percentage
    ? subtotal * (selectedDiscount.percentage / 100)
    : Number(discountNominal || 0);
  const total = Math.max(subtotal - discountValue, 0);
  const orderNumber = tableNumber || orderNumberRef.current;
  const paymentItems = cartItems.map(item => ({
    id: item.product.id,
    name: item.product.item_name,
    price: Number(item.product.selling_price),
    quantity: item.quantity,
  }));
  const productColumns = getProductColumnCount(width, height);
  const hasCustomerInformation =
    customerName.trim().length > 0 &&
    Boolean(orderType) &&
    (orderType !== 'dine-in' || tableNumber.trim().length > 0);
  const canPlaceOrder = hasCustomerInformation && cartItems.length > 0;

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        {productLoading && (
          <ActivityIndicator
            size="small"
            color="#2563EB"
            style={styles.initialLoader}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CashierSidebar activeItem="cashier" />

      <View style={styles.catalogPane}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>
            ICSO <Text style={styles.brandAccent}>POS</Text>
          </Text>
          <ProductSearch
            value={search}
            onChange={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.categoryRow}>
          <CategoryFilter
            categories={categories}
            activeCategory={categoryId}
            onSelect={setCategoryId}
          />
        </View>

        {productLoading && (
          <ActivityIndicator
            size="small"
            color="#1677F2"
            style={styles.productLoading}
          />
        )}

        <ProductGrid
          products={products}
          columns={productColumns}
          onProductPress={handleAddProduct}
          contentContainerStyle={styles.productGrid}
        />
      </View>

      <View style={styles.orderPane}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.name || 'Nama User Login'}
            </Text>
            <Text style={styles.userRole}>Cashier</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <AppIcon name="log-out-outline" color="#dc3545" />
          </TouchableOpacity>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerInfoTitle}>Customer Information</Text>

          <TextInput
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Customer Name"
            placeholderTextColor="#9B9B9B"
            style={styles.customerInput}
          />

          <TouchableOpacity
            style={styles.orderTypeSelect}
            onPress={() => setOrderTypeVisible(true)}>
            <Text
              numberOfLines={1}
              style={[
                styles.orderTypeText,
                orderType && styles.orderTypeTextSelected,
              ]}>
              {getOrderTypeLabel(orderType)}
              {orderType === 'dine-in' && tableNumber
                ? ` - Table ${tableNumber}`
                : ''}
            </Text>
            <AppIcon name="chevron-forward-outline" size={18} color="#B5B5B5" />
          </TouchableOpacity>
        </View>

        <Text style={styles.orderTitle}>Order Details</Text>

        <ScrollView
          style={styles.orderList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.orderListContent}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyOrder}>
              <Text style={styles.emptyOrderText}>No order selected</Text>
            </View>
          ) : (
            cartItems.map(item => (
              <View key={item.product.id} style={styles.orderItem}>
                <View style={styles.itemImage}>
                  <Text style={styles.itemImageText}>IMG</Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text numberOfLines={1} style={styles.itemName}>
                    {item.product.item_name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(Number(item.product.selling_price))}
                  </Text>
                </View>

                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.minusButton}
                    onPress={() => handleDecreaseProduct(item.product.id)}>
                    <AppIcon
                      name="remove-circle-outline"
                      size={20}
                      color="#FF1717"
                    />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.plusButton}
                    onPress={() => handleAddProduct(item.product)}>
                    <AppIcon
                      name="add-circle-outline"
                      size={20}
                      color="#1677F2"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
        <View style={styles.totalBlock}>
          <TouchableOpacity
            style={styles.discountSelect}
            onPress={() => setDiscountVisible(true)}>
            <Text
              numberOfLines={1}
              style={[
                styles.discountSelectText,
                Boolean(selectedDiscountId || discountNominal) &&
                  styles.discountSelectTextSelected,
              ]}>
              {' '}
              {getDiscountLabel(
                defaultDiscountOptions,
                selectedDiscountId,
                discountNominal,
              )}
            </Text>
          </TouchableOpacity>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.mutedLabel}>Tax</Text>
            <Text style={styles.mutedValue}>{formatCurrency(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.mutedLabel}>Discount</Text>
            <Text style={styles.mutedValue}>
              {formatCurrency(discountValue)}
            </Text>
          </View>
        </View>

        <View style={styles.grandTotalRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            !canPlaceOrder && styles.placeOrderButtonDisabled,
          ]}
          disabled={!canPlaceOrder}
          onPress={() => setPaymentVisible(true)}>
          <Text
            style={[
              styles.placeOrderText,
              !canPlaceOrder && styles.placeOrderTextDisabled,
            ]}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>

      <OpenStoreModal visible={openVisible} onSubmit={handleOpenStore} />
      <OrderTypeDialog
        visible={orderTypeVisible}
        initialOrderType={orderType}
        initialTableNumber={tableNumber}
        onClose={() => setOrderTypeVisible(false)}
        onSubmit={handleSubmitOrderType}
      />
      <DiscountDialog
        visible={discountVisible}
        options={defaultDiscountOptions}
        initialNominal={discountNominal}
        initialSelectedDiscountId={selectedDiscountId}
        onClose={() => setDiscountVisible(false)}
        onSubmit={handleSubmitDiscount}
      />
      <PaymentDialog
        visible={paymentVisible}
        customerName={customerName}
        orderNumber={orderNumber}
        cashierName={user?.name || 'cashier_name'}
        items={paymentItems}
        subtotal={subtotal}
        tax={0}
        discount={discountValue}
        total={total}
        loading={checkoutLoading}
        onClose={() => setPaymentVisible(false)}
        onPay={handlePay}
      />
      <CheckoutSuccessDialog
        visible={successVisible}
        orderNumber={successOrderNumber}
        orderDate={successOrderDate}
        onNewOrder={handleNewOrder}
        onPrintCopy={() => setSuccessVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  initialLoader: {
    marginVertical: 10,
  },

  sidebar: {
    width: 54,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    paddingTop: 54,
  },

  sidebarIcon: {
    color: '#FFFFFF',
    marginBottom: 32,
  },

  catalogPane: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 22,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  brand: {
    width: 120,
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },

  brandAccent: {
    color: '#1677F2',
  },

  searchInput: {
    flex: 1,
    marginRight: 14,
  },

  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  categoryRow: {
    height: 40,
    marginBottom: 16,
  },

  productLoading: {
    position: 'absolute',
    top: 116,
    right: 28,
  },

  productGrid: {
    paddingBottom: 40,
  },

  orderPane: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#EFEFEF',
    paddingHorizontal: 24,
    paddingTop: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D8',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C9C9C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#666666',
    fontWeight: '800',
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
  },

  userRole: {
    marginTop: 3,
    fontSize: 11,
    color: '#9B9B9B',
  },

  logoutButton: {
    width: 30,
    alignItems: 'flex-end',
  },

  logoutText: {
    color: '#FF1717',
    fontSize: 18,
    fontWeight: '800',
  },

  customerInfo: {
    paddingTop: 14,
    paddingBottom: 6,
  },

  customerInfoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12,
  },

  customerInput: {
    height: 32,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 11,
    color: '#111111',
    marginBottom: 12,
  },

  orderTypeSelect: {
    height: 32,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderTypeText: {
    flex: 1,
    fontSize: 11,
    color: '#9B9B9B',
  },

  orderTypeTextSelected: {
    color: '#111111',
    fontWeight: '700',
  },

  orderTitle: {
    marginTop: 14,
    marginBottom: 14,
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },

  orderList: {
    flex: 1,
  },

  orderListContent: {
    paddingBottom: 16,
  },

  emptyOrder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyOrderText: {
    color: '#A0A0A0',
    fontSize: 12,
  },

  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  itemImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#BFBFBF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  itemImageText: {
    color: '#777777',
    fontSize: 9,
    fontWeight: '800',
  },

  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },

  itemName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
  },

  itemPrice: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },

  quantityControl: {
    width: 78,
    height: 28,
    borderWidth: 1,
    borderColor: '#CACACA',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },

  minusButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  minusText: {
    color: '#FF1717',
    fontWeight: '900',
    lineHeight: 13,
  },

  quantityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },

  plusButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusText: {
    color: '#1677F2',
    fontWeight: '900',
    lineHeight: 14,
  },

  discountSelect: {
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  discountSelectText: {
    fontSize: 11,
    color: '#9B9B9B',
  },

  discountSelectTextSelected: {
    color: '#111111',
    fontWeight: '700',
  },

  totalBlock: {
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
    paddingTop: 18,
    paddingBottom: 8,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  summaryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
  },

  summaryValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
  },

  mutedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B7B7B7',
  },

  mutedValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B7B7B7',
  },

  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  placeOrderButton: {
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  placeOrderButtonDisabled: {
    backgroundColor: '#D6D6D6',
  },

  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  placeOrderTextDisabled: {
    color: '#8F8F8F',
  },
});
