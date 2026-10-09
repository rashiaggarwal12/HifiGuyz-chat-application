import { useState } from "react";
import { useChannelStateContext } from "stream-chat-react";
import toast from "react-hot-toast";
import { LoaderIcon, PencilLineIcon, XIcon } from "lucide-react";
import { wordDiff } from "../../lib/wordDiff";
import DiffText from "./DiffText";
import useRecordActivity from "../../hooks/useRecordActivity";

const CorrectionModal = ({ message, onClose }) => {
  const { channel } = useChannelStateContext();
  const [corrected, setCorrected] = useState(message.text);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const recordActivity = useRecordActivity();

  const trimmed = corrected.trim();
  const unchanged = trimmed === message.text.trim();

  const send = async (e) => {
    e.preventDefault();
    if (!trimmed || unchanged) return;

    setSending(true);
    try {
      await channel.sendMessage({
        // plain text fallback for previews, notifications and other clients
        text: `✏️ ${trimmed}`,
        correction: {
          messageId: message.id,
          original: message.text,
          corrected: trimmed,
          note: note.trim(),
        },
      });
      recordActivity("correction");
      toast.success("Correction sent");
      onClose();
    } catch (error) {
      console.error("Error sending correction:", error);
      toast.error("Could not send the correction");
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={send}
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-lg space-y-5 rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <PencilLineIcon className="size-5 text-primary" />
            Suggest a correction
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-base-content/40">
            Original
          </p>
          <p className="rounded-xl bg-base-300/50 px-4 py-3 text-sm">{message.text}</p>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-base-content/40">
            Your correction
          </span>
          <textarea
            autoFocus
            value={corrected}
            onChange={(e) => setCorrected(e.target.value)}
            className="field-textarea h-24"
          />
        </label>

        {!unchanged && trimmed && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              Preview
            </p>
            <p className="rounded-xl bg-base-300/50 px-4 py-3 text-sm">
              <DiffText parts={wordDiff(message.text, trimmed)} />
            </p>
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-base-content/40">
            Note (optional)
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            placeholder="e.g. 'went' is the past tense of 'go'"
            className="field"
          />
        </label>

        <button
          type="submit"
          className="btn-brand w-full gap-2"
          disabled={!trimmed || unchanged || sending}
        >
          {sending ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            <PencilLineIcon className="size-4" />
          )}
          Send correction
        </button>
      </form>
    </div>
  );
};
export default CorrectionModal;
