import { buildStartOfWeekDate } from '@/utils';
import { type SQLiteDatabase } from 'expo-sqlite';
import { useDbLogger } from '@/hooks';
import { useSQLiteContext } from 'expo-sqlite';
import { View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import type { LogEntry, ThingWithLogEntriesCount } from '@/types';
import { useEffect, useState } from 'react';

const fetchAndSetChartData = async (
  db: SQLiteDatabase,
  logDbContents: Function,
  setChartData: any,
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
      logDbContents();
    }
  });

  const resolvedChartData = await Promise.all(chartDataPromises);
  setChartData(resolvedChartData);
};

export const Chart = ({ totals }: { totals: ThingWithLogEntriesCount[] }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();

  useEffect(() => {
    fetchAndSetChartData(db, logDbContents, setChartData);
  }, [db, logDbContents, totals]);
  console.log('========== chartData ==========');
  console.log(JSON.stringify(chartData, null, 2));
  console.log('========== end ===========');

  if (!chartData) return null;

  return (
    <View style={{ height: 150 }}>
      <CartesianChart data={chartData} xKey='week' yKeys={['total']}>
        {({ points }) => <Line points={points.total} color='red' strokeWidth={3} />}
      </CartesianChart>
    </View>
  );
};
