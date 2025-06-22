import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAddLogEntryCount = async (): Promise<number | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('addLogEntryCount');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error getting addLogEntryCount from AsyncStorage:`, e);
    return null;
  }
};
