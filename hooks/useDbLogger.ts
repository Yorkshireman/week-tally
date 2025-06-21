import { useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

export const useDbLogger = () => {
  const db = useSQLiteContext();

  return useCallback(
    async function logDbContents() {
      try {
        const timeNow = new Date().toISOString();
        const deviceAppInfo = await db.getAllAsync('SELECT * FROM deviceAppInfo');
        const entries = await db.getAllAsync('SELECT * FROM entries');
        const settings = await db.getAllAsync('SELECT * FROM settings');
        const things = await db.getAllAsync('SELECT * FROM things');
        console.log(
          'Full DB contents: \n',
          JSON.stringify({ deviceAppInfo, entries, settings, things, timeNow }, null, 2)
        );
      } catch (e) {
        console.error('Error logging DB contents: ', e);
      }
    },
    [db]
  );
};
