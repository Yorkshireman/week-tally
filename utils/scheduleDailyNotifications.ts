import * as Notifications from 'expo-notifications';
import { SQLiteDatabase } from 'expo-sqlite';

export const scheduleDailyNotifications = async (db: SQLiteDatabase) => {
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    'askTime'
  );

  const askTimeMinutesAfterMidnight = Number(row?.value);

  const notificationParams: Notifications.NotificationRequestInput = {
    content: {
      title: 'Tap to update your totals'
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
};
