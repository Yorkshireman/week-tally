import { LogEntry } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';

export default function TotalsScreen() {
  const db = useSQLiteContext();

  useEffect(() => {
    async function setup() {
      try {
        const result: LogEntry[] = await db.getAllAsync('SELECT * from entries');
        console.log('Entries: ', result);
      } catch (e) {
        console.error('DB error: ', e);
      }
    }

    setup();
  }, [db]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>Totals</Text>
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
  text: {
    color: '#2D2A32',
    fontSize: 20,
    textAlign: 'center'
  }
});
