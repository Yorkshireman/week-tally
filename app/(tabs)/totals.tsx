import * as Haptics from 'expo-haptics';
import { Chart } from '@/components';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThingWithLogEntriesCount } from '@/types';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import {
  addLogEntryToDb,
  deleteLogEntryFromDb,
  getAddLogEntryCount,
  getWeekLabel,
  incrementAddLogEntryCount,
  normaliseFontSize,
  promptForRatingIfAppropriate,
  setDbSettingsChartThingId
} from '@/utils';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  useColours,
  useFetchAndSetTotals,
  useGlobalStyles,
  useSetShowChartAndChartThingId
} from '@/hooks';

export default function TotalsScreen() {
  const {
    iconButton,
    page: { backgroundColor },
    text: { color },
    thingSection: thingSectionColours,
    totalsScreen: {
      addButton: { color: addButtonColor },
      selectedThing: selectedThingColours
    }
  } = useColours();
  const [chartThingId, setChartThingId] = useState<string>();
  const db = useSQLiteContext();
  const globalStyles = useGlobalStyles();
  const router = useRouter();
  const [totals, setTotals] = useState<ThingWithLogEntriesCount[]>();
  const showChart = useSetShowChartAndChartThingId({ setChartThingId, totals });
  const [weekOffset, setWeekOffset] = useState(0);
  useFetchAndSetTotals({ setTotals, setWeekOffset, weekOffset });

  const addLogEntry = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await addLogEntryToDb(db, id, weekOffset);
      setTotals(prev => prev?.map(t => (t.id === id ? { ...t, count: t.count + 1 } : t)));
      const currentAddLogEntryCount = await getAddLogEntryCount();
      await promptForRatingIfAppropriate(currentAddLogEntryCount);
      await incrementAddLogEntryCount(currentAddLogEntryCount);
    } catch (e) {
      console.error('DB error: ', e);
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
  };

  const goBackOneWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeekOffset(prev => prev - 1);
  };

  const goForwardOneWeek = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeekOffset(prev => Math.min(prev + 1, 0));
  };

  const renderChart = showChart && chartThingId;

  // prevent layout shift
  if (showChart === undefined) {
    return null;
  }

  return (
    <SafeAreaView style={{ ...globalStyles.screenWrapper, backgroundColor }}>
      {renderChart && <Chart thingId={chartThingId} totals={totals} />}
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
        renderItem={({ item: thing }) => {
          const { count, title, id } = thing;
          const isSelected = chartThingId === id;
          const wrapperStyles = isSelected
            ? {
                ...styles.thing,
                ...thingSectionColours,
                ...styles.selectedThing,
                ...selectedThingColours
              }
            : { ...styles.thing, ...thingSectionColours, borderColor: backgroundColor };

          return (
            <View style={wrapperStyles}>
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
                <Pressable
                  onPress={() => {
                    if (!showChart) return;
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setChartThingId(thing.id);
                    setDbSettingsChartThingId(db, id);
                  }}
                  style={{ flex: 1, paddingHorizontal: 10 }}
                >
                  <Text style={{ ...styles.text, color, textAlign: 'left' }}>{title}</Text>
                </Pressable>
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
          );
        }}
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
  selectedThing: {
    borderWidth: 2
  },
  text: {
    fontSize: normaliseFontSize(24),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  thing: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    padding: 8
  },
  weekButton: {
    padding: 10
  }
});
