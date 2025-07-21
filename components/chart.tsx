import { buildStartOfWeekDate } from '@/utils';
import { type SQLiteDatabase } from 'expo-sqlite';
import { useFont } from '@shopify/react-native-skia';
import { useSQLiteContext } from 'expo-sqlite';
import { View } from 'react-native';
import { Area, CartesianChart } from 'victory-native';
import type { LogEntry, ThingWithLogEntriesCount } from '@/types';
import { useEffect, useState } from 'react';

type ChartDataItem = {
  total: number;
  week: number;
};

const fetchAndSetChartData = async (
  db: SQLiteDatabase,
  setChartData: React.Dispatch<React.SetStateAction<ChartDataItem[] | null>>,
  weekOffsets = [-4, -3, -2, -1, 0]
) => {
  const now = new Date();

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

export const Chart = ({ totals }: { totals?: ThingWithLogEntriesCount[] }) => {
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);
  const db = useSQLiteContext();
  const font = useFont(require('../assets/fonts/inter-medium.ttf'), 12);

  useEffect(() => {
    fetchAndSetChartData(db, setChartData);
  }, [db, totals]);

  if (!chartData) return null;

  const maxTotal = Math.max(...chartData.map(({ total }) => total), 0);

  return (
    <View style={{ height: 150 }}>
      <CartesianChart
        data={chartData}
        domain={{ y: [0, maxTotal + 1] }}
        yAxis={[
          {
            font
          }
        ]}
        xKey='week'
        yKeys={['total']}
      >
        {({ chartBounds, points }) => (
          <Area
            animate={{ duration: 300, type: 'timing' }}
            color='#1BD9D5'
            curveType='linear'
            opacity={0.5}
            points={points.total}
            y0={chartBounds.bottom}
          />
        )}
      </CartesianChart>
    </View>
  );
};
