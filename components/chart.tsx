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

  const chartDataPromises = weekOffsets.map(async (weekOffset, i) => {
    const weekStart = buildStartOfWeekDate(now, weekOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    try {
      console.log(
        `Fetching LogEntries with thingId ${selectedThingId} for week starting ${weekStart.toISOString()} and ending ${weekEnd.toISOString()}`
      );

      const logEntries = await db.getAllAsync<LogEntry>(
        'SELECT * FROM entries WHERE thingId = ? AND timestamp >= ? AND timestamp < ?',
        selectedThingId,
        weekStart.toISOString(),
        weekEnd.toISOString()
      );

      console.log(
        `Found ${
          logEntries.length
        } LogEntries for the week with thingId ${selectedThingId}: ${JSON.stringify(
          logEntries,
          null,
          2
        )}`
      );

      return { total: logEntries.length, week: i };
    } catch (e) {
      console.error('DB error: ', e);
      return { total: 0, week: i };
    }
  });

  const resolvedChartData = await Promise.all(chartDataPromises);
  setChartData(resolvedChartData);
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
      <Text style={styles.xAxisText}>From {xAxisText} to now</Text>
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
