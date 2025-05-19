import { useSQLiteContext } from 'expo-sqlite';

export const useDbLogger = () => {
  const db = useSQLiteContext();

  const logDbContents = async () => {
    const timeNow = new Date().toISOString();
    const things = await db.getAllAsync('SELECT * FROM things');
    const settings = await db.getAllAsync('SELECT * FROM settings');
    const entries = await db.getAllAsync('SELECT * FROM entries');
    console.log('DB contents:', JSON.stringify({ entries, settings, things, timeNow }, null, 2));
  };

  return logDbContents;
};
