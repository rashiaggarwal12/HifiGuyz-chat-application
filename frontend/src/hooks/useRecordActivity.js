import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { recordActivity } from "../lib/api";
import { localDay } from "../lib/stats";

// Returns a function that records practice and refreshes the cached stats
const useRecordActivity = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (type, minutes) => {
      try {
        const { stats } = await recordActivity({ type, minutes, date: localDay() });
        queryClient.setQueryData(["authUser"], (old) =>
          old?.user ? { ...old, user: { ...old.user, stats } } : old
        );
      } catch (error) {
        console.error("Could not record activity:", error);
      }
    },
    [queryClient]
  );
};
export default useRecordActivity;
