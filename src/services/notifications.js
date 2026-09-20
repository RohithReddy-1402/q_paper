const READ_KEY = "qpaper_notifications_read";

export const NOTIFICATIONS = [
  {
    id: "rewards-system",
    title: "Earn rewards for contributing",
    message: "Upload question papers and earn rewards you can redeem from your profile.",
    link: "/nit-kkr/profile",
    date: "2026-09-18",
  },
  {
    id: "profile-page",
    title: "Your profile page is here",
    message: "Manage your account, track downloads and view your contribution history.",
    link: "/nit-kkr/profile",
    date: "2026-09-16",
  },
  {
    id: "pricing-plans",
    title: "New pricing plans",
    message: "Compare monthly, yearly and lifetime plans for unlimited downloads.",
    link: "/nit-kkr/pricing",
    date: "2026-09-14",
  },
];

function getReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage unavailable (private mode, quota) — read state just won't persist
  }
}

export function getNotifications() {
  const readIds = getReadIds();
  return NOTIFICATIONS.map((n) => ({ ...n, read: readIds.has(n.id) }));
}

export function markNotificationRead(id) {
  const readIds = getReadIds();
  readIds.add(id);
  saveReadIds(readIds);
}

export function markAllNotificationsRead() {
  saveReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
}
