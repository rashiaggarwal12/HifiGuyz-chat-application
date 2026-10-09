import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

// Shares the "friendRequests" cache with the notifications page
const useIncomingRequestCount = () => {
  const { data } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  return data?.incomingReqs?.length || 0;
};
export default useIncomingRequestCount;
