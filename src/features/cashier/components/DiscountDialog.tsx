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

export type DiscountOption = {
  id: string;
  label: string;
  percentage?: number;
};

export type DiscountForm = {
  nominal: string;
  selectedDiscountId: string | null;
};

type Props = {
  visible: boolean;
  options: DiscountOption[];
  initialNominal: string;
  initialSelectedDiscountId: string | null;
  onClose: () => void;
  onSubmit: (form: DiscountForm) => void;
};

export const defaultDiscountOptions: DiscountOption[] = [
  {
    id: 'discount-5',
    label: 'Diskon 5%',
    percentage: 5,
  },
  {
    id: 'new-member',
    label: 'Diskon member baru',
  },
];

export const getDiscountLabel = (
  options: DiscountOption[],
  selectedDiscountId: string | null,
  nominal: string,
) => {
  const selectedOption = options.find(
    option => option.id === selectedDiscountId,
  );

  if (selectedOption) {
    return selectedOption.label;
  }

  if (nominal) {
    return `Diskon ${nominal}`;
  }

  return 'Select Diskon';
};

export default function DiscountDialog({
  visible,
  options,
  initialNominal,
  initialSelectedDiscountId,
  onClose,
  onSubmit,
}: Props) {
  const [nominal, setNominal] = useState(initialNominal);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | null>(
    initialSelectedDiscountId,
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    setNominal(initialNominal);
    setSelectedDiscountId(initialSelectedDiscountId);
  }, [initialNominal, initialSelectedDiscountId, visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Diskon</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <AppIcon name="close-outline" size={24} color="#111111" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TextInput
            value={nominal}
            onChangeText={setNominal}
            placeholder="Input nominal diskon"
            placeholderTextColor="#9B9B9B"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Select Diskon</Text>

          <View style={styles.optionList}>
            {options.length > 0 ? (
              options.map(option => {
                const selected = selectedDiscountId === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.option}
                    onPress={() => setSelectedDiscountId(option.id)}>
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
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Tidak ada diskon yang tersedia
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomDivider} />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() =>
                onSubmit({
                  nominal,
                  selectedDiscountId,
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
    maxWidth: 560,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },

  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginTop: 18,
    marginBottom: 24,
  },

  input: {
    height: 54,
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 28,
    fontSize: 14,
    color: '#111111',
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 16,
  },

  optionList: {
    minHeight: 118,
  },

  option: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#7F7F7F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 22,
  },

  radioOuterSelected: {
    borderColor: '#1677F2',
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#1677F2',
  },

  optionText: {
    fontSize: 16,
    color: '#7A7A7A',
  },

  emptyState: {
    flex: 1,
    minHeight: 118,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#7A7A7A',
  },

  bottomDivider: {
    height: 1,
    backgroundColor: '#9F9F9F',
    marginTop: 18,
    marginBottom: 18,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancelButton: {
    width: 144,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FF3333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },

  saveButton: {
    width: 144,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
