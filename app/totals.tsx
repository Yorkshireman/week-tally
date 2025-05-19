import { SafeAreaView } from 'react-native-safe-area-context';
import { useDbLogger } from '@/hooks';
import { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';
import { LogEntry, Thing } from '../types';

export default function TotalsScreen() {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();

  useEffect(() => {
    async function setup() {
      try {
        // temporary code
        // const firstThing = await db.getFirstAsync<Thing>('SELECT * FROM things');
        // const nowIso = new Date().toISOString();
        // const entryId = uuid.v4();

        // await db.execAsync(
        //   `INSERT INTO entries (id, thingId, timestamp) VALUES ('${entryId}', '${firstThing?.id}', '${nowIso}');`
        // );
        // end temporary code

        logDbContents();
      } catch (e) {
        console.error('DB error: ', e);
        logDbContents();
      }
    }

    setup();
  }, [db, logDbContents]);

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
