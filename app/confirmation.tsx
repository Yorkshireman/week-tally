import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { minutesAfterMidnightToTimeString, scheduleDailyNotifications } from '@/utils';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColours, useDbLogger } from '@/hooks';
import { useEffect, useState } from 'react';

export default function ConfirmationScreen() {
  const {
    button: { primary },
    page: { backgroundColor },
    text: { color }
  } = useColours();
  const db = useSQLiteContext();
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
    <SafeAreaView style={{ ...styles.container, backgroundColor }}>
      <View style={styles.content}>
        <Text style={{ ...styles.text, color, fontWeight: 'bold' }}>You&apos;re done!</Text>
        <Text style={{ ...styles.text, color }}>
          You&apos;ll get daily notifications at {notificationTime} asking you to update your
          totals.
        </Text>
        <Text style={{ ...styles.text, color }}>
          The totals reset to zero at midnight every Sunday.
        </Text>
        <Text style={{ ...styles.text, color }}>
          Come back here anytime to view or update your running totals if you missed a notification.
        </Text>
      </View>
      <View>
        <Pressable
          onPress={() => router.replace('/totals')}
          style={{ ...styles.navigationButton, ...primary }}
        >
          <Text style={{ ...styles.navigationButtonText, color: primary.color }}>
            Roger! Take me to my running totals
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingHorizontal: '25%',
    paddingVertical: '25%'
  },
  content: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center'
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
    fontSize: 20,
    textAlign: 'center'
  }
});
