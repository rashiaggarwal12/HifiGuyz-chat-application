import { useEffect, useMemo, useState } from "react";
import { useCreateChatClient } from "stream-chat-react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";
import { StreamContext } from "./streamContext";
import IncomingCall from "../components/IncomingCall";
import useMessageNotifications from "../hooks/useMessageNotifications";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const tokenProvider = async () => (await getStreamToken()).token;

// Keeps one chat + one video connection open for the whole session,
// so the inbox, unread counts and incoming calls work on every page.
const ConnectedStreamProvider = ({ authUser, children }) => {
  const userData = useMemo(
    () => ({ id: authUser._id, name: authUser.fullName, image: authUser.profilePic }),
    [authUser._id, authUser.fullName, authUser.profilePic]
  );

  const chatClient = useCreateChatClient({
    apiKey: STREAM_API_KEY,
    tokenOrProvider: tokenProvider,
    userData,
  });

  const [videoClient, setVideoClient] = useState(null);

  useEffect(() => {
    const client = new StreamVideoClient({
      apiKey: STREAM_API_KEY,
      user: userData,
      tokenProvider,
    });
    setVideoClient(client);

    return () => {
      client.disconnectUser().catch(console.error);
      setVideoClient(null);
    };
  }, [userData]);

  const unreadCount = useMessageNotifications(chatClient);

  const value = useMemo(
    () => ({ chatClient, videoClient, unreadCount }),
    [chatClient, videoClient, unreadCount]
  );

  return (
    <StreamContext.Provider value={value}>
      {videoClient ? (
        <StreamVideo client={videoClient}>
          {children}
          <IncomingCall />
        </StreamVideo>
      ) : (
        children
      )}
    </StreamContext.Provider>
  );
};

const StreamProvider = ({ children }) => {
  const { authUser } = useAuthUser();

  if (!authUser?.isOnboarded) return children;

  return <ConnectedStreamProvider authUser={authUser}>{children}</ConnectedStreamProvider>;
};
export default StreamProvider;
