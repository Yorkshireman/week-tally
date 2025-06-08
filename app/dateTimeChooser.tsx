import * as Notifications from 'expo-notifications';
import { globalStyles } from '@/styles';
import { normaliseFontSize } from '@/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Setting } from '../types';
import { TimePicker } from '../components';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
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

export default function DateTimeChooserScreen() {
  const {
    page: { backgroundColor },
    text: { color },
    button: { primary, secondary }
  } = useColours();
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

      if (result && result.value) {
        setSelectedTime(result.value);
      } else {
        try {
          await db.runAsync(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            'askTime',
            '1080'
          );

          logDbContents();
        } catch (e) {
          console.error('Error inserting default askTime value: ', e);
        }

        setSelectedTime('1080');
      }
    }

    setup();
  }, [db, logDbContents]);

  const onTimePickerValueChange = async (itemValue: string) => {
    const oldValue = selectedTime;
    try {
      setSelectedTime(itemValue);
      await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        'askTime',
        itemValue
      );

      logDbContents();
    } catch (e) {
      console.error('Error updating askTime value: ', e);
      setSelectedTime(oldValue);
    }
  };

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <View style={globalStyles.content}>
        <Text style={{ ...styles.text, color, marginBottom: 20 }}>
          2. Choose when you&apos;d like to be notified each day to update your totals
        </Text>
        <TimePicker selectedTime={selectedTime} onValueChange={onTimePickerValueChange} />
      </View>
      <View style={{ alignSelf: 'stretch', gap: 20 }}>
        <Pressable
          onPress={() => router.replace('/confirmation')}
          style={{ ...styles.navigationButton, ...primary }}
        >
          <Text style={{ ...styles.navigationButtonText, color: primary.color }}>
            Go to next step
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.dismissTo('/')}
          style={{ ...styles.backButton, ...secondary }}
        >
          <Text style={{ ...styles.backButtonText, color: secondary.color }}>Go back</Text>
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
    fontSize: normaliseFontSize(24),
    textAlign: 'center'
  }
});
