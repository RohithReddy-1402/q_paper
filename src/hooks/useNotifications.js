import { useCallback, useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notifications";

export default function useNotifications() {
  const [notifications, setNotifications] = useState(() => getNotifications());

  const refresh = useCallback(() => setNotifications(getNotifications()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markAsRead = useCallback(
    (id) => {
      markNotificationRead(id);
      refresh();
    },
    [refresh],
  );

  const markAllAsRead = useCallback(() => {
    markAllNotificationsRead();
    refresh();
  }, [refresh]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}
