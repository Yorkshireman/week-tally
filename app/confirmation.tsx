import * as Notifications from 'expo-notifications';
import { NotificationDataType } from '@/types';
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
          You&apos;ll get daily notifications at {notificationTime} asking you to say whether or not
          you have done your Thing, and on Sunday at the same time you&apos;ll get a notification
          inviting you to view your weekly totals.
        </Text>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          Come back here anytime to view your running totals or update a total if you missed a
          notification.
        </Text>
        <Pressable onPress={() => router.replace('/totals')}>
          <Text style={styles.navigationButton}>Roger! Take me to my running totals</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            const things = await db.getAllAsync<{ id: string; title: string }>(
              'SELECT id, title FROM things;',
              []
            );

            things.forEach(async ({ id: thingId, title }) => {
              const notificationParams: Notifications.NotificationRequestInput = {
                content: {
                  body: "Tap if you did, or ignore/dismiss this notification if you didn't",
                  data: { thingId: thingId } as NotificationDataType,
                  title: `Have you done ${title} today?`
                },
                trigger: {
                  repeats: false,
                  seconds: 4,
                  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
                }
              };

              await Notifications.scheduleNotificationAsync(notificationParams);

              console.log(
                'Scheduled daily notification with params: ',
                JSON.stringify(notificationParams, null, 2)
              );
            });
          }}
          style={{ marginTop: 30 }}
        >
          <Text style={styles.navigationButton}>Trigger notifications</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D0FEF5',
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
    color: '#007AFF',
    fontSize: 20,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  text: {
    color: '#2D2A32',
    fontSize: 20,
    textAlign: 'center'
  }
});
