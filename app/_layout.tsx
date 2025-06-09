import { migrateDbIfNeeded } from '@/utils';
import { NotificationsListener } from '@/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { useColours } from '@/hooks';

const Fallback = () => {
  console.log('DB not ready, rendering Fallback component');
  return null;
};

export default function RootLayout() {
  const { text } = useColours();
  return (
    <Suspense fallback={<Fallback />}>
      <SQLiteProvider databaseName='things.db' onInit={migrateDbIfNeeded} useSuspense>
        <NotificationsListener>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen name='index' options={{ headerShown: false }} />
              <Stack.Screen name='dateTimeChooser' options={{ headerShown: false }} />
              <Stack.Screen name='confirmation' options={{ headerShown: false }} />
              <Stack.Screen
                name='thingsTracked'
                options={{
                  headerBackTitle: 'Settings',
                  headerTintColor: text.color,
                  title: 'Things tracked'
                }}
              />
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            </Stack>
            <StatusBar style='dark' />
          </SafeAreaProvider>
        </NotificationsListener>
      </SQLiteProvider>
    </Suspense>
  );
}
