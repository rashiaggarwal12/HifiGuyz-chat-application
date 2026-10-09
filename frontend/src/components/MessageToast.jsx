import toast from "react-hot-toast";
import Avatar from "./Avatar";

const MessageToast = ({ t, sender, text, onOpen }) => (
  <button
    onClick={() => {
      toast.dismiss(t.id);
      onOpen();
    }}
    className={`glass-panel flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl p-3 text-left shadow-2xl transition-all ${
      t.visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
    }`}
  >
    <Avatar src={sender?.image} name={sender?.name} size="size-10" />
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold">{sender?.name || "New message"}</p>
      <p className="truncate text-sm text-base-content/60">{text}</p>
    </div>
  </button>
);
export default MessageToast;
