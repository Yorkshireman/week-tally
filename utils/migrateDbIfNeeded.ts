import { dbSetupString } from '@/constants';
import { SQLiteDatabase } from 'expo-sqlite';
import { migrateDbToV4, migrateDbToV5 } from '@/migrations';

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 5;
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = row?.user_version ?? 0;

  console.log('currentDbVersion: ', currentDbVersion);
  console.log('DATABASE_VERSION: ', DATABASE_VERSION);

  await db.execAsync(dbSetupString);

  if (currentDbVersion < 4) {
    await migrateDbToV4(db);
  }

  if (currentDbVersion < 5) {
    await migrateDbToV5(db);
  }

  if (currentDbVersion === 0) {
    currentDbVersion = DATABASE_VERSION;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
