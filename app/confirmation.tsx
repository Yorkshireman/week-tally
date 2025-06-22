import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  minutesAfterMidnightToTimeString,
  normaliseFontSize,
  scheduleDailyNotifications
} from '@/utils';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColours, useDbLogger, useGlobalStyles } from '@/hooks';
import { useEffect, useState } from 'react';

export default function ConfirmationScreen() {
  const {
    button: { primary },
    page: { backgroundColor },
    text: { color }
  } = useColours();
  const db = useSQLiteContext();
  const globalStyles = useGlobalStyles();
  const logDbContents = useDbLogger();
  const [notificationTime, setNotificationTime] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAskTimeSetting = async () => {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        'askTime'
      );

      const askTime = row?.value;
      const askTimeString = askTime ? minutesAfterMidnightToTimeString(Number(askTime)) : '';
      setNotificationTime(askTimeString);
    };

    const setSetupComplete = async () => {
      await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        'setupComplete',
        'true'
      );

      logDbContents();
    };

    fetchAskTimeSetting();
    scheduleDailyNotifications(db);
    setSetupComplete();
  }, [db, logDbContents]);

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <View style={{ ...globalStyles.content, gap: 20 }}>
        <Text
          style={{ ...styles.text, color, fontSize: normaliseFontSize(20), fontWeight: 'bold' }}
        >
          You&apos;re done!
        </Text>
        <Text style={{ ...styles.text, color }}>
          You&apos;ll get daily notifications at {notificationTime} asking you to update your
          totals.
        </Text>
        <Text style={{ ...styles.text, color }}>
          Come back here anytime to view or update your running totals if you missed a notification.
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/totals');
          }}
          style={{ ...styles.navigationButton, ...primary }}
        >
          <Text style={{ ...styles.navigationButtonText, color: primary.color }}>Go to Totals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navigationButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 15
  },
  navigationButtonText: {
    fontSize: normaliseFontSize(18),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  text: {
    fontSize: normaliseFontSize(18),
    textAlign: 'center'
  }
});
