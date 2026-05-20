import React from 'react';
import {View, StyleSheet, ViewProps} from 'react-native';

export default function AppCard(props: ViewProps) {
  return (
    <View style={styles.card} {...props}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 6,
  },
});
