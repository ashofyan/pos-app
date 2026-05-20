import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'OPEN_STORE';

export const saveOpenStore = async (amount: number) => {
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify({
      amount,
      opened_at: new Date().toISOString(),
    }),
  );
};

export const getOpenStore = async () => {
  const data = await AsyncStorage.getItem(KEY);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};
