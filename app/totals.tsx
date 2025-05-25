import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import {
  AppState,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { LogEntry, Thing, ThingWithLogEntriesCount } from '../types';
import { useDbLogger, useResetApp } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

const startOfWeekDate = (now: Date): Date => {
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? 6 : day - 1; // 0 if Monday, 1 if Tuesday, ..., 6 if Sunday
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

export default function TotalsScreen() {
  const appState = useRef(AppState.currentState);
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const logDbContents = useDbLogger();
  const resetApp = useResetApp();
  const [totals, setTotals] = useState<ThingWithLogEntriesCount[]>();

  useEffect(() => {
    const fetchAndSetTotals = async () => {
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
    };

    if (isFocused) {
      fetchAndSetTotals();
    }
    // Listen for app coming to the foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active' && isFocused) {
        fetchAndSetTotals();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [db, isFocused, logDbContents]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <FlatList
          data={totals}
          ListHeaderComponent={
            <>
              <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 20 }}>Totals</Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: 20,
                  justifyContent: 'center',
                  marginBottom: 40
                }}
              >
                <Pressable>
                  <Text>{'<'}</Text>
                </Pressable>
                <Text style={styles.text}>This week</Text>
                <Pressable>
                  <Text>{'>'}</Text>
                </Pressable>
              </View>
            </>
          }
          renderItem={({ item: { count, title, id } }) => (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                paddingHorizontal: 50
              }}
            >
              <Pressable
                onPress={async () => {
                  if (count > 0) {
                    const latestEntry = await db.getFirstAsync<{ id: string }>(
                      'SELECT id FROM entries WHERE thingId = ? ORDER BY timestamp DESC LIMIT 1',
                      id
                    );

                    if (!latestEntry) {
                      return console.error('No entry found for this thing');
                    }

                    await db.runAsync('DELETE FROM entries WHERE id = ?', latestEntry.id);
                    setTotals(prev =>
                      prev?.map(t => (t.id === id ? { ...t, count: t.count - 1 } : t))
                    );
                  }
                }}
                disabled={count === 0}
                style={{
                  alignItems: 'center',
                  marginRight: 10,
                  opacity: count === 0 ? 0.3 : 1,
                  width: 40
                }}
              >
                <Text style={{ color: count === 0 ? '#aaa' : styles.text.color, fontSize: 28 }}>
                  -
                </Text>
              </Pressable>
              <Text
                style={{
                  ...styles.text,
                  fontWeight: 'bold',
                  minWidth: 120,
                  textAlign: 'center'
                }}
              >
                {title}: {count}
              </Text>
              <Pressable
                onPress={async () => {
                  try {
                    const entryId = uuid.v4();
                    const nowIso = new Date().toISOString();
                    await db.runAsync(
                      'INSERT INTO entries (id, thingId, timestamp) VALUES (?, ?, ?);',
                      entryId,
                      id,
                      nowIso
                    );

                    logDbContents();
                    setTotals(prev =>
                      prev?.map(t => (t.id === id ? { ...t, count: t.count + 1 } : t))
                    );
                  } catch (e) {
                    console.error('DB error: ', e);
                    logDbContents();
                  }
                }}
                style={{ alignItems: 'center', width: 40 }}
              >
                <Text style={{ ...styles.text, fontSize: 28 }}>+</Text>
              </Pressable>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={styles.list}
        />
        <Pressable onPress={resetApp} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset the app</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FEFD',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 60,
    paddingHorizontal: '10%',
    paddingTop: 40
  },
  content: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40
  },
  list: {
    alignSelf: 'stretch'
  },
  resetButton: {
    backgroundColor: 'none',
    borderColor: '#2D3748',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    width: 150
  },
  resetButtonText: {
    color: '#2D3748',
    fontSize: 18,
    textAlign: 'center'
  },
  text: {
    color: '#2D3748',
    fontSize: 24,
    textAlign: 'center'
  }
});
