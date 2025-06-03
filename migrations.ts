import { SQLiteDatabase } from 'expo-sqlite';

export const migrateDbToV4 = async (db: SQLiteDatabase) => {
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
};

export const migrateDbToV5 = async (db: SQLiteDatabase) => {
  console.log('Migrating database to version 5');
  await db.execAsync(`ALTER TABLE things ADD COLUMN currentlyTracking INTEGER NOT NULL DEFAULT 1;`);
  console.log('Added currentlyTracking column to things table');
};
