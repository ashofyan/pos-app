import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {loginRequest} from '../api/auth.api';
import {useAuthStore} from '../store/auth.store';

export default function LoginScreen() {
  const setAuth = useAuthStore(state => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginRequest({
        email,
        password,
      });

      setAuth(response.data.user, response.data.tenant);
    } catch (error: any) {
      console.log(
        'RESPONS ERROR LOGIN',
        JSON.stringify(error?.response?.data.message),
      );

      Alert.alert(JSON.stringify(error?.response?.data.message));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>POS Login</Text>

        <Text style={styles.subtitle}>Sign in to Dashboard Cashier</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#B8B8B8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#B8B8B8"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    width: '100%',
    maxWidth: 366,
    minHeight: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 34,
    paddingVertical: 56,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,

    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 38,
  },

  input: {
    height: 53,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    paddingHorizontal: 21,
    fontSize: 15,
    color: '#111111',
    marginBottom: 21,
  },

  button: {
    height: 53,
    backgroundColor: '#1F78FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 27,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
