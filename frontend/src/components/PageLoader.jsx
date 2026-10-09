import { AudioWaveformIcon } from "lucide-react";

const PageLoader = ({ message }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <div className="relative grid size-16 place-items-center rounded-2xl bg-brand shadow-glow-lg">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/30" />
        <AudioWaveformIcon className="relative size-8 text-white" />
      </div>
      {message && <p className="text-sm text-base-content/60">{message}</p>}
    </div>
  );
};
export default PageLoader;
