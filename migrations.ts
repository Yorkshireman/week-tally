import { SQLiteDatabase } from 'expo-sqlite';

async function columnExists(db: SQLiteDatabase, table: string, column: string) {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  return columns.some(col => col.name === column);
}

export const migrateDbToV4 = async (db: SQLiteDatabase) => {
  console.log('Migrating database to version 4');
  if (!(await columnExists(db, 'things', 'createdAt'))) {
    await db.execAsync(`ALTER TABLE things ADD COLUMN createdAt TEXT;`);
    console.log('Added createdAt column to things table');
  }

  if (!(await columnExists(db, 'things', 'updatedAt'))) {
    await db.execAsync(`ALTER TABLE things ADD COLUMN updatedAt TEXT;`);
    console.log('Added updatedAt column to things table');
  }

  const now = new Date().toISOString();
  await db.execAsync(
    `UPDATE things SET createdAt = COALESCE(createdAt, '${now}'), updatedAt = COALESCE(updatedAt, '${now}');`
  );
  console.log('Set default values for createdAt and updatedAt columns in things table');
};

export const migrateDbToV5 = async (db: SQLiteDatabase) => {
  console.log('Migrating database to version 5');
  if (!(await columnExists(db, 'things', 'currentlyTracking'))) {
    await db.execAsync(
      `ALTER TABLE things ADD COLUMN currentlyTracking INTEGER NOT NULL DEFAULT 1;`
    );
    console.log('Added currentlyTracking column to things table');
  }
};
