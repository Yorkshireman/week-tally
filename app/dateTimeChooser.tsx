import { SafeAreaView } from 'react-native-safe-area-context';
import { Setting } from '../types';
import { TimePicker } from '../components';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function DateTimeChooserScreen() {
  const db = useSQLiteContext();
  const [selectedTime, setSelectedTime] = useState<string>('1080');
  const router = useRouter();

  useEffect(() => {
    async function setup() {
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
        } catch (e) {
          console.error('Error inserting default askTime value: ', e);
        }

        setSelectedTime('1080');
      }
    }

    setup();
  }, [db]);

  const onTimePickerValueChange = async (itemValue: string) => {
    const oldValue = selectedTime;
    try {
      setSelectedTime(itemValue);
      await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        'askTime',
        itemValue
      );
    } catch (e) {
      console.error('Error updating askTime value: ', e);
      setSelectedTime(oldValue);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>
          2. Choose when you&apos;d like to be notified
        </Text>
        <Text style={{ ...styles.text, marginBottom: 20 }}>
          The app will send you a notification at a set time of your choosing each day to ask you if
          you have done your Thing that day.
        </Text>
        <TimePicker selectedTime={selectedTime} onValueChange={onTimePickerValueChange} />
        <View>
          <Text style={{ ...styles.text, marginBottom: 10 }}>Finished?</Text>
          <Pressable
            onPress={() => {
              // trigger notifications permission request
              // navigate to the next screen
            }}
          >
            <Text style={{ ...styles.navigationButton, marginBottom: 20 }}>Go to next step</Text>
          </Pressable>
          <Pressable onPress={() => router.dismissTo('/')}>
            <Text style={styles.navigationButton}>Go back</Text>
          </Pressable>
        </View>
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
