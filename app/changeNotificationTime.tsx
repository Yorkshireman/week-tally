import * as Notifications from 'expo-notifications';
import { globalStyles } from '@/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Setting } from '../types';
import { TimePicker } from '../components';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  mapMinsAfterMidnightToTimeString,
  normaliseFontSize,
  scheduleDailyNotifications
} from '@/utils';
import { useColours, useDbLogger } from '@/hooks';
import { useEffect, useState } from 'react';

const ensurePermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    const result = await Notifications.requestPermissionsAsync();

    if (result.status !== 'granted') {
      Alert.alert(
        'Notifications Disabled',
        'Enable notifications in Settings to get your daily check-ins.'
      );

      return false;
    }
  }

  return true;
};

export default function ChangeNotificationTimeScreen() {
  const {
    page: { backgroundColor },
    button: { primary, secondary },
    text: { color }
  } = useColours();
  const [currentAskTime, setCurrentAskTime] = useState('');
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();
  const [selectedTime, setSelectedTime] = useState<string>('1080');
  const router = useRouter();

  useEffect(() => {
    async function setup() {
      await ensurePermissions();
      const result: Setting | null = await db.getFirstAsync(
        'SELECT value FROM settings WHERE key = ?',
        'askTime'
      );

      if (!result || !result.value) {
        return;
      }

      setSelectedTime(result.value);
      setCurrentAskTime(result.value);
    }

    setup();
  }, [db]);

  const onSavePress = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        'askTime',
        selectedTime
      );

      logDbContents();
      await scheduleDailyNotifications(db);
      setCurrentAskTime(selectedTime);
      router.back();
    } catch (e) {
      console.error('Error updating askTime value: ', e);
      setSelectedTime(currentAskTime);
    }
  };

  const onTimePickerValueChange = (itemValue: string) => setSelectedTime(itemValue);

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <View style={globalStyles.content}>
        <Text style={{ ...styles.text, color, marginBottom: 20 }}>
          Your daily notifications are currently set to be delivered at{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {mapMinsAfterMidnightToTimeString(currentAskTime)}
          </Text>
          .{'\n\n'}
          You can select a new time or tap Cancel to keep it the same.
        </Text>
        <TimePicker selectedTime={selectedTime} onValueChange={onTimePickerValueChange} />
      </View>
      <View style={{ alignSelf: 'stretch', gap: 20 }}>
        <Pressable onPress={onSavePress} style={{ ...styles.navigationButton, ...primary }}>
          <Text style={{ ...styles.navigationButtonText, color: primary.color }}>Save</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={{ ...styles.backButton, ...secondary }}>
          <Text style={{ ...styles.backButtonText, color: secondary.color }}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15
  },
  backButtonText: {
    fontSize: 18,
    textAlign: 'center'
  },
  navigationButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15
  },
  navigationButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
