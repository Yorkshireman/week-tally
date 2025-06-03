import * as Notifications from 'expo-notifications';
import { NotificationDataType } from '@/types';
import { useDbLogger } from '@/hooks';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { ReactNode, useEffect } from 'react';

export const NotificationsListener = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();
  const logDbContents = useDbLogger();

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(async response => {
      const action = response.actionIdentifier;
      const data = response.notification.request.content.data as NotificationDataType;

      if (action === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        const newId = uuid.v4();
        const nowIso = new Date().toISOString();
        await db.runAsync(`INSERT INTO entries (id, thingId, timestamp) VALUES (?, ?, ?);`, [
          newId,
          data.thingId,
          nowIso
        ]);

        logDbContents();
      }
    });

    return () => sub.remove();
  }, [db, logDbContents]);

  return children;
};
