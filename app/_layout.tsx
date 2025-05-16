import { Stack } from 'expo-router';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName='things.db' onInit={migrateDbIfNeeded}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}

const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 1;
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

  let currentDbVersion = row?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE things (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL
      );
    `);

    await db.runAsync('INSERT INTO things (id, title) VALUES (?, ?)', '1', 'Sample thing 1');

    await db.runAsync('INSERT INTO things (id, title) VALUES (?, ?)', '2', 'Sample thing 2');

    currentDbVersion = 1;
  }

  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
