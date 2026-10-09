import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { acceptFriendRequest, getFriendRequests, rejectFriendRequest } from "../lib/api";
import {
  BellIcon,
  CheckIcon,
  MessageCircleIcon,
  SparklesIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import Avatar from "../components/Avatar";
import LanguageBadges from "../components/LanguageBadges";
import EmptyState from "../components/EmptyState";
import DesktopNotificationsCard from "../components/DesktopNotificationsCard";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast.success("Request declined");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      // they can show up in "Meet New Learners" again
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => toast.error(error?.response?.data?.message || "Could not decline"),
  });

  const isBusy = isAccepting || isRejecting;

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-base-content/60">Friend requests and new connections</p>
        </div>

        <DesktopNotificationsCard />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-base-content/50">
                  <UserPlusIcon className="size-4 text-primary" />
                  Friend requests
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-white">
                    {incomingRequests.length}
                  </span>
                </h2>

                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="card-neon flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <Avatar
                        src={request.sender.profilePic}
                        name={request.sender.fullName}
                        size="size-14"
                        ring
                      />
                      <div className="min-w-0 space-y-2">
                        <h3 className="truncate font-semibold">{request.sender.fullName}</h3>
                        <LanguageBadges
                          native={request.sender.nativeLanguage}
                          learning={request.sender.learningLanguage}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm flex-1 gap-2 border-white/10 bg-white/5 hover:border-error/40 hover:bg-error/10 hover:text-error sm:flex-none"
                        onClick={() => rejectRequestMutation(request._id)}
                        disabled={isBusy}
                      >
                        <XIcon className="size-4" />
                        Decline
                      </button>
                      <button
                        className="btn-brand btn-sm flex-1 gap-2 sm:flex-none"
                        onClick={() => acceptRequestMutation(request._id)}
                        disabled={isBusy}
                      >
                        <CheckIcon className="size-4" />
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-base-content/50">
                  <SparklesIcon className="size-4 text-success" />
                  New connections
                </h2>

                {acceptedRequests.map((notification) => (
                  <div key={notification._id} className="glass-panel flex items-center gap-4 rounded-2xl p-4">
                    <Avatar
                      src={notification.recipient.profilePic}
                      name={notification.recipient.fullName}
                      size="size-11"
                    />
                    <p className="min-w-0 flex-1 text-sm">
                      <span className="font-semibold">{notification.recipient.fullName}</span>{" "}
                      <span className="text-base-content/60">accepted your friend request</span>
                    </p>
                    <Link
                      to={`/chat/${notification.recipient._id}`}
                      className="btn btn-ghost btn-sm gap-1.5 text-primary"
                    >
                      <MessageCircleIcon className="size-4" />
                      <span className="hidden sm:inline">Say hi</span>
                    </Link>
                  </div>
                ))}
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <EmptyState icon={BellIcon} title="You're all caught up">
                When someone sends you a friend request or accepts yours, it'll show up here.
              </EmptyState>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
