import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button
      onClick={handleVideoCall}
      className="btn-brand btn-sm absolute right-4 top-3.5 z-10 gap-2"
      title="Start a video call"
    >
      <VideoIcon className="size-4" />
      <span className="hidden sm:inline">Video call</span>
    </button>
  );
}

export default CallButton;
