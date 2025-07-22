import { format } from 'date-fns'; // If you have date-fns, otherwise use toLocaleDateString
import { type SQLiteDatabase } from 'expo-sqlite';
import { useColours } from '@/hooks';
import { useFont } from '@shopify/react-native-skia';
import { useSQLiteContext } from 'expo-sqlite';
import { Area, CartesianChart } from 'victory-native';
import { buildStartOfWeekDate, buildWeekOffsetsArray } from '@/utils';
import type { LogEntry, ThingWithLogEntriesCount } from '@/types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';

type ChartDataItem = {
  total: number;
  week: number;
};

enum ChartScale {
  FOUR_WEEKS = '4W',
  TWELVE_WEEKS = '12W',
  TWENTY_FOUR_WEEKS = '24W',
  FIFTY_TWO_WEEKS = '52W',
  MAX = 'Max'
}

const fetchAndSetChartData = async ({
  db,
  selectedScale,
  selectedThingId,
  setChartData
}: {
  db: SQLiteDatabase;
  selectedScale: ChartScale;
  selectedThingId: string;
  setChartData: React.Dispatch<React.SetStateAction<ChartDataItem[] | null>>;
}) => {
  const now = new Date();

  let numWeeks: number;
  if (selectedScale === ChartScale.MAX) {
    let earliestEntry: LogEntry | null = null;
    try {
      earliestEntry = await db.getFirstAsync(
        'SELECT * FROM entries WHERE thingId = ? ORDER BY timestamp ASC LIMIT 1',
        selectedThingId
      );
    } catch (error) {
      console.error('Error fetching earliest entry:', error);
      return setChartData([{ total: 0, week: 0 }]);
    }

    if (earliestEntry) {
      const earliestDate = new Date(earliestEntry.timestamp);
      const diffMs = now.getTime() - earliestDate.getTime();
      const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000));
      numWeeks = Math.max(diffWeeks, 1);
    } else {
      console.warn(
        'fetchAndSetChartData(): No entries found for the specified thingId, defaulting to 4 weeks'
      );

      numWeeks = 4;
    }
  } else {
    switch (selectedScale) {
      case ChartScale.FOUR_WEEKS:
        numWeeks = 4;
        break;
      case ChartScale.TWELVE_WEEKS:
        numWeeks = 12;
        break;
      case ChartScale.TWENTY_FOUR_WEEKS:
        numWeeks = 24;
        break;
      case ChartScale.FIFTY_TWO_WEEKS:
        numWeeks = 52;
        break;
    }
  }

  const weekOffsets = buildWeekOffsetsArray(numWeeks);
  const earliestWeekOffset = weekOffsets[0];

  const earliestWeekStart = buildStartOfWeekDate(now, earliestWeekOffset);
  const currentWeekStart = buildStartOfWeekDate(now, 0);
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);

  try {
    console.log(
      `Fetching LogEntries with thingId ${selectedThingId} for week starting ${earliestWeekStart.toISOString()} and ending ${currentWeekEnd.toISOString()}`
    );

    const logEntries = await db.getAllAsync<LogEntry>(
      'SELECT * FROM entries WHERE thingId = ? AND timestamp >= ? AND timestamp < ?',
      selectedThingId,
      earliestWeekStart.toISOString(),
      currentWeekEnd.toISOString()
    );

    console.log(
      `Found ${
        logEntries.length
      } LogEntries for the period with thingId ${selectedThingId}: ${JSON.stringify(
        logEntries,
        null,
        2
      )}`
    );

    const weekCounts: Record<number, number> = {};
    for (const entry of logEntries) {
      const entryDate = new Date(entry.timestamp);
      const diffMs = currentWeekStart.getTime() - buildStartOfWeekDate(entryDate, 0).getTime();
      const weekOffset = -Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
      weekCounts[weekOffset] = (weekCounts[weekOffset] || 0) + 1;
    }

    const chartData: ChartDataItem[] = weekOffsets.map((weekOffset, i) => ({
      total: weekCounts[weekOffset] || 0,
      week: i
    }));

    setChartData(chartData);
  } catch (e) {
    console.error('DB error: ', e);
    setChartData([{ total: 0, week: 0 }]);
    return;
  }
};

const ScaleSelector = ({
  scale,
  selectedScale,
  setSelectedScale
}: {
  scale: ChartScale;
  selectedScale: ChartScale;
  setSelectedScale: React.Dispatch<React.SetStateAction<ChartScale>>;
}) => {
  const {
    chart: { scaleSelectorSelected },
    page
  } = useColours();

  const _styles =
    scale === selectedScale
      ? {
          ...styles.scaleSelector,
          backgroundColor: scaleSelectorSelected.backgroundColor,
          borderWidth: 1
        }
      : { ...styles.scaleSelector, borderColor: page.backgroundColor };

  return (
    <TouchableOpacity onPress={() => setSelectedScale(scale)} style={_styles}>
      <Text>{scale}</Text>
    </TouchableOpacity>
  );
};

export const Chart = ({
  selectedThingId,
  totals
}: {
  selectedThingId: string;
  totals?: ThingWithLogEntriesCount[];
}) => {
  const {
    chart: { areaColour }
  } = useColours();
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);
  const db = useSQLiteContext();
  const font = useFont(require('../assets/fonts/inter-medium.ttf'), 12);
  const [selectedScale, setSelectedScale] = useState<ChartScale>(ChartScale.FOUR_WEEKS);

  useEffect(() => {
    fetchAndSetChartData({ db, selectedScale, selectedThingId, setChartData });
  }, [db, selectedThingId, totals, selectedScale]);

  if (!chartData || chartData.length === 0) return null;

  const now = new Date();
  const weekOffset = -chartData[chartData.length - 1].week;
  const firstWeekMonday = buildStartOfWeekDate(now, weekOffset);
  const xAxisText = format(firstWeekMonday, "EEEE do MMMM ''yy");

  const maxTotal = Math.max(...chartData.map(({ total }) => total), 0);
  const tickValues = Array.from({ length: maxTotal + 1 }, (_, i) => i);

  return (
    <View style={{ height: 190 }}>
      <CartesianChart
        data={chartData}
        domain={{ y: [0, maxTotal + 0.1] }}
        yAxis={[
          {
            font,
            tickValues
          }
        ]}
        xKey='week'
        yKeys={['total']}
      >
        {({ chartBounds, points }) => (
          <Area
            animate={{ duration: 300, type: 'timing' }}
            color={areaColour}
            curveType='linear'
            opacity={0.5}
            points={points.total}
            y0={chartBounds.bottom}
          />
        )}
      </CartesianChart>
      <Text style={styles.xAxisText}>From {xAxisText}</Text>
      <View style={styles.scaleSelectorsContainer}>
        {Object.values(ChartScale).map(scale => (
          <ScaleSelector
            key={scale}
            scale={scale}
            selectedScale={selectedScale}
            setSelectedScale={setSelectedScale}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scaleSelector: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 8
  },
  scaleSelectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  xAxisText: {
    bottom: 10,
    fontSize: 12,
    position: 'relative',
    textAlign: 'center'
  }
});
