import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

interface Props {
  cashierName?: string;

  openingBalance?: number;
}

export default function ShiftInfoCard({cashierName, openingBalance}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Shift Aktif</Text>

      <Text style={styles.text}>Kasir: {cashierName}</Text>

      <Text style={styles.text}>
        Saldo Awal: Rp {Number(openingBalance || 0).toLocaleString('id-ID')}
      </Text>

      <Text style={styles.badge}>OPEN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 20,

    marginBottom: 20,

    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',

    color: '#111827',

    marginBottom: 12,
  },

  text: {
    color: '#4B5563',

    marginBottom: 6,
  },

  badge: {
    marginTop: 12,

    backgroundColor: '#DCFCE7',

    color: '#166534',

    alignSelf: 'flex-start',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 999,

    fontWeight: '700',
  },
});
