import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { ArrowLeftIcon, MessageCircleIcon } from "lucide-react";
import toast from "react-hot-toast";

import { useStream } from "../context/streamContext";
import ChatLoader from "../components/ChatLoader";
import ChatPreview from "../components/ChatPreview";
import CallButton from "../components/CallButton";
import CustomMessage from "../components/chat/CustomMessage";
import useRecordActivity from "../hooks/useRecordActivity";

const sort = { last_message_at: -1 };
const options = { state: true, watch: true, presence: true, limit: 30 };

const InboxEmpty = () => (
  <div className="px-6 py-12 text-center text-sm text-base-content/50">
    No conversations yet.
    <br />
    <Link to="/friends" className="font-medium text-primary hover:underline">
      Message a friend
    </Link>{" "}
    to get started.
  </div>
);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { chatClient, videoClient } = useStream();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);

  const recordActivity = useRecordActivity();
  const myId = chatClient?.userID;

  // wraps Stream's send so only the tab that sent the message counts it
  const doSendMessageRequest = useCallback(
    (targetChannel, message, options) => {
      const request = targetChannel.sendMessage(message, options);
      request.then(() => recordActivity("message")).catch(() => {});
      return request;
    },
    [recordActivity]
  );
  const filters = useMemo(() => ({ type: "messaging", members: { $in: [myId] } }), [myId]);

  useEffect(() => {
    if (!chatClient || !targetUserId) {
      setChannel(null);
      return;
    }

    let cancelled = false;

    const openChannel = async () => {
      try {
        // sorted so both users end up in the same channel no matter who starts the chat
        const channelId = [chatClient.userID, targetUserId].sort().join("-");
        const currChannel = chatClient.channel("messaging", channelId, {
          members: [chatClient.userID, targetUserId],
        });
        await currChannel.watch();
        if (!cancelled) setChannel(currChannel);
      } catch (error) {
        console.error("Error opening chat:", error);
        toast.error("Could not open this chat. Please try again.");
      }
    };

    setChannel(null);
    openChannel();

    return () => {
      cancelled = true;
    };
  }, [chatClient, targetUserId]);

  const Preview = useCallback(
    (props) => <ChatPreview {...props} activeUserId={targetUserId} />,
    [targetUserId]
  );

  if (!chatClient) return <ChatLoader />;

  const handleVideoCall = async () => {
    if (!channel || !videoClient) return;

    // a fresh id per call, so each call rings again
    const callId = crypto.randomUUID();
    try {
      const call = videoClient.call("default", callId);
      await call.getOrCreate({
        ring: true,
        data: { members: [{ user_id: myId }, { user_id: targetUserId }] },
      });

      // keep a record in the chat, with a link in case the ring is missed
      channel
        .sendMessage({
          text: `📹 I started a video call. Join here: ${window.location.origin}/call/${callId}`,
        })
        .catch(() => {});

      navigate(`/call/${callId}`);
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Could not start the call. Please try again.");
    }
  };

  return (
    <div
      className={`${
        targetUserId ? "h-[calc(100dvh-4rem)]" : "h-[calc(100dvh-10rem)]"
      } sm:p-4 lg:h-[calc(100dvh-5rem)]`}
    >
      <div className="glass-panel mx-auto flex h-full max-w-6xl overflow-hidden sm:rounded-3xl">
        <Chat client={chatClient} theme="str-chat__theme-dark">
          {/* INBOX: full width on mobile when no chat is open, sidebar on desktop */}
          <aside
            className={`w-full shrink-0 flex-col border-r border-white/5 md:flex md:w-80 ${
              targetUserId ? "hidden" : "flex"
            }`}
          >
            <div className="flex h-16 items-center px-5">
              <h1 className="font-display text-xl font-bold">Chats</h1>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
              <ChannelList
                filters={filters}
                sort={sort}
                options={options}
                setActiveChannelOnMount={false}
                Preview={Preview}
                EmptyStateIndicator={InboxEmpty}
              />
            </div>
          </aside>

          {/* CONVERSATION */}
          <section className={`min-w-0 flex-1 ${targetUserId ? "flex" : "hidden md:flex"}`}>
            {!targetUserId ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 ring-1 ring-primary/25">
                  <MessageCircleIcon className="size-7 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold">Pick a conversation</h2>
                <p className="mt-2 max-w-xs text-sm text-base-content/60">
                  Choose a chat on the left, or message a friend from your Friends page.
                </p>
              </div>
            ) : !channel ? (
              <div className="flex flex-1 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            ) : (
              <Channel
                channel={channel}
                Message={CustomMessage}
                doSendMessageRequest={doSendMessageRequest}
              >
                <div className="relative flex w-full flex-col">
                  <Link
                    to="/chats"
                    className="btn btn-circle btn-ghost btn-sm absolute left-2 top-4 z-10 md:hidden"
                    aria-label="Back to chats"
                  >
                    <ArrowLeftIcon className="size-5" />
                  </Link>
                  <CallButton handleVideoCall={handleVideoCall} />
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                </div>
                <Thread />
              </Channel>
            )}
          </section>
        </Chat>
      </div>
    </div>
  );
};
export default ChatPage;
