import { migrateDbIfNeeded } from '@/utils';
import { NotificationsListener } from '@/components';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { useColours, useGlobalStyles } from '@/hooks';

const Fallback = () => {
  console.log('DB not ready, rendering Fallback component');
  return null;
};

export default function RootLayout() {
  const { headerTitleStyle } = useGlobalStyles();
  const { header } = useColours();
  const headerStyles = {
    ...header,
    headerTitleStyle
  };

  return (
    <PaperProvider>
      <Suspense fallback={<Fallback />}>
        <SQLiteProvider databaseName='things.db' onInit={migrateDbIfNeeded} useSuspense>
          <NotificationsListener>
            <SafeAreaProvider>
              <Stack>
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='setupThings' options={{ headerShown: false }} />
                <Stack.Screen name='dateTimeChooser' options={{ headerShown: false }} />
                <Stack.Screen name='confirmation' options={{ headerShown: false }} />
                <Stack.Screen
                  name='thingsTracked'
                  options={{
                    ...headerStyles,
                    headerBackTitle: 'Settings',
                    title: 'Things tracked'
                  }}
                />
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen
                  name='addThing'
                  options={{
                    ...headerStyles,
                    headerTitleStyle: {
                      ...headerStyles.headerTitleStyle,
                      fontSize: 18
                    },
                    presentation: 'modal',
                    title: 'Add a new Thing'
                  }}
                />
                <Stack.Screen
                  name='changeNotificationTime'
                  options={{
                    ...headerStyles,
                    headerBackTitle: 'Settings',
                    headerTitleStyle: {
                      ...headerStyles.headerTitleStyle,
                      fontSize: 18
                    },
                    title: 'Daily Notification Time'
                  }}
                />
                <Stack.Screen
                  name='editThing'
                  options={{
                    ...headerStyles,
                    headerTitleStyle: {
                      ...headerStyles.headerTitleStyle,
                      fontSize: 18
                    },
                    presentation: 'modal',
                    title: 'Rename'
                  }}
                />
                <Stack.Screen
                  name='payWall'
                  options={{ headerShown: false, presentation: 'fullScreenModal' }}
                />
              </Stack>
              <StatusBar style='dark' />
            </SafeAreaProvider>
          </NotificationsListener>
        </SQLiteProvider>
      </Suspense>
    </PaperProvider>
  );
}
