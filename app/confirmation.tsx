import { SafeAreaView } from 'react-native-safe-area-context';
import { useDbLogger } from '@/hooks';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';

const minutesAfterMidnightToTimeString = (minutesAfterMidnight: number) => {
  const hour = Math.floor(minutesAfterMidnight / 60);
  const min = minutesAfterMidnight % 60;
  const period = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${min.toString().padStart(2, '0')}${period}`;
};

export default function ConfirmationScreen() {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();
  const [notificationTime, setNotificationTime] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        'askTime'
      );

      const askTime = row?.value ? minutesAfterMidnightToTimeString(Number(row.value)) : '';
      setNotificationTime(askTime);
    };

    const setSetupComplete = async () => {
      await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        'setupComplete',
        'true'
      );

      logDbContents();
    };

    fetchSettings();
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
