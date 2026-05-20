import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {OrderHistory, OrderHistoryStatus} from '../types/order-history.types';

type Props = {
  order: OrderHistory;
  onSeeDetails?: (order: OrderHistory) => void;
};

const formatCurrency = (value: number) =>
  `Rp. ${Number(value || 0).toLocaleString('id-ID')}`;

const getStatusLabel = (status: OrderHistoryStatus) => {
  if (status === 'ready') {
    return 'Ready';
  }

  if (status === 'in_progress') {
    return 'In Progress';
  }

  return 'Completed';
};

const getStatusStyle = (status: OrderHistoryStatus) => {
  if (status === 'ready') {
    return styles.readyBadge;
  }

  if (status === 'in_progress') {
    return styles.progressBadge;
  }

  return styles.completedBadge;
};

export default function OrderHistoryCard({order, onSeeDetails}: Props) {
  const visibleItems = order.items.slice(0, 4);
  const remainingItems = Math.max(order.items.length - visibleItems.length, 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.tableBadge}>
          <Text style={styles.tableText}>{order.tableCode}</Text>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.diningType}>{order.diningType}</Text>
        </View>

        <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
          <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
        </View>
      </View>

      <View style={styles.dateRow}>
        <Text style={styles.dateText}>{order.orderDate}</Text>
        <Text style={styles.dateText}>{order.orderTime}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.tableHeader}>
        <Text style={styles.itemHeader}>Items</Text>
        <Text style={styles.qtyHeader}>Qty</Text>
        <Text style={styles.priceHeader}>Price</Text>
      </View>

      {visibleItems.map(item => (
        <View key={item.id} style={styles.itemRow}>
          <Text numberOfLines={1} style={styles.itemName}>
            {item.name}
          </Text>
          <Text style={styles.itemQty}>x{item.quantity}</Text>
          <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        </View>
      ))}

      {remainingItems > 0 && (
        <Text style={styles.moreText}>+{remainingItems} more</Text>
      )}

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => onSeeDetails?.(order)}>
        <Text style={styles.detailText}>See Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 10,
    padding: 12,
    margin: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tableBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  tableText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  orderInfo: {
    flex: 1,
  },

  orderNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111111',
  },

  diningType: {
    marginTop: 2,
    fontSize: 10,
    color: '#777777',
  },

  statusBadge: {
    minWidth: 78,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  readyBadge: {
    backgroundColor: '#149457',
  },

  progressBadge: {
    backgroundColor: '#FFC107',
  },

  completedBadge: {
    backgroundColor: '#B8B8B8',
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  dateText: {
    fontSize: 9,
    color: '#777777',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginVertical: 10,
  },

  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  itemHeader: {
    flex: 1,
    fontSize: 9,
    color: '#777777',
  },

  qtyHeader: {
    width: 34,
    fontSize: 9,
    color: '#777777',
    textAlign: 'center',
  },

  priceHeader: {
    width: 62,
    fontSize: 9,
    color: '#777777',
    textAlign: 'right',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  itemName: {
    flex: 1,
    fontSize: 10,
    color: '#111111',
  },

  itemQty: {
    width: 34,
    fontSize: 10,
    color: '#111111',
    textAlign: 'center',
  },

  itemPrice: {
    width: 62,
    fontSize: 10,
    color: '#111111',
    textAlign: 'right',
  },

  moreText: {
    marginTop: 2,
    fontSize: 9,
    color: '#777777',
    textAlign: 'center',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  totalLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111111',
  },

  totalValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111111',
  },

  detailButton: {
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F4F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1677F2',
  },
});
