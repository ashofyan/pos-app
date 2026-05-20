import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AppIcon from '../../../shared/ui/AppIcon';

type Props = {
  visible: boolean;
  orderNumber: string;
  orderDate: string;
  onNewOrder: () => void;
  onPrintCopy: () => void;
};

export default function CheckoutSuccessDialog({
  visible,
  orderNumber,
  orderDate,
  onNewOrder,
  onPrintCopy,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <AppIcon name="checkmark-circle-outline" size={100} color="#63A900" />

          <Text style={styles.title}>Order Success!</Text>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Number</Text>
              <Text style={styles.infoValue}>{orderNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Date</Text>
              <Text style={styles.infoValue}>{orderDate}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.newOrderButton}
              onPress={onNewOrder}>
              <Text style={styles.buttonText}>Pesanan Baru</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.printButton} onPress={onPrintCopy}>
              <Text style={styles.buttonText}>Print Copy</Text>
            </TouchableOpacity>
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
    padding: 24,
  },

  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 76,
    paddingTop: 36,
    paddingBottom: 34,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    marginTop: 8,
    marginBottom: 30,
  },

  infoBox: {
    width: '100%',
    backgroundColor: '#F6F7FA',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 22,
    marginBottom: 48,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  infoLabel: {
    fontSize: 15,
    color: '#777777',
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },

  actionRow: {
    flexDirection: 'row',
  },

  newOrderButton: {
    width: 170,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#62A700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  printButton: {
    width: 140,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
