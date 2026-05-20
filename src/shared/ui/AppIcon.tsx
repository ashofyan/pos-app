import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export default function AppIcon({name, size = 24, color = '#111827'}: Props) {
  return <Ionicons name={name} size={size} color={color} />;
}
