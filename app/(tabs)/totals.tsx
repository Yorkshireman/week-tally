import { globalStyles } from '@/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThingWithLogEntriesCount } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { addLogEntryToDb, deleteLogEntryFromDb, fetchAndSetTotals, getWeekLabel } from '@/utils';
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
import { useColours, useDbLogger } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

export default function TotalsScreen() {
  const appState = useRef(AppState.currentState);
  const {
    page: { backgroundColor },
    text: { color }
  } = useColours();
  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const logDbContents = useDbLogger();
  const [totals, setTotals] = useState<ThingWithLogEntriesCount[]>();
  const [weekOffset, setWeekOffset] = useState<number>(0);

  useEffect(() => {
    if (isFocused) {
      fetchAndSetTotals(db, logDbContents, setTotals, weekOffset);
    }
    // Listen for app coming to the foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active' && isFocused) {
        fetchAndSetTotals(db, logDbContents, setTotals, weekOffset);
        setWeekOffset(0);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [db, isFocused, logDbContents, weekOffset]);

  const addLogEntry = async (id: string) => {
    try {
      await addLogEntryToDb(db, id, weekOffset);
      logDbContents();
      setTotals(prev => prev?.map(t => (t.id === id ? { ...t, count: t.count + 1 } : t)));
    } catch (e) {
      console.error('DB error: ', e);
      logDbContents();
    }
  };

  const deleteLogEntry = async (id: string) => {
    try {
      await deleteLogEntryFromDb(db, id, weekOffset);
      setTotals(prev => prev?.map(t => (t.id === id ? { ...t, count: t.count - 1 } : t)));
    } catch (e) {
      console.error('DB error: ', e);
    }

    logDbContents();
  };

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={globalStyles.content}
      >
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            gap: 10,
            justifyContent: 'center'
          }}
          data={totals}
          ListHeaderComponent={
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: 20,
                justifyContent: 'center',
                marginBottom: 20
              }}
            >
              <Pressable onPress={() => setWeekOffset(prev => prev - 1)} style={styles.weekButton}>
                <Text>{'<'}</Text>
              </Pressable>
              <Text style={{ ...styles.text, color }}>{getWeekLabel(weekOffset)}</Text>
              <Pressable
                onPress={() => setWeekOffset(prev => Math.min(prev + 1, 0))}
                disabled={weekOffset === 0}
                style={{ opacity: weekOffset === 0 ? 0.3 : 1 }}
              >
                <Text style={styles.weekButton}>{'>'}</Text>
              </Pressable>
            </View>
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
                onPress={() => {
                  if (count === 0) return;
                  deleteLogEntry(id);
                }}
                disabled={count === 0}
                style={{
                  alignItems: 'center',
                  marginRight: 10,
                  width: 40
                }}
              >
                <Text
                  style={{
                    ...styles.text,
                    color,
                    ...styles.countButton,
                    opacity: count === 0 ? 0.3 : 1
                  }}
                >
                  -
                </Text>
              </Pressable>
              <Text
                style={{
                  ...styles.text,
                  color,
                  fontWeight: 'bold',
                  minWidth: 120,
                  textAlign: 'center'
                }}
              >
                {title}: {count}
              </Text>
              <Pressable
                onPress={() => addLogEntry(id)}
                style={{ alignItems: 'center', width: 40 }}
              >
                <Text style={{ ...styles.text, color, ...styles.countButton }}>+</Text>
              </Pressable>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          style={styles.list}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  countButton: {
    fontSize: 28,
    paddingHorizontal: 12,
    paddingVertical: 2
  },
  list: {
    alignSelf: 'stretch'
  },
  text: {
    fontSize: 24,
    textAlign: 'center'
  },
  weekButton: {
    padding: 10
  }
});
