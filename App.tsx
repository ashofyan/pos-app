import React from 'react';

import AppNavigator from './src/app/navigation/AppNavigator';

import {useInitializeShift} from './src/features/shift/hooks/useInitializeShift';

export default function App() {
  const {loading} = useInitializeShift();

  if (loading) {
    return null;
  }

  return <AppNavigator />;
}
