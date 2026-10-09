import { useNavigate } from "react-router";
import Avatar from "./Avatar";

const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
};

const previewText = (message, myId) => {
  if (!message) return "Say hi 👋";
  const prefix = message.user?.id === myId ? "You: " : "";
  if (message.correction) return `${prefix}✏️ Suggested a correction`;
  if (message.text) return prefix + message.text;
  if (message.attachments?.length) return `${prefix}📎 Attachment`;
  return prefix + "Message";
};

// One row in the inbox, rendered by Stream's ChannelList
const ChatPreview = ({ channel, lastMessage, unread, activeUserId }) => {
  const navigate = useNavigate();
  const myId = channel.getClient().userID;

  const other = Object.values(channel.state.members).find((m) => m.user_id !== myId)?.user;
  if (!other) return null;

  const isActive = other.id === activeUserId;
  const hasUnread = unread > 0 && !isActive;

  return (
    <button
      onClick={() => navigate(`/chat/${other.id}`)}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
        isActive ? "bg-primary/15 ring-1 ring-primary/30" : "hover:bg-white/5"
      }`}
    >
      <Avatar src={other.image} name={other.name} size="size-12" online={other.online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate font-semibold">{other.name}</p>
          <span
            className={`shrink-0 text-[11px] ${hasUnread ? "text-secondary" : "text-base-content/40"}`}
          >
            {formatTime(lastMessage?.created_at || channel.state.last_message_at)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={`truncate text-sm ${
              hasUnread ? "font-medium text-base-content" : "text-base-content/50"
            }`}
          >
            {previewText(lastMessage, myId)}
          </p>
          {hasUnread && (
            <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-secondary px-1.5 text-[11px] font-bold leading-5 text-white shadow-glow-pink">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
export default ChatPreview;
