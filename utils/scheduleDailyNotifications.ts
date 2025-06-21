import * as Notifications from 'expo-notifications';
import { SQLiteDatabase } from 'expo-sqlite';

export const scheduleDailyNotifications = async (
  db: SQLiteDatabase,
  triggerImmediately?: boolean
) => {
  let notificationParams: Notifications.NotificationRequestInput;
  const title = 'Tap to update your totals';

  if (triggerImmediately) {
    notificationParams = {
      content: { title },
      trigger: null
    };
  } else {
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM settings WHERE key = ?',
      'askTime'
    );

    const askTimeMinutesAfterMidnight = Number(row?.value);

    notificationParams = {
      content: { title },
      trigger: {
        hour: Math.floor(Number(askTimeMinutesAfterMidnight) / 60),
        minute: askTimeMinutesAfterMidnight % 60,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR
      }
    };
  }

  await Notifications.scheduleNotificationAsync(notificationParams);

  console.log(
    triggerImmediately
      ? 'Triggered an immediate notification'
      : 'Scheduled daily notification with params: ',
    JSON.stringify(notificationParams, null, 2)
  );
};
