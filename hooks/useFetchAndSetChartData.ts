import { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { buildStartOfWeekDate, buildWeekOffsetsArray } from '@/utils';
import { ChartDataItem, ChartScale, LogEntry, ThingWithLogEntriesCount } from '@/types';

export const useFetchAndSetChartData = ({
  selectedScale,
  thingId,
  setChartData,
  totals
}: {
  selectedScale: ChartScale | null;
  thingId: string;
  setChartData: React.Dispatch<React.SetStateAction<ChartDataItem[] | null>>;
  totals?: ThingWithLogEntriesCount[];
}) => {
  const db = useSQLiteContext();

  useEffect(() => {
    const run = async () => {
      if (!selectedScale) return;

      const now = new Date();
      let numWeeks: number;

      if (selectedScale === ChartScale.MAX) {
        let earliestEntry: LogEntry | null = null;

        try {
          earliestEntry = await db.getFirstAsync(
            'SELECT * FROM entries WHERE thingId = ? ORDER BY timestamp ASC',
            thingId
          );
        } catch (error) {
          console.error('Error fetching earliest entry:', error);
          return setChartData([{ total: 0, week: 0 }]);
        }

        if (earliestEntry) {
          const earliestWeekStart = buildStartOfWeekDate(new Date(earliestEntry.timestamp), 0);
          const diffMs = now.getTime() - earliestWeekStart.getTime();
          const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000));
          numWeeks = Math.max(diffWeeks, 1) + 1;
          // when chart only has one week of log entries, and is set to Max, tell it to
          // chart the last two weeks, otherwise it visually looks like a bug to the user
          numWeeks = numWeeks === 1 ? 2 : numWeeks;
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
          `Fetching LogEntries with thingId ${thingId} for week starting ${earliestWeekStart.toISOString()} and ending ${currentWeekEnd.toISOString()}`
        );

        const logEntries = await db.getAllAsync<LogEntry>(
          'SELECT * FROM entries WHERE thingId = ? AND timestamp >= ? AND timestamp < ?',
          thingId,
          earliestWeekStart.toISOString(),
          currentWeekEnd.toISOString()
        );

        console.log(
          `Found ${
            logEntries.length
          } LogEntries for the period with thingId ${thingId}: ${JSON.stringify(
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

    run();
  }, [db, thingId, totals, selectedScale, setChartData]);
};
