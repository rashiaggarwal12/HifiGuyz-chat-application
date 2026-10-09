// Small wrapper around the browser Notification API

export const notificationsSupported = () => typeof window !== "undefined" && "Notification" in window;

export const notificationPermission = () =>
  notificationsSupported() ? Notification.permission : "unsupported";

export const requestNotificationPermission = async () => {
  if (!notificationsSupported()) return "unsupported";
  return Notification.requestPermission();
};

// Only shows when the tab is in the background; returns true if a notification was shown
export const showBrowserNotification = ({ title, body, icon, tag, onClick }) => {
  if (!notificationsSupported() || Notification.permission !== "granted") return false;
  if (document.visibilityState === "visible") return false;

  try {
    const notification = new Notification(title, { body, icon: icon || "/logo.svg", tag });
    notification.onclick = () => {
      window.focus();
      onClick?.();
      notification.close();
    };
    return true;
  } catch {
    return false;
  }
};
