import * as Notifications from 'expo-notifications';
import { dbSetupString } from '@/constants';
import { useDbLogger } from './useDbLogger';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

export const useResetApp = () => {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();
  const router = useRouter();

  return async () => {
    console.log('Clearing the database');
    try {
      await db.execAsync('DROP TABLE IF EXISTS things;');
      await db.execAsync('DROP TABLE IF EXISTS settings;');
      await db.execAsync('DROP TABLE IF EXISTS entries;');
      await db.execAsync(dbSetupString);
      console.log('DB cleared');
      logDbContents();
      router.replace('/');
    } catch (e) {
      console.error('DB error: ', e);
      logDbContents();
    }

    try {
      console.log('Cancelling all scheduled local notifications');
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All scheduled local notifications cancelled');
    } catch (e) {
      console.error('Error cancelling all scheduled local notifications: ', e);
    }
  };
};
