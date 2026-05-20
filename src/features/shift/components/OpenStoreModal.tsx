import React, {useState} from 'react';

import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  visible: boolean;
  onSubmit: (amount: number) => void;
}

export default function OpenStoreModal({visible, onSubmit}: Props) {
  const [amount, setAmount] = useState('');

  return (
    <Modal transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Open Store</Text>

          <Text style={styles.subtitle}>Input saldo awal kasir</Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="500000"
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => onSubmit(Number(amount))}>
            <Text style={styles.buttonText}>OPEN STORE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 24,
  },

  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
