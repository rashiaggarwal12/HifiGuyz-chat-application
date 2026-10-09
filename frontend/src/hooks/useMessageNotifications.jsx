import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import MessageToast from "../components/MessageToast";
import { showBrowserNotification } from "../lib/notify";

const describe = (message) => {
  if (message.correction) return "✏️ Suggested a correction";
  if (message.text) return message.text;
  if (message.attachments?.length) return "📎 Sent an attachment";
  return "New message";
};

// Tracks the total unread count and alerts the user about new messages
const useMessageNotifications = (chatClient) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // read the latest path inside the event handler without re-subscribing
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    if (!chatClient) return;

    setUnreadCount(chatClient.user?.total_unread_count || 0);
    const seen = new Set();

    const { unsubscribe } = chatClient.on((event) => {
      if (typeof event.total_unread_count === "number") {
        setUnreadCount(event.total_unread_count);
      }

      if (event.type !== "message.new" && event.type !== "notification.message_new") return;

      const message = event.message;
      const sender = message?.user;
      if (!message || !sender || sender.id === chatClient.userID) return;

      // message.new and notification.message_new can both arrive for the same message
      if (seen.has(message.id)) return;
      seen.add(message.id);

      const chatPath = `/chat/${sender.id}`;
      const viewingThisChat = pathnameRef.current === chatPath;
      if (viewingThisChat && document.visibilityState === "visible") return;

      const text = describe(message);
      const openChat = () => navigate(chatPath);

      const shown = showBrowserNotification({
        title: sender.name || "New message",
        body: text,
        icon: sender.image,
        tag: `msg-${sender.id}`,
        onClick: openChat,
      });

      if (!shown) {
        toast.custom(
          (t) => <MessageToast t={t} sender={sender} text={text} onOpen={openChat} />,
          { id: `msg-${sender.id}`, duration: 4000, position: "top-right" }
        );
      }
    });

    return unsubscribe;
  }, [chatClient, navigate]);

  return unreadCount;
};
export default useMessageNotifications;
