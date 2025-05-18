import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Suspense } from 'react';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

const Fallback = () => {
  console.log('DB not ready, rendering Fallback component');
  return null;
};

export default function RootLayout() {
  return (
    <Suspense fallback={<Fallback />}>
      <SQLiteProvider databaseName='things.db' onInit={migrateDbIfNeeded} useSuspense>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='dateTimeChooser' options={{ headerShown: false }} />
            <Stack.Screen name='confirmation' options={{ headerShown: false }} />
            <Stack.Screen name='totals' options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </SQLiteProvider>
    </Suspense>
  );
}

const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 3;
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = row?.user_version ?? 0;

  console.log('currentDbVersion: ', currentDbVersion);
  console.log('DATABASE_VERSION: ', DATABASE_VERSION);

  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS things (
      id        TEXT    PRIMARY KEY NOT NULL,
      title     TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key       TEXT    PRIMARY KEY NOT NULL,
      value     TEXT
    );

    CREATE TABLE IF NOT EXISTS entries (
      id        TEXT    PRIMARY KEY NOT NULL,
      thingId   TEXT    NOT NULL
                        REFERENCES things(id)
                        ON DELETE CASCADE,
      timestamp TEXT    NOT NULL
    );
  `);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    currentDbVersion = DATABASE_VERSION;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
