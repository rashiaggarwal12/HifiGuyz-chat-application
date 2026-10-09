import { useState } from "react";
import { BellRingIcon } from "lucide-react";
import toast from "react-hot-toast";
import { notificationPermission, requestNotificationPermission } from "../lib/notify";

const DesktopNotificationsCard = () => {
  const [permission, setPermission] = useState(notificationPermission);

  if (permission === "unsupported") return null;

  const enable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") toast.success("Desktop notifications enabled");
    else toast.error("Notifications are blocked. You can allow them in your browser's site settings.");
  };

  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/25">
        <BellRingIcon className="size-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">Desktop notifications</p>
        <p className="text-sm text-base-content/60">
          {permission === "granted"
            ? "On. You'll be alerted about new messages and calls while HifiGuyz is in the background."
            : permission === "denied"
              ? "Blocked. Allow notifications for this site in your browser settings to turn them on."
              : "Get alerted about new messages and incoming calls when this tab is in the background."}
        </p>
      </div>
      {permission === "default" && (
        <button onClick={enable} className="btn-brand btn-sm">
          Enable
        </button>
      )}
    </div>
  );
};
export default DesktopNotificationsCard;
