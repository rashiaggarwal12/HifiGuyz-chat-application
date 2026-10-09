import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  StreamCall,
  CallControls,
  PaginatedGridLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import { useStream } from "../context/streamContext";
import PageLoader from "../components/PageLoader";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import useRecordActivity from "../hooks/useRecordActivity";
import { recordActivityOnExit } from "../lib/api";
import { localDay } from "../lib/stats";

const joinedCalls = new WeakSet();

const CallPage = () => {
  const { id: callId } = useParams();
  const { videoClient } = useStream();
  const [call, setCall] = useState(null);
  const [failed, setFailed] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!videoClient || !callId) return;
    mountedRef.current = true;

    // reuse the call if it is already known (e.g. a ringing call we just accepted)
    const callInstance =
      videoClient.state.calls.find((c) => c.type === "default" && c.id === callId) ||
      videoClient.call("default", callId);

    // join() may only be called once per call; StrictMode runs this effect twice in dev
    if (!joinedCalls.has(callInstance)) {
      joinedCalls.add(callInstance);
      callInstance.join({ create: true }).catch((error) => {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
        setFailed(true);
      });
    }
    setCall(callInstance);

    return () => {
      mountedRef.current = false;
      // deferred so React StrictMode's mount/unmount/mount doesn't end the call
      setTimeout(() => {
        if (!mountedRef.current && callInstance.state.callingState !== CallingState.LEFT) {
          callInstance.leave().catch(() => {});
        }
      }, 0);
    };
  }, [videoClient, callId]);

  if (!call && !failed) return <PageLoader message="Joining call..." />;

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/5 px-4 sm:px-6">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        {call && !failed && (
          <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-error/15 px-3 py-1 text-xs font-semibold text-error ring-1 ring-error/30">
            <span className="size-2 animate-pulse rounded-full bg-error" />
            LIVE
          </span>
        )}
      </header>

      <div className="min-h-0 flex-1 p-2 sm:p-4">
        {call && !failed ? (
          <StreamCall call={call}>
            <CallContent call={call} />
          </StreamCall>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-base-content/70">
              Could not initialize call. Please refresh or try again later.
            </p>
            <Link to="/" className="btn-brand btn-sm">
              Back home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Shown to the caller until someone else joins
const WaitingOverlay = ({ call }) => {
  const { useCallMembers } = useCallStateHooks();
  const members = useCallMembers();
  const other = members.find((m) => m.user_id !== call.currentUserId)?.user;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-base-100/70 backdrop-blur-sm">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        <Avatar src={other?.image} name={other?.name} size="size-24" ring />
      </div>
      <p className="font-display text-xl font-semibold">
        {other ? `Calling ${other.name}…` : "Waiting for others to join…"}
      </p>
    </div>
  );
};

const CallContent = ({ call }) => {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) navigate("/chats");
  }, [callingState, navigate]);

  // 1:1 calls end when the other person declines
  useEffect(() => {
    return call.on("call.rejected", (event) => {
      if (event.user?.id === call.currentUserId) return;
      toast(`${event.user?.name || "They"} declined the call`, { icon: "📵" });
      call.leave().catch(() => {});
    });
  }, [call]);

  // practice minutes only count while someone else is in the call
  const recordActivity = useRecordActivity();
  const talkTime = useRef({ total: 0, since: null });
  const isTalking = callingState === CallingState.JOINED && participantCount >= 2;

  useEffect(() => {
    const t = talkTime.current;
    if (isTalking && t.since === null) t.since = Date.now();
    if (!isTalking && t.since !== null) {
      t.total += Date.now() - t.since;
      t.since = null;
    }
  }, [isTalking]);

  useEffect(() => {
    const t = talkTime.current;

    // ignore very short calls; round everything else to at least a minute
    const takeMinutes = () => {
      if (t.since !== null) {
        t.total += Date.now() - t.since;
        t.since = null;
      }
      if (t.total < 30_000) return 0;
      const minutes = Math.max(1, Math.round(t.total / 60_000));
      t.total = 0;
      return minutes;
    };

    // tab closed or reloaded mid-call: React cleanup won't run, so send it now
    const onPageHide = () => {
      const minutes = takeMinutes();
      if (minutes) recordActivityOnExit({ type: "call", minutes, date: localDay() });
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      const minutes = takeMinutes();
      if (minutes) recordActivity("call", minutes);
    };
  }, [recordActivity]);

  const isWaiting = callingState === CallingState.JOINED && participantCount <= 1;

  return (
    <StreamTheme className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-base-200/60">
      {isWaiting && <WaitingOverlay call={call} />}
      <div className="min-h-0 flex-1 overflow-hidden">
        <PaginatedGridLayout />
      </div>
      <div className="relative z-20 flex justify-center border-t border-white/5 py-3">
        <CallControls />
      </div>
    </StreamTheme>
  );
};

export default CallPage;
