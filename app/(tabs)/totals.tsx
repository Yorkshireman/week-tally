import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThingWithLogEntriesCount } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  addLogEntryToDb,
  deleteLogEntryFromDb,
  fetchAndSetTotals,
  getWeekLabel,
  normaliseFontSize,
  promptForRating
} from '@/utils';
import {
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useColours, useDbLogger, useGlobalStyles } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

const getAddLogEntryCount = async (): Promise<number | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('addLogEntryCount');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error getting addLogEntryCount from AsyncStorage:`, e);
    return null;
  }
};

const incrementAddLogEntryCount = async (currentAddLogEntryCount: number | null) => {
  try {
    const newCount = currentAddLogEntryCount ? currentAddLogEntryCount + 1 : 1;
    await AsyncStorage.setItem('addLogEntryCount', newCount.toString());
  } catch (e) {
    console.error(`Error incrementing addLogEntryCount in AsyncStorage:`, e);
  }
};

const promptForRatingIfAppropriate = async (currentAddLogEntryCount: number | null) => {
  if (currentAddLogEntryCount === null) {
    return await promptForRating();
  }

  if (currentAddLogEntryCount > 0 && currentAddLogEntryCount % 10 === 0) {
    return await promptForRating();
  }

  return null;
};

export default function TotalsScreen() {
  const appState = useRef(AppState.currentState);
  const {
    iconButton,
    page: { backgroundColor },
    text: { color },
    thingSection: thingSectionColours,
    totalsScreen: {
      addButton: { color: addButtonColor }
    }
  } = useColours();
  const db = useSQLiteContext();
  const globalStyles = useGlobalStyles();
  const isFocused = useIsFocused();
  const logDbContents = useDbLogger();
  const router = useRouter();
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
      const currentAddLogEntryCount = await getAddLogEntryCount();
      await promptForRatingIfAppropriate(currentAddLogEntryCount);
      await incrementAddLogEntryCount(currentAddLogEntryCount);
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
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
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
        data={totals}
        renderItem={({ item: { count, title, id } }) => (
          <View style={{ ...styles.thing, ...thingSectionColours }}>
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
                <Text style={{ ...styles.text, color, textAlign: 'left' }}>{title}</Text>
              </View>
              <View style={{ minWidth: 10 }}>
                <Text style={{ ...styles.text, color }}>{count}</Text>
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
        ListFooterComponent={
          weekOffset ? null : (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/addThing');
              }}
              style={{ alignSelf: 'center', marginTop: 10 }}
            >
              <Ionicons
                color={addButtonColor}
                name='add-circle-outline'
                size={normaliseFontSize(48)}
              />
            </TouchableOpacity>
          )
        }
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
  countButtonWrapper: { alignItems: 'center', minWidth: 40 },
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
    fontWeight: 'bold',
    textAlign: 'center'
  },
  thing: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 8
  },
  weekButton: {
    padding: 10
  }
});
