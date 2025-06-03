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
  try {
    logDbContents();
    const logEntries = await db.getAllAsync<LogEntry>('SELECT * FROM entries');
    const now = new Date();
    const things = await db.getAllAsync<Thing>('SELECT * FROM things');

    const weekStart = buildStartOfWeekDate(now, weekOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    setTotals(
      things.map(thing => {
        const { id } = thing;
        const logEntriesForThisThing = logEntries.filter(logEntry => logEntry.thingId === id);
        const totalForThisWeek = logEntriesForThisThing.filter(logEntry => {
          const logEntryDate = new Date(logEntry.timestamp);
          return logEntryDate >= weekStart && logEntryDate < weekEnd;
        }).length;

        return { count: totalForThisWeek, ...thing };
      })
    );
  } catch (e) {
    console.error('DB error: ', e);
    logDbContents();
  }
};
