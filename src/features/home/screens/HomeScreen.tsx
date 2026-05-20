import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {useAuthStore} from '../../auth/store/auth.store';

export default function HomeScreen() {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Berhasil</Text>

      <Text style={styles.subtitle}>Welcome {user?.name}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  subtitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 32,
  },

  button: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
