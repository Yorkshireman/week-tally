import { migrateDbIfNeeded } from '@/utils';
import { NotificationsListener } from '@/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';
import { Suspense } from 'react';

const Fallback = () => {
  console.log('DB not ready, rendering Fallback component');
  return null;
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
