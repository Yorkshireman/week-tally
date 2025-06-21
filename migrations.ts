import { PAYWALL_TURNED_ON } from './config';
import { SQLiteDatabase } from 'expo-sqlite';

const columnExists = async (db: SQLiteDatabase, table: string, column: string) => {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  return columns.some(col => col.name === column);
};

const tableExists = async (db: SQLiteDatabase, name: string) => {
  return await db.getFirstAsync<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='${name}';`
  );
};

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

export const migrateDbToV6 = async (db: SQLiteDatabase) => {
  console.log('Migrating database to version 6');

  const deviceAppInfoTableExists = await tableExists(db, 'deviceAppInfo');

  if (!deviceAppInfoTableExists) {
    await db.execAsync(`
      CREATE TABLE deviceAppInfo (
        installedWhilePaywallTurnedOn BOOLEAN NOT NULL DEFAULT 1
      );
    `);

    await db.execAsync(`
      INSERT INTO deviceAppInfo (installedWhilePaywallTurnedOn) VALUES (${
        PAYWALL_TURNED_ON ? 1 : 0
      });
    `);

    console.log(
      `Created deviceAppInfo table and set installedWhilePaywallTurnedOn to ${
        PAYWALL_TURNED_ON ? 1 : 0
      }`
    );
  }

  console.log('Database migration to version 6 completed');
};
