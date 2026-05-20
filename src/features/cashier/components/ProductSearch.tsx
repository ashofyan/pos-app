import React from 'react';

import {TextInput, StyleSheet, StyleProp, TextStyle} from 'react-native';

interface Props {
  value: string;

  onChange: (value: string) => void;

  style?: StyleProp<TextStyle>;
}

export default function ProductSearch({value, onChange, style}: Props) {
  return (
    <TextInput
      placeholder="Search"
      value={value}
      onChangeText={onChange}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#EFEFEF',

    borderRadius: 18,

    paddingHorizontal: 20,
    paddingVertical: 12,

    color: '#111111',
  },
});
