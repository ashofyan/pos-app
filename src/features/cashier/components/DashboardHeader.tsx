import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

interface Props {
  name?: string;
}

export default function DashboardHeader({name}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cashier POS</Text>

      <Text style={styles.subtitle}>Welcome {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 15,
  },
});
