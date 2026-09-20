import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recent = notifications.slice(0, 5);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] leading-4 text-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <span className="font-medium text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {recent.length === 0 && (
              <li className="px-4 py-6 text-sm text-gray-500 text-center">
                No notifications yet
              </li>
            )}
            {recent.map((n) => (
              <li key={n.id}>
                <Link
                  to={n.link}
                  onClick={() => {
                    markAsRead(n.id);
                    setOpen(false);
                  }}
                  className={`flex items-start gap-2 px-4 py-3 hover:bg-gray-50 ${
                    n.read ? "" : "bg-blue-50"
                  }`}
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      n.read ? "bg-transparent" : "bg-blue-600"
                    }`}
                  />
                  <span>
                    <span className="block text-sm font-medium text-gray-900">
                      {n.title}
                    </span>
                    <span className="block text-sm text-gray-600 mt-0.5">
                      {n.message}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-4 py-2 border-t border-gray-200 text-center">
            <Link
              to="/nit-kkr/notifications"
              onClick={() => setOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
