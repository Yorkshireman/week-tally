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
  ONE_MONTH = '1M',
  THREE_MONTHS = '3M',
  SIX_MONTHS = '6M',
  ONE_YEAR = '1Y',
  MAX = 'Max'
}

const fetchAndSetChartData = async (
  db: SQLiteDatabase,
  setChartData: React.Dispatch<React.SetStateAction<ChartDataItem[] | null>>,
  scale: ChartScale
) => {
  const now = new Date();

  let numWeeks;
  switch (scale) {
    case ChartScale.ONE_MONTH:
      numWeeks = 4;
      break;
    case ChartScale.THREE_MONTHS:
      numWeeks = 13;
      break;
    case ChartScale.SIX_MONTHS:
      numWeeks = 26;
      break;
    case ChartScale.ONE_YEAR:
      numWeeks = 52;
      break;
    case ChartScale.MAX:
      numWeeks = 104; // 2 years, or you could fetch from DB for true max
      break;
  }

  const weekOffsets = buildWeekOffsetsArray(numWeeks);

  const chartDataPromises = weekOffsets.map(async (weekOffset, i) => {
    const weekStart = buildStartOfWeekDate(now, weekOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    try {
      console.log(
        `Fetching LogEntries for week starting ${weekStart.toISOString()} and ending ${weekEnd.toISOString()}`
      );

      const logEntries = await db.getAllAsync<LogEntry>(
        'SELECT * FROM entries WHERE timestamp >= ? AND timestamp < ?',
        weekStart.toISOString(),
        weekEnd.toISOString()
      );

      console.log(
        `Found ${logEntries.length} LogEntries for the week: ${JSON.stringify(logEntries, null, 2)}`
      );

      // only Cycling
      const thingId = '89596d1d-9783-4df6-9759-11a62707245f';
      return { total: logEntries.filter(entry => entry.thingId === thingId).length, week: i };
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

export const Chart = ({ totals }: { totals?: ThingWithLogEntriesCount[] }) => {
  const {
    chart: { areaColour }
  } = useColours();
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);
  const db = useSQLiteContext();
  const font = useFont(require('../assets/fonts/inter-medium.ttf'), 12);
  const [selectedScale, setSelectedScale] = useState<ChartScale>(ChartScale.ONE_MONTH);

  useEffect(() => {
    fetchAndSetChartData(db, setChartData, selectedScale);
  }, [db, totals, selectedScale]);

  if (!chartData || chartData.length === 0) return null;

  const now = new Date();
  const weekOffset = -chartData[chartData.length - 1].week;
  const firstWeekMonday = buildStartOfWeekDate(now, weekOffset);
  const xAxisText = format(firstWeekMonday, "EEEE do MMMM ''yy");

  console.log(
    'Week indexes:',
    chartData.map(item => item.week)
  );
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
