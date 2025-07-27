import { SQLiteDatabase } from 'expo-sqlite';
import type {
  ChartScaleSetting,
  ChartSizeSetting,
  Setting,
  ShowChartSetting,
  ThingWithLogEntriesCount
} from '@/types';

export const fetchDbChartThingId = async (db: SQLiteDatabase) => {
  try {
    const result = await db.getFirstAsync<Setting>(
      'SELECT value FROM settings WHERE key = ?',
      'chartThingId'
    );

    if (!result || !result.value) {
      return null;
    }

    return result.value;
  } catch (error) {
    console.error('Error fetching DB Chart Thing ID: ', error);
    return null;
  }
};

export const fetchDbSettingsChartScale = async (db: SQLiteDatabase) => {
  try {
    const result = await db.getFirstAsync<ChartScaleSetting | null>(
      'SELECT value FROM settings WHERE key = ?',
      'chartScale'
    );

    if (!result || !result.value) {
      return null;
    }

    return result.value;
  } catch (error) {
    console.error('Error fetching DB Chart Scale: ', error);
    return null;
  }
};

export const fetchDbSettingsChartSize = async (db: SQLiteDatabase) => {
  try {
    const result = await db.getFirstAsync<ChartSizeSetting | null>(
      'SELECT value FROM settings WHERE key = ?',
      'chartSize'
    );

    if (!result || !result.value) {
      return null;
    }

    return result.value;
  } catch (error) {
    console.error('Error fetching DB Chart Size: ', error);
    return null;
  }
};

export const fetchDbSettingsShowChart = async (db: SQLiteDatabase) => {
  console.log('Fetching DB Chart Visible setting');
  try {
    const result = await db.getFirstAsync<ShowChartSetting>(
      'SELECT value FROM settings WHERE key = ?',
      'showChart'
    );
    console.log('DB Chart Visible setting query result.value: ', result?.value);
    if (!result || !result.value) {
      return null;
    }

    if (result.value === 'true') {
      return true;
    } else if (result.value === 'false') {
      return false;
    }

    return null;
  } catch (error) {
    console.error('Error fetching DB Chart Visible setting: ', error);
    return null;
  }
};

export const fetchDbFirstCurrentlyTrackedThing = async (db: SQLiteDatabase) => {
  try {
    const thing = await db.getFirstAsync<ThingWithLogEntriesCount>(
      'SELECT * FROM things WHERE currentlyTracking = 1 ORDER BY createdAt DESC LIMIT 1'
    );

    if (!thing) return null;

    return thing;
  } catch (error) {
    console.error('Error fetching first currently tracked Thing: ', error);
    return null;
  }
};
