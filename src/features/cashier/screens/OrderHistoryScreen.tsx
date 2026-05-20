import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import CashierSidebar from '../components/CashierSidebar';
import OrderHistoryCard from '../components/OrderHistoryCard';
import {getOrderHistory} from '../api/order-history.api';
import {OrderHistory, OrderHistoryStatus} from '../types/order-history.types';
import {useAuthStore} from '../../auth/store/auth.store';

type OrderFilter = 'all' | 'in_progress' | 'completed';

const filterOptions: Array<{label: string; value: OrderFilter}> = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'On Process',
    value: 'in_progress',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
];

const getColumnCount = (width: number, height: number) => {
  const isLandscape = width > height;

  if (!isLandscape) {
    return 2;
  }

  return width >= 1180 ? 3 : 2;
};

const matchesFilter = (status: OrderHistoryStatus, filter: OrderFilter) => {
  if (filter === 'all') {
    return true;
  }

  return status === filter;
};

export default function OrderHistoryScreen() {
  const {width, height} = useWindowDimensions();
  const user = useAuthStore(state => state.user);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');

  const columns = getColumnCount(width, height);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getOrderHistory();

      setOrders(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter(order => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        order.diningType.toLowerCase().includes(normalizedSearch);

      return matchesSearch && matchesFilter(order.status, activeFilter);
    });
  }, [activeFilter, orders, search]);

  return (
    <View style={styles.container}>
      <CashierSidebar activeItem="history" />

      <View style={styles.content}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>
            ICSO <Text style={styles.brandAccent}>POS</Text>
          </Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#777777"
            style={styles.searchInput}
          />

          <View style={styles.userHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name || 'U').slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>
                {user?.name || 'Nama User Login'}
              </Text>
              <Text style={styles.userRole}>Cashier</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                activeFilter === option.value && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(option.value)}>
              <Text
                style={[
                  styles.filterText,
                  activeFilter === option.value && styles.filterTextActive,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#1677F2" />
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            key={columns}
            numColumns={columns}
            keyExtractor={item => item.id}
            renderItem={({item}) => <OrderHistoryCard order={item} />}
            contentContainerStyle={styles.orderList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No orders found</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  content: {
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
    maxWidth: 430,
    height: 40,
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    paddingHorizontal: 20,
    color: '#111111',
    marginRight: 20,
  },

  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#C9C9C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#666666',
    fontWeight: '800',
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

  filterRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  filterButton: {
    minWidth: 72,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginRight: 16,
  },

  filterButtonActive: {
    backgroundColor: '#1677F2',
  },

  filterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111111',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  orderList: {
    paddingBottom: 40,
  },

  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyState: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 12,
    color: '#9B9B9B',
  },
});
