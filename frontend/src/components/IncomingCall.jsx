import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  CallingState,
  StreamCall,
  useCallStateHooks,
  useCalls,
} from "@stream-io/video-react-sdk";
import { PhoneIcon, PhoneOffIcon } from "lucide-react";
import Avatar from "./Avatar";
import { showBrowserNotification } from "../lib/notify";

// Simple two-tone ring made with the Web Audio API (no audio file needed)
const useRingtone = (active) => {
  useEffect(() => {
    if (!active) return;
    let ctx;
    try {
      ctx = new AudioContext();
    } catch {
      return;
    }

    const ring = () => {
      [0, 0.25].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = offset ? 660 : 880;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.22);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.25);
      });
    };

    ring();
    const interval = setInterval(ring, 2000);
    return () => {
      clearInterval(interval);
      ctx.close().catch(() => {});
    };
  }, [active]);
};

const IncomingCallCard = ({ call }) => {
  const { useCallCallingState, useCallCreatedBy } = useCallStateHooks();
  const callingState = useCallCallingState();
  const caller = useCallCreatedBy();
  const navigate = useNavigate();

  const isRinging = callingState === CallingState.RINGING;
  useRingtone(isRinging);

  useEffect(() => {
    if (!isRinging) return;
    showBrowserNotification({
      title: "Incoming video call",
      body: `${caller?.name || "Someone"} is calling you on HifiGuyz`,
      icon: caller?.image,
      tag: `call-${call.id}`,
    });
  }, [isRinging, caller?.name, caller?.image, call.id]);

  if (!isRinging) return null;

  // joining a ringing call accepts it; CallPage picks up this same call object
  const accept = () => navigate(`/call/${call.id}`);
  const decline = () => call.leave({ reject: true, reason: "decline" }).catch(console.error);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="glass-panel w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl">
        <div className="relative mx-auto w-fit">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
          <Avatar src={caller?.image} name={caller?.name} size="size-24" ring />
        </div>
        <p className="mt-6 text-sm text-base-content/60">Incoming video call</p>
        <h2 className="mt-1 font-display text-2xl font-bold">{caller?.name || "Someone"}</h2>

        <div className="mt-8 flex justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={decline}
              className="btn btn-circle btn-lg border-0 bg-error text-white hover:bg-error/80"
              aria-label="Decline call"
            >
              <PhoneOffIcon className="size-6" />
            </button>
            <span className="text-xs text-base-content/60">Decline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={accept}
              className="btn btn-circle btn-lg animate-bounce border-0 bg-success text-white shadow-[0_0_24px_rgba(52,211,153,0.6)] hover:bg-success/80"
              aria-label="Accept call"
            >
              <PhoneIcon className="size-6" />
            </button>
            <span className="text-xs text-base-content/60">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Watches for calls ringing this user, on any page
const IncomingCall = () => {
  const calls = useCalls();
  const { pathname } = useLocation();

  const incoming = calls.find(
    (call) => call.ringing && !call.isCreatedByMe && pathname !== `/call/${call.id}`
  );
  if (!incoming) return null;

  return (
    <StreamCall call={incoming}>
      <IncomingCallCard call={incoming} />
    </StreamCall>
  );
};
export default IncomingCall;
