import * as Notifications from 'expo-notifications';
import { dbSetupString } from '@/utils';
import { NotificationDataType } from '@/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useDbLogger } from '@/hooks';
import uuid from 'react-native-uuid';
import { ReactNode, Suspense, useEffect } from 'react';
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

const Fallback = () => {
  console.log('DB not ready, rendering Fallback component');
  return null;
};

const NotificationsListener = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(async response => {
      const action = response.actionIdentifier;
      const data = response.notification.request.content.data as NotificationDataType;

      if (action === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        const newId = uuid.v4();
        const nowIso = new Date().toISOString();
        await db.runAsync(`INSERT INTO entries (id, thingId, timestamp) VALUES (?, ?, ?);`, [
          newId,
          data.thingId,
          nowIso
        ]);

        logDbContents();
      }
    });

    return () => sub.remove();
  }, [db, logDbContents]);

  return children;
};

export default function RootLayout() {
  return (
    <Suspense fallback={<Fallback />}>
      <SQLiteProvider databaseName='things.db' onInit={migrateDbIfNeeded} useSuspense>
        <NotificationsListener>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen name='index' options={{ headerShown: false }} />
              <Stack.Screen name='dateTimeChooser' options={{ headerShown: false }} />
              <Stack.Screen name='confirmation' options={{ headerShown: false }} />
              <Stack.Screen name='totals' options={{ headerShown: false }} />
            </Stack>
          </SafeAreaProvider>
        </NotificationsListener>
      </SQLiteProvider>
    </Suspense>
  );
}

const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 5; // Increment version
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = row?.user_version ?? 0;

  console.log('currentDbVersion: ', currentDbVersion);
  console.log('DATABASE_VERSION: ', DATABASE_VERSION);

  await db.execAsync(dbSetupString);

  if (currentDbVersion < 4) {
    console.log('Migrating database to version 4');
    await db.execAsync(`ALTER TABLE things ADD COLUMN createdAt TEXT;`);
    console.log('Added createdAt column to things table');
    await db.execAsync(`ALTER TABLE things ADD COLUMN updatedAt TEXT;`);
    console.log('Added updatedAt column to things table');
    const now = new Date().toISOString();
    await db.execAsync(
      `UPDATE things SET createdAt = COALESCE(createdAt, '${now}'), updatedAt = COALESCE(updatedAt, '${now}');`
    );
    console.log('Updated existing rows with createdAt and updatedAt');
  }

  if (currentDbVersion < 5) {
    console.log('Migrating database to version 5');
    await db.execAsync(`ALTER TABLE things ADD COLUMN currentlyTracking INTEGER NOT NULL DEFAULT 1;`);
    console.log('Added currentlyTracking column to things table');
  }

  if (currentDbVersion === 0) {
    currentDbVersion = DATABASE_VERSION;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
