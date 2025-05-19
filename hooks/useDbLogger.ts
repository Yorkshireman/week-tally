import { useSQLiteContext } from 'expo-sqlite';

export const useDbLogger = () => {
  const db = useSQLiteContext();

  const logDbContents = async () => {
    const things = await db.getAllAsync('SELECT * FROM things');
    const settings = await db.getAllAsync('SELECT * FROM settings');
    const entries = await db.getAllAsync('SELECT * FROM entries');
    console.log('DB contents:', JSON.stringify({ entries, settings, things }, null, 2));
  };

  return logDbContents;
};
