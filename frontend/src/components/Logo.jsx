import { AudioWaveformIcon } from "lucide-react";

const Logo = ({ size = "md" }) => {
  const small = size === "sm";

  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid place-items-center rounded-xl bg-brand shadow-glow ${
          small ? "size-8" : "size-10"
        }`}
      >
        <AudioWaveformIcon className={`text-white ${small ? "size-4" : "size-5"}`} />
      </span>
      <span
        className={`font-display font-bold tracking-tight ${small ? "text-xl" : "text-2xl"}`}
      >
        Hifi<span className="text-gradient">Guyz</span>
      </span>
    </span>
  );
};
export default Logo;
