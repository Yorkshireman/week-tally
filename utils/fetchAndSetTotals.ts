import { buildStartOfWeekDate } from './dateUtils';
import { SQLiteDatabase } from 'expo-sqlite';
import { Dispatch, SetStateAction } from 'react';
import { LogEntry, Thing, ThingWithLogEntriesCount } from '@/types';

export const fetchAndSetTotals = async (
  db: SQLiteDatabase,
  logDbContents: Function,
  setTotals: Dispatch<SetStateAction<ThingWithLogEntriesCount[] | undefined>>,
  weekOffset: number
) => {
  const now = new Date();
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

    const thingIds = Array.from(new Set(logEntries.map(({ thingId }) => thingId)));

    console.log(
      `Fetching Things with 1 or more LogEntry for week ending ${weekEnd.toISOString()} (matched by IDs: ${thingIds.join(
        ', '
      )}), or have currentlyTracking = 1`
    );

    const things = await db.getAllAsync<Thing>(
      'SELECT DISTINCT * FROM things WHERE id IN (?) OR currentlyTracking = 1',
      thingIds.join(',')
    );

    console.log(`Found ${things.length} Things: ${JSON.stringify(things, null, 2)}`);

    setTotals(
      things.map(thing => ({
        ...thing,
        count: logEntries.filter(entry => entry.thingId === thing.id).length
      }))
    );
  } catch (e) {
    console.error('DB error: ', e);
    logDbContents();
  }
};
