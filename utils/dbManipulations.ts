import { buildStartOfWeekDate } from './dateUtils';
import { LogEntry } from '@/types';
import { SQLiteDatabase } from 'expo-sqlite';
import uuid from 'react-native-uuid';

export const addLogEntryToDb = async (db: SQLiteDatabase, thingId: string, weekOffset: number) => {
  let dateIso: string;
  const entryId = uuid.v4();
  const now = new Date();

  if (weekOffset !== 0) {
    const weekStart = buildStartOfWeekDate(now, weekOffset);
    dateIso = weekStart.toISOString();
  } else {
    dateIso = now.toISOString();
  }

  if (weekOffset === 0) {
    console.log('Adding a LogEntry');
  } else {
    console.log('Adding a historical LogEntry, weekOffset:', weekOffset);
  }

  await db.runAsync(
    'INSERT INTO entries (id, thingId, timestamp) VALUES (?, ?, ?);',
    entryId,
    thingId,
    dateIso
  );
};

export const addThingToDb = async (db: SQLiteDatabase, id: string, now: string, text: string) => {
  console.log('Adding a new Thing to the database: ', text.trim());
  await db.runAsync(
    'INSERT INTO things (createdAt, currentlyTracking, id, title, updatedAt) VALUES (?, ?, ?, ?, ?)',
    now,
    1,
    id,
    text.trim(),
    now
  );
};

export const deleteLogEntryFromDb = async (
  db: SQLiteDatabase,
  thingId: string,
  weekOffset: number
) => {
  if (weekOffset !== 0) {
    const weekStart = buildStartOfWeekDate(new Date(), weekOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const latestEntry = await db.getFirstAsync<LogEntry>(
      'SELECT id FROM entries WHERE thingId = ? AND timestamp >= ? AND timestamp < ? ORDER BY timestamp DESC LIMIT 1',
      thingId,
      weekStart.toISOString(),
      weekEnd.toISOString()
    );

    if (!latestEntry) {
      return console.error('No entry found for this Thing in the specified week');
    }

    console.log(
      `Deleting a historical LogEntry for Thing, id: ${thingId}, weekOffset: `,
      weekOffset
    );

    await db.runAsync('DELETE FROM entries WHERE id = ?', latestEntry.id);
  } else {
    const latestEntry = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM entries WHERE thingId = ? ORDER BY timestamp DESC LIMIT 1',
      thingId
    );

    if (!latestEntry) {
      return console.error('No entry found for this thing');
    }

    console.log('Deleting the latest LogEntry for Thing, id: ', thingId);
    await db.runAsync('DELETE FROM entries WHERE id = ?', latestEntry.id);
  }
};

export const deleteThingFromDb = async (db: SQLiteDatabase, id: string) => {
  console.log(`Deleting Thing from DB, id: ${id}`);
  await db.runAsync('DELETE FROM things WHERE id = ?', id);
};
