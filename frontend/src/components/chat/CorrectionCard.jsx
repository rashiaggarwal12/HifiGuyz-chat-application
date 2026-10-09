import { useMemo } from "react";
import { PencilLineIcon } from "lucide-react";
import { wordDiff } from "../../lib/wordDiff";
import Avatar from "../Avatar";
import DiffText from "./DiffText";

// Renders a message that carries a `correction` payload
const CorrectionCard = ({ message, mine }) => {
  const { original, corrected, note } = message.correction;
  const parts = useMemo(() => wordDiff(original, corrected), [original, corrected]);
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex items-end gap-2 px-3 py-1.5 sm:px-5 ${mine ? "justify-end" : ""}`}>
      {!mine && <Avatar src={message.user?.image} name={message.user?.name} size="size-8" />}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-primary/25 bg-base-300/60">
        <div className="flex items-center gap-2 border-b border-white/5 bg-primary/10 px-4 py-2 text-xs font-semibold text-violet-200">
          <PencilLineIcon className="size-3.5" />
          {mine
            ? "You suggested a correction"
            : `${message.user?.name || "Your partner"} corrected you`}
          <span className="ml-auto font-normal text-base-content/40">{time}</span>
        </div>
        <div className="space-y-2 px-4 py-3 text-sm">
          <p className="leading-relaxed">
            <DiffText parts={parts} />
          </p>
          <p className="text-base-content/90">
            <span className="mr-1.5 text-success">✓</span>
            {corrected}
          </p>
          {note && (
            <p className="rounded-lg bg-white/5 px-3 py-2 text-xs text-base-content/70">
              💡 {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default CorrectionCard;
