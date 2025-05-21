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

      if (action === 'YES' && data.thingId) {
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
  const DATABASE_VERSION = 3;
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = row?.user_version ?? 0;

  console.log('currentDbVersion: ', currentDbVersion);
  console.log('DATABASE_VERSION: ', DATABASE_VERSION);

  await db.execAsync(dbSetupString);

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    currentDbVersion = DATABASE_VERSION;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
