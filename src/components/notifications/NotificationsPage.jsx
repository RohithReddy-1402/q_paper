import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../Header";
import Footer from "../Footer";
import useNotifications from "../../hooks/useNotifications";

export default function NotificationsPage({
  isLoggedIn,
  user,
  onLoginClick,
  onLogin,
  onLogout,
  onSignUpClick,
}) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Notifications | NIT KKR PYQs</title>
      </Helmet>
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        onLoginClick={onLoginClick}
        onLogin={onLogin}
        onLogout={onLogout}
        onSignUpClick={onSignUpClick}
      />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No notifications yet.</p>
        ) : (
          <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200 overflow-hidden">
            {notifications.map((n) => (
              <li key={n.id} className={n.read ? "bg-white" : "bg-blue-50"}>
                <Link
                  to={n.link}
                  onClick={() => markAsRead(n.id)}
                  className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50"
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      n.read ? "bg-transparent" : "bg-blue-600"
                    }`}
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-base font-medium text-gray-900">
                        {n.title}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {n.date}
                      </span>
                    </span>
                    <span className="block text-sm text-gray-600 mt-1">
                      {n.message}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
