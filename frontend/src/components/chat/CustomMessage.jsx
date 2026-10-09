import { useState } from "react";
import { MessageSimple, useMessageContext } from "stream-chat-react";
import { PencilLineIcon } from "lucide-react";
import CorrectionCard from "./CorrectionCard";
import CorrectionModal from "./CorrectionModal";

// "Correct" action under a partner's message
const PartnerMessageTools = ({ message }) => {
  const [correcting, setCorrecting] = useState(false);

  return (
    <div className="mt-1 pl-14">
      <button
        onClick={() => setCorrecting(true)}
        className="flex items-center gap-1 text-[11px] font-medium text-base-content/40 transition hover:text-primary sm:opacity-0 sm:group-hover/msg:opacity-100"
      >
        <PencilLineIcon className="size-3" />
        Correct
      </button>

      {correcting && <CorrectionModal message={message} onClose={() => setCorrecting(false)} />}
    </div>
  );
};

const CustomMessage = (props) => {
  const { message, isMyMessage } = useMessageContext();
  const mine = isMyMessage();

  if (message.correction && !message.deleted_at) {
    return <CorrectionCard message={message} mine={mine} />;
  }

  const isPartnerText =
    !mine && message.type === "regular" && !message.deleted_at && Boolean(message.text?.trim());

  return (
    <div className="group/msg">
      <MessageSimple {...props} />
      {isPartnerText && <PartnerMessageTools message={message} />}
    </div>
  );
};
export default CustomMessage;
