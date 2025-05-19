import { dbSetupString } from '@/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDbLogger } from '@/hooks';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LogEntry, Thing, ThingWithLogEntriesCount } from '../types';
import { useEffect, useState } from 'react';

const startOfWeekDate = (now: Date): Date => {
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? 6 : day - 1; // 0 if Monday, 1 if Tuesday, ..., 6 if Sunday
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

export default function TotalsScreen() {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();
  const router = useRouter();
  const [totals, setTotals] = useState<ThingWithLogEntriesCount[]>();

  useEffect(() => {
    async function setup() {
      try {
        logDbContents();
        const logEntries = await db.getAllAsync<LogEntry>('SELECT * FROM entries');
        const now = new Date();
        const things = await db.getAllAsync<Thing>('SELECT * FROM things');

        setTotals(
          things.map(({ id, title }) => {
            const logEntriesForThisThing = logEntries.filter(logEntry => logEntry.thingId === id);
            const totalForThisWeek = logEntriesForThisThing.filter(logEntry => {
              const logEntryDate = new Date(logEntry.timestamp);
              return logEntryDate >= startOfWeekDate(now) && logEntryDate <= now;
            }).length;

            return {
              count: totalForThisWeek,
              id,
              title
            };
          })
        );
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
        <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 40 }}>
          Totals This Week
        </Text>
        <FlatList
          data={totals}
          renderItem={({ item: { count, title } }) => (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
            >
              <Text style={{ ...styles.text, fontWeight: 'bold' }}>
                {title}: {count}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={styles.list}
        />
        <Pressable
          onPress={async () => {
            console.log('Clearing the database');
            try {
              await db.execAsync('DROP TABLE IF EXISTS things;');
              await db.execAsync('DROP TABLE IF EXISTS settings;');
              await db.execAsync('DROP TABLE IF EXISTS entries;');
              await db.execAsync(dbSetupString);
              logDbContents();
              router.replace('/');
            } catch (e) {
              console.error('DB error: ', e);
              logDbContents();
            }
          }}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>Reset the app</Text>
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
  list: {
    alignSelf: 'stretch',
    marginBottom: 20,
    maxHeight: '80%'
  },
  resetButton: {
    backgroundColor: '#2D2A32',
    borderRadius: 10,
    marginTop: 40,
    padding: 10,
    width: 150
  },
  resetButtonText: {
    color: '#D0FEF5',
    fontSize: 18,
    textAlign: 'center'
  },
  text: {
    color: '#2D2A32',
    fontSize: 24,
    textAlign: 'center'
  }
});
