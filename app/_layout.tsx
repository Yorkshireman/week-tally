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
          </Stack>
        </SafeAreaProvider>
      </SQLiteProvider>
    </Suspense>
  );
}

const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 1;
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = row?.user_version ?? 0;
  console.log('currentDbVersion: ', currentDbVersion);
  console.log('DATABASE_VERSION: ', DATABASE_VERSION);

  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS things (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL
    );
  `);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    currentDbVersion = 1;
  }

  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
