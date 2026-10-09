import { createContext, useContext } from "react";

export const StreamContext = createContext({
  chatClient: null,
  videoClient: null,
  unreadCount: 0,
});

export const useStream = () => useContext(StreamContext);
