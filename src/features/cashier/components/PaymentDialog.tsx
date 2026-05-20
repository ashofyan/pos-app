import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AppIcon from '../../../shared/ui/AppIcon';

export type PaymentMethod = 'cash' | 'transfer-bca' | 'transfer-bni' | 'qris';

type PaymentItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  visible: boolean;
  customerName: string;
  orderNumber: string;
  cashierName: string;
  items: PaymentItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  loading?: boolean;
  onClose: () => void;
  onPay: (method: PaymentMethod, paidAmount: number) => void;
};

const paymentMethods: Array<{label: string; value: PaymentMethod}> = [
  {
    label: 'CASH',
    value: 'cash',
  },
  {
    label: 'TRANSFER BANK BCA',
    value: 'transfer-bca',
  },
  {
    label: 'TRANSFER BANK BNI',
    value: 'transfer-bni',
  },
  {
    label: 'QRIS',
    value: 'qris',
  },
];

const formatCurrency = (value: number) =>
  `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

const getSuggestedCashAmounts = (total: number) => {
  if (total <= 0) {
    return [50000, 100000, 150000];
  }

  const roundedTotal = Math.ceil(total / 50000) * 50000;

  return Array.from(
    new Set([roundedTotal, roundedTotal + 50000, roundedTotal + 100000]),
  );
};

const parseAmount = (value: string) => Number(value.replace(/[^\d]/g, ''));

const getTransferAccount = (method: PaymentMethod) => {
  if (method === 'transfer-bni') {
    return 'BNI - 1325135268 a/n Rindang Jaya';
  }

  return 'BCA - 1325135268 a/n Rindang Jaya';
};

function Radio({selected}: {selected: boolean}) {
  return (
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
  );
}

function QrisPreview() {
  return (
    <View style={styles.qrisGrid}>
      {Array.from({length: 49}).map((_, index) => {
        const active = [
          0, 1, 2, 6, 7, 8, 9, 13, 14, 16, 18, 20, 22, 24, 27, 28, 29, 31, 34,
          35, 37, 39, 41, 42, 43, 47, 48,
        ].includes(index);

        return (
          <View
            key={index}
            style={[styles.qrisCell, active && styles.qrisCellActive]}
          />
        );
      })}
    </View>
  );
}

export default function PaymentDialog({
  visible,
  customerName,
  orderNumber,
  cashierName,
  items,
  subtotal,
  tax,
  discount,
  total,
  loading = false,
  onClose,
  onPay,
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cashAmount, setCashAmount] = useState('');

  const isTransfer =
    paymentMethod === 'transfer-bca' || paymentMethod === 'transfer-bni';
  const suggestedCashAmounts = getSuggestedCashAmounts(total);
  const receivedAmount =
    paymentMethod === 'cash' ? parseAmount(cashAmount) : total;
  const changeAmount = Math.max(receivedAmount - total, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialogRow}>
          <View style={styles.mainCard}>
            <View style={styles.header}>
              <Text style={styles.title}>Payment Methode</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <AppIcon name="close-outline" size={24} color="#111111" />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.mainContent}>
                <View style={styles.summaryPane}>
                  <View style={styles.customerInfo}>
                    <Text style={styles.infoTitle}>Info Customer</Text>
                    <View style={styles.customerInfoRow}>
                      <View style={styles.infoStack}>
                        <View style={styles.infoLine}>
                          <Text style={styles.infoLabel}>Nama Customer</Text>
                          <Text style={styles.infoValue}>
                            {customerName || 'customer_name'}
                          </Text>
                        </View>
                        <View style={styles.infoLine}>
                          <Text style={styles.infoLabel}>Nomor Order/Meja</Text>
                          <Text style={styles.infoValue}>{orderNumber}</Text>
                        </View>
                        <View style={styles.infoLine}>
                          <Text style={styles.infoLabel}>Nama Kasir</Text>
                          <Text style={styles.infoValue}>{cashierName}</Text>
                        </View>
                      </View>
                      <Text style={styles.infoDate}>
                        Wed, July 12, 2025{'\n'}08:12 PM
                      </Text>
                    </View>
                  </View>

                  <View style={styles.transactionCard}>
                    <Text style={styles.sectionTitle}>Transaction Details</Text>

                    {items.map(item => (
                      <View key={item.id} style={styles.receiptItem}>
                        <View style={styles.receiptItemInfo}>
                          <Text
                            numberOfLines={1}
                            style={styles.receiptItemName}>
                            {item.name}
                          </Text>
                          <Text style={styles.receiptItemPrice}>
                            {formatCurrency(item.price)}
                          </Text>
                        </View>
                        <Text style={styles.receiptItemQuantity}>
                          x{item.quantity}
                        </Text>
                        <Text style={styles.receiptItemTotal}>
                          {formatCurrency(item.price * item.quantity)}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.receiptDividerDashed} />

                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>
                        Items ({itemCount})
                      </Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(subtotal)}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(subtotal)}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.mutedLabel}>Tax</Text>
                      <Text style={styles.mutedValue}>
                        {formatCurrency(tax)}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.mutedLabel}>Discount</Text>
                      <Text style={styles.mutedValue}>
                        {formatCurrency(discount)}
                      </Text>
                    </View>

                    <View style={styles.totalRow}>
                      <Text style={styles.summaryLabel}>Total</Text>
                      <Text style={styles.summaryValue}>
                        {formatCurrency(total)}
                      </Text>
                    </View>
                    {paymentMethod === 'cash' && (
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Change</Text>
                        <Text style={styles.summaryValue}>
                          {formatCurrency(changeAmount)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.paymentPane}>
                  <View style={styles.methodCard}>
                    <Text style={styles.sectionTitle}>
                      Select Methode Payment
                    </Text>
                    <View style={styles.methodGrid}>
                      {paymentMethods.map(method => (
                        <TouchableOpacity
                          key={method.value}
                          style={styles.methodOption}
                          onPress={() => setPaymentMethod(method.value)}>
                          <Radio selected={paymentMethod === method.value} />
                          <Text style={styles.methodText}>{method.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.paymentCard}>
                    <Text style={styles.sectionTitle}>
                      {paymentMethod === 'cash'
                        ? 'Pembayaran Tunai'
                        : isTransfer
                        ? 'Transfer'
                        : 'Pembayaran QRIS'}
                    </Text>

                    {paymentMethod === 'cash' && (
                      <>
                        <TextInput
                          value={cashAmount}
                          onChangeText={setCashAmount}
                          placeholder="Rp"
                          placeholderTextColor="#9B9B9B"
                          keyboardType="numeric"
                          style={styles.cashInput}
                        />
                        <View style={styles.cashOptionRow}>
                          {suggestedCashAmounts.map(amount => (
                            <TouchableOpacity
                              key={amount}
                              style={styles.cashOption}
                              onPress={() => setCashAmount(String(amount))}>
                              <Radio selected={cashAmount === String(amount)} />
                              <Text style={styles.cashOptionText}>
                                {formatCurrency(amount)}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View style={styles.keypad}>
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
                            value => (
                              <TouchableOpacity
                                key={value}
                                style={styles.keypadButton}
                                onPress={() =>
                                  setCashAmount(current => current + value)
                                }>
                                <Text style={styles.keypadText}>{value}</Text>
                              </TouchableOpacity>
                            ),
                          )}
                          <View style={styles.keypadSpacer} />
                          <TouchableOpacity
                            style={styles.keypadButton}
                            onPress={() =>
                              setCashAmount(current => current + '0')
                            }>
                            <Text style={styles.keypadText}>0</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.keypadButton}
                            onPress={() =>
                              setCashAmount(current => current.slice(0, -1))
                            }>
                            <AppIcon
                              name="backspace-outline"
                              size={24}
                              color="#111111"
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {isTransfer && (
                      <>
                        <View style={styles.transferAccount}>
                          <Text style={styles.transferText}>
                            {getTransferAccount(paymentMethod)}
                          </Text>
                        </View>
                        <View style={styles.transferRow}>
                          <Text style={styles.transferLabel}>Nominal :</Text>
                          <View style={styles.transferNominal}>
                            <Text style={styles.transferNominalText}>
                              {formatCurrency(total)}
                            </Text>
                          </View>
                        </View>
                      </>
                    )}

                    {paymentMethod === 'qris' && (
                      <>
                        <Text style={styles.qrisTitle}>
                          QRIS - SEJAHTERA WIN WIN
                        </Text>
                        <Text style={styles.qrisNmid}>
                          NMID: 198125629849874516519858
                        </Text>
                        <QrisPreview />
                        <Text style={styles.qrisTotalTitle}>
                          TOTAL NOMINAL DIBAYARKAN
                        </Text>
                        <View style={styles.qrisTotal}>
                          <Text style={styles.qrisTotalText}>
                            {formatCurrency(total)}
                          </Text>
                        </View>
                      </>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.payButton,
                        loading && styles.payButtonDisabled,
                      ]}
                      disabled={loading}
                      onPress={() => onPay(paymentMethod, receivedAmount)}>
                      <Text style={styles.payText}>
                        {loading ? 'Processing...' : 'Pay'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
  },

  dialogRow: {
    width: '100%',
    maxWidth: 1040,
    maxHeight: '92%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  mainCard: {
    flex: 1,
    minWidth: 760,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
  },

  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginTop: 14,
  },

  scrollArea: {
    flexGrow: 0,
    marginTop: 14,
  },

  scrollContent: {
    paddingBottom: 4,
  },

  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  summaryPane: {
    width: 260,
    paddingRight: 22,
  },

  customerInfo: {
    marginBottom: 16,
  },

  infoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 12,
  },

  customerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoStack: {
    flex: 1,
    paddingRight: 12,
  },

  infoLine: {
    marginBottom: 8,
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111111',
  },

  infoValue: {
    marginTop: 4,
    fontSize: 9,
    color: '#777777',
  },

  infoDate: {
    fontSize: 9,
    color: '#777777',
    textAlign: 'right',
    lineHeight: 13,
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 6,
  },

  paymentPane: {
    flex: 1,
  },

  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 5,
  },

  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 16,
  },

  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  methodOption: {
    width: '48%',
    height: 34,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: '2%',
    marginBottom: 12,
  },

  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7A7A7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  radioOuterSelected: {
    borderColor: '#7A7A7A',
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#7A7A7A',
  },

  methodText: {
    flex: 1,
    fontSize: 11,
    color: '#777777',
  },

  cashInput: {
    height: 38,
    width: '100%',
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 20,
    fontSize: 11,
    color: '#111111',
    marginBottom: 14,
  },

  cashOptionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  cashOption: {
    flex: 1,
    height: 34,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 8,
  },

  cashOptionText: {
    fontSize: 11,
    color: '#777777',
  },

  keypad: {
    width: 270,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 16,
  },

  keypadButton: {
    width: 90,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },

  keypadSpacer: {
    width: 90,
    height: 56,
  },

  keypadText: {
    fontSize: 28,
    color: '#111111',
  },

  transferAccount: {
    height: 38,
    width: '100%',
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
  },

  transferText: {
    fontSize: 11,
    color: '#111111',
  },

  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transferLabel: {
    fontSize: 13,
    color: '#111111',
    marginRight: 12,
  },

  transferNominal: {
    height: 38,
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  transferNominalText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },

  qrisTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 16,
  },

  qrisNmid: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
    marginBottom: 28,
  },

  qrisGrid: {
    width: 150,
    height: 150,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    marginBottom: 28,
  },

  qrisCell: {
    width: 19,
    height: 19,
    margin: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  qrisCellActive: {
    backgroundColor: '#000000',
  },

  qrisTotalTitle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 12,
  },

  qrisTotal: {
    width: 160,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#D8D8D8',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qrisTotalText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
  },

  receiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  receiptItemInfo: {
    flex: 1,
  },

  receiptItemName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111111',
  },

  receiptItemPrice: {
    fontSize: 10,
    color: '#111111',
    marginTop: 2,
  },

  receiptItemQuantity: {
    width: 30,
    fontSize: 10,
    color: '#111111',
    textAlign: 'center',
  },

  receiptItemTotal: {
    width: 54,
    fontSize: 10,
    color: '#111111',
    textAlign: 'right',
  },

  receiptDividerDashed: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BEBEBE',
    marginTop: 12,
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111111',
  },

  summaryValue: {
    fontSize: 10,
    fontWeight: '800',
    color: '#111111',
  },

  mutedLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B5B5B5',
  },

  mutedValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B5B5B5',
  },

  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#BEBEBE',
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  payButton: {
    width: 260,
    height: 36,
    borderRadius: 24,
    marginTop: 24,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  payButtonDisabled: {
    backgroundColor: '#9BC7FF',
  },

  payText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
