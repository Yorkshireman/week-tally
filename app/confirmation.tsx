// import * as Notifications from 'expo-notifications';
// import { NotificationDataType } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDbLogger } from '@/hooks';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { minutesAfterMidnightToTimeString, scheduleDailyNotifications } from '@/utils';
import { useEffect, useState } from 'react';

export default function ConfirmationScreen() {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>
          You&apos;re done!
        </Text>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          You&apos;ll get daily notifications at {notificationTime} asking you to update your
          totals.
        </Text>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          The totals reset to zero at midnight every Sunday.
        </Text>
        <Text style={{ ...styles.text, marginBottom: 40 }}>
          Come back here anytime to view or update your running totals if you missed a notification.
        </Text>
        <Pressable onPress={() => router.replace('/totals')} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Roger! Take me to my running totals</Text>
        </Pressable>
        {/* <Pressable
          onPress={async () => {
            const notificationParams: Notifications.NotificationRequestInput = {
              content: {
                title: 'Tap to update your totals'
              },
              trigger: {
                repeats: false,
                seconds: 4,
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
              }
            };

            await Notifications.scheduleNotificationAsync(notificationParams);
          }}
          style={{ marginTop: 30 }}
        >
          <Text style={styles.navigationButton}>Trigger notifications</Text>
        </Pressable> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FEFD',
    flex: 1,
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40
  },
  navigationButton: {
    backgroundColor: '#156F6D',
    borderRadius: 10,
    marginBottom: 20,
    padding: 12,
    width: 330
  },
  navigationButtonText: {
    color: '#F0FEFD',
    fontSize: 18,
    textAlign: 'center'
  },
  text: {
    color: '#2D2A32',
    fontSize: 20,
    textAlign: 'center'
  }
});
