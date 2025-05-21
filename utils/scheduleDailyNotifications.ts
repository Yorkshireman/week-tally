import * as Notifications from 'expo-notifications';
import { NotificationDataType } from '@/types';
import { SQLiteDatabase } from 'expo-sqlite';

export const scheduleDailyNotifications = async (db: SQLiteDatabase) => {
  const things = await db.getAllAsync<{ id: string; title: string }>(
    'SELECT id, title FROM things;',
    []
  );

  if (!things.length) {
    console.error('No Things found!');
    return;
  }

  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    'askTime'
  );

  const askTimeMinutesAfterMidnight = Number(row?.value);

  things.forEach(async thing => {
    const notificationParams: Notifications.NotificationRequestInput = {
      content: {
        body: "Tap if you did, or ignore/dismiss this notification if you didn't",
        data: { thingId: thing.id } as NotificationDataType,
        title: `Have you done ${thing.title} today?`
      },
      trigger: {
        hour: Math.floor(Number(askTimeMinutesAfterMidnight) / 60),
        minute: askTimeMinutesAfterMidnight % 60,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR
      }
    };

    await Notifications.scheduleNotificationAsync(notificationParams);

    console.log(
      'Scheduled daily notification with params: ',
      JSON.stringify(notificationParams, null, 2)
    );
  });
};
