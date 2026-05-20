import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AppIcon from '../../../shared/ui/AppIcon';

export type OrderType = 'take-away' | 'dine-in';

type OrderTypeForm = {
  orderType: OrderType;
  tableNumber: string;
};

type Props = {
  visible: boolean;
  initialOrderType: OrderType | null;
  initialTableNumber: string;
  onClose: () => void;
  onSubmit: (form: OrderTypeForm) => void;
};

const orderTypeOptions: Array<{label: string; value: OrderType}> = [
  {
    label: 'Take-away',
    value: 'take-away',
  },
  {
    label: 'Dine-in',
    value: 'dine-in',
  },
];

export const getOrderTypeLabel = (orderType: OrderType | null) => {
  if (orderType === 'take-away') {
    return 'Take-away';
  }

  if (orderType === 'dine-in') {
    return 'Dine-in';
  }

  return 'Select Order Type';
};

export default function OrderTypeDialog({
  visible,
  initialOrderType,
  initialTableNumber,
  onClose,
  onSubmit,
}: Props) {
  const [orderType, setOrderType] = useState<OrderType>(
    initialOrderType || 'take-away',
  );
  const [tableNumber, setTableNumber] = useState(initialTableNumber);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setOrderType(initialOrderType || 'take-away');
    setTableNumber(initialTableNumber);
  }, [initialOrderType, initialTableNumber, visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Order Type</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <AppIcon name="close-outline" size={22} color="#111111" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.optionRow}>
            {orderTypeOptions.map(option => {
              const selected = orderType === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.option}
                  onPress={() => setOrderType(option.value)}>
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterSelected,
                    ]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>Number Table</Text>
          <TextInput
            value={tableNumber}
            onChangeText={setTableNumber}
            placeholder="Input Table Number"
            placeholderTextColor="#A7A7A7"
            keyboardType="number-pad"
            style={styles.input}
          />

          <View style={styles.bottomDivider} />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() =>
                onSubmit({
                  orderType,
                  tableNumber,
                })
              }>
              <Text style={styles.saveText}>Simpan</Text>
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
    maxWidth: 430,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 10,
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
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#D8D8D8',
    marginTop: 12,
    marginBottom: 16,
  },

  optionRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  option: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 12,
  },

  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7F7F7F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  radioOuterSelected: {
    borderColor: '#1677F2',
  },

  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1677F2',
  },

  optionText: {
    fontSize: 12,
    color: '#6F6F6F',
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 10,
  },

  input: {
    height: 40,
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#111111',
  },

  bottomDivider: {
    height: 1,
    backgroundColor: '#D8D8D8',
    marginTop: 28,
    marginBottom: 14,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancelButton: {
    width: 110,
    height: 40,
    borderRadius: 9,
    backgroundColor: '#FF3333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  saveButton: {
    width: 110,
    height: 40,
    borderRadius: 9,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  saveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
