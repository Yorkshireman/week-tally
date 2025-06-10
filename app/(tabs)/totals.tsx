import * as Haptics from 'expo-haptics';
import { globalStyles } from '@/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThingWithLogEntriesCount } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import {
  addLogEntryToDb,
  deleteLogEntryFromDb,
  fetchAndSetTotals,
  getWeekLabel,
  normaliseFontSize
} from '@/utils';
import { AppState, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColours, useDbLogger } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

export default function TotalsScreen() {
  const appState = useRef(AppState.currentState);
  const {
    iconButton,
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await deleteLogEntryFromDb(db, id, weekOffset);
      setTotals(prev => prev?.map(t => (t.id === id ? { ...t, count: t.count - 1 } : t)));
    } catch (e) {
      console.error('DB error: ', e);
    }

    logDbContents();
  };

  const goBackOneWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeekOffset(prev => prev - 1);
  };

  const goForwardOneWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeekOffset(prev => Math.min(prev + 1, 0));
  };

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, paddingVertical: 0 }}>
      <View style={{ ...styles.listHeader, width: '100%' }}>
        <Pressable onPress={goBackOneWeek} style={styles.weekButton}>
          <Ionicons
            color={iconButton.color}
            name='chevron-back-circle-outline'
            size={normaliseFontSize(32)}
          />
        </Pressable>
        <Text style={{ ...styles.text, color }}>{getWeekLabel(weekOffset)}</Text>
        <Pressable
          onPress={goForwardOneWeek}
          disabled={weekOffset === 0}
          style={{ ...styles.weekButton, opacity: weekOffset === 0 ? 0.5 : 1 }}
        >
          <Ionicons
            color={iconButton.color}
            name='chevron-forward-circle-outline'
            size={normaliseFontSize(32)}
          />
        </Pressable>
      </View>
      <FlatList
        contentContainerStyle={{ gap: 10 }}
        data={totals}
        renderItem={({ item: { count, title, id } }) => (
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Pressable
              onPress={() => {
                if (count === 0) return;
                deleteLogEntry(id);
              }}
              disabled={count === 0}
              style={styles.countButtonWrapper}
            >
              <Ionicons
                color={iconButton.color}
                name='remove-circle'
                size={normaliseFontSize(32)}
                style={{ ...styles.countButton, opacity: count === 0 ? 0.5 : 1 }}
              />
            </Pressable>
            <View
              style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 10
              }}
            >
              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={{ ...styles.text, color, fontWeight: 'bold', textAlign: 'left' }}>
                  {title}
                </Text>
              </View>
              <View style={{ minWidth: 10 }}>
                <Text style={{ ...styles.text, color, fontWeight: 'bold' }}>{count}</Text>
              </View>
            </View>
            <Pressable onPress={() => addLogEntry(id)} style={styles.countButtonWrapper}>
              <Ionicons
                color={iconButton.color}
                name='add-circle'
                size={normaliseFontSize(32)}
                style={styles.countButton}
              />
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  countButton: {
    fontSize: normaliseFontSize(32),
    padding: 5
  },
  countButtonWrapper: { alignItems: 'center', width: 40 },
  list: {
    alignSelf: 'stretch'
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
    marginBottom: 20
  },
  text: {
    fontSize: normaliseFontSize(24),
    textAlign: 'center'
  },
  weekButton: {
    padding: 10
  }
});
