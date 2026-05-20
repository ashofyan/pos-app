import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';

import AppIcon from '../../../shared/ui/AppIcon';

type SidebarItem = 'cashier' | 'history' | 'settings';

type Props = {
  activeItem: SidebarItem;
};

const getIconColor = (active: boolean) => (active ? '#1677F2' : '#FFFFFF');

export default function CashierSidebar({activeItem}: Props) {
  const navigation = useNavigation<any>();

  const navigateToCashier = () => {
    navigation.dispatch(CommonActions.navigate('CashierDashboard'));
  };

  const navigateToHistory = () => {
    navigation.dispatch(CommonActions.navigate('OrderHistory'));
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity
        activeOpacity={0.75}
        hitSlop={8}
        style={[
          styles.sidebarButton,
          activeItem === 'cashier' && styles.sidebarButtonActive,
        ]}
        onPress={navigateToCashier}>
        <AppIcon
          name="storefront"
          size={20}
          color={getIconColor(activeItem === 'cashier')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        hitSlop={8}
        style={[
          styles.sidebarButton,
          activeItem === 'history' && styles.sidebarButtonActive,
        ]}
        onPress={navigateToHistory}>
        <AppIcon
          name="receipt-outline"
          size={20}
          color={getIconColor(activeItem === 'history')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        hitSlop={8}
        style={[
          styles.sidebarButton,
          activeItem === 'settings' && styles.sidebarButtonActive,
        ]}>
        <AppIcon
          name="settings-outline"
          size={20}
          color={getIconColor(activeItem === 'settings')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 54,
    backgroundColor: '#1677F2',
    alignItems: 'center',
    paddingTop: 54,
    zIndex: 10,
    elevation: 10,
  },

  sidebarButton: {
    width: 54,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  sidebarButtonActive: {
    backgroundColor: '#FFFFFF',
    width: 34,
    borderRadius: 8,
  },
});
