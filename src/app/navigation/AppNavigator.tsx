import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../../features/auth/screens/LoginScreen';

import CashierDashboardScreen from '../../features/cashier/screens/CashierDashboardScreen';

import OrderHistoryScreen from '../../features/cashier/screens/OrderHistoryScreen';

import {useAuthStore} from '../../features/auth/store/auth.store';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAuthStore(state => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {token ? (
          <>
            <Stack.Screen
              name="CashierDashboard"
              component={CashierDashboardScreen}
            />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
