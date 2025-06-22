import AsyncStorage from '@react-native-async-storage/async-storage';

export const incrementAddLogEntryCount = async (currentAddLogEntryCount: number | null) => {
  try {
    const newCount = currentAddLogEntryCount ? currentAddLogEntryCount + 1 : 1;
    await AsyncStorage.setItem('addLogEntryCount', newCount.toString());
  } catch (e) {
    console.error(`Error incrementing addLogEntryCount in AsyncStorage:`, e);
  }
};
