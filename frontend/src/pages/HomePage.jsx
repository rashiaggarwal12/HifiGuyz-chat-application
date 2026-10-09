import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  cancelFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  CompassIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import useAuthUser from "../hooks/useAuthUser";
import useIncomingRequestCount from "../hooks/useIncomingRequestCount";
import FriendCard from "../components/FriendCard";
import Avatar from "../components/Avatar";
import LanguageBadges from "../components/LanguageBadges";
import EmptyState from "../components/EmptyState";
import { capitialize } from "../lib/utils";
import { activeStreak } from "../lib/stats";

const FRIENDS_PREVIEW = 4;

const Spinner = () => (
  <div className="flex justify-center py-12">
    <span className="loading loading-spinner loading-lg text-primary" />
  </div>
);

const HomePage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const requestCount = useIncomingRequestCount();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending: isSending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
    onError: (error) => toast.error(error?.response?.data?.message || "Could not send request"),
  });

  const { mutate: cancelRequestMutation, isPending: isCancelling } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      toast.success("Request cancelled");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: (error) => toast.error(error?.response?.data?.message || "Could not cancel request"),
  });

  // recipient id -> request id, so a sent request can be cancelled
  const outgoingRequests = useMemo(
    () => new Map((outgoingFriendReqs || []).map((req) => [req.recipient._id, req._id])),
    [outgoingFriendReqs]
  );

  const firstName = authUser?.fullName?.split(" ")[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* WELCOME BANNER */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-primary/25 via-base-200 to-secondary/15 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-secondary/25 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-base-content/60">Welcome back</p>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
                Hey {firstName} <span className="inline-block">👋</span>
              </h1>
              <p className="mt-2 max-w-lg text-base-content/70">
                {authUser?.learningLanguage
                  ? `Ready to practice some ${capitialize(authUser.learningLanguage)} today?`
                  : "Ready to meet new people today?"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/profile"
                className="glass-panel min-w-24 rounded-2xl px-5 py-3 text-center transition hover:border-orange-400/40"
                title="Your practice streak"
              >
                <p className="font-display text-2xl font-bold text-orange-400">
                  🔥 {activeStreak(authUser?.stats)}
                </p>
                <p className="text-xs text-base-content/60">Day streak</p>
              </Link>
              <div className="glass-panel min-w-24 rounded-2xl px-5 py-3 text-center">
                <p className="font-display text-2xl font-bold">{friends.length}</p>
                <p className="text-xs text-base-content/60">Friends</p>
              </div>
              <Link
                to="/notifications"
                className="glass-panel min-w-24 rounded-2xl px-5 py-3 text-center transition hover:border-secondary/40"
              >
                <p className="font-display text-2xl font-bold text-secondary">{requestCount}</p>
                <p className="text-xs text-base-content/60">Requests</p>
              </Link>
            </div>
          </div>
        </section>

        {/* FRIENDS */}
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <UsersIcon className="size-6 text-primary" />
              Your Friends
            </h2>
            {friends.length > FRIENDS_PREVIEW && (
              <Link
                to="/friends"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ArrowRightIcon className="size-4" />
              </Link>
            )}
          </div>

          {loadingFriends ? (
            <Spinner />
          ) : friends.length === 0 ? (
            <EmptyState icon={UsersIcon} title="No friends yet">
              Send a friend request to someone below to start chatting and practicing together.
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {friends.slice(0, FRIENDS_PREVIEW).map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* DISCOVER */}
        <section className="space-y-5">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <CompassIcon className="size-6 text-secondary" />
              Meet New Learners
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              Language exchange partners picked for your profile
            </p>
          </div>

          {loadingUsers ? (
            <Spinner />
          ) : recommendedUsers.length === 0 ? (
            <EmptyState icon={CompassIcon} title="No recommendations yet">
              Check back later for new language partners!
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {recommendedUsers.map((user) => {
                const sentRequestId = outgoingRequests.get(user._id);

                return (
                  <div key={user._id} className="card-neon flex flex-col gap-4 p-5">
                    <div className="flex items-center gap-4">
                      <Avatar src={user.profilePic} name={user.fullName} size="size-16" ring />
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold">{user.fullName}</h3>
                        {user.location && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/50">
                            <MapPinIcon className="size-3" />
                            <span className="truncate">{user.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <LanguageBadges native={user.nativeLanguage} learning={user.learningLanguage} />

                    {user.bio && (
                      <p className="line-clamp-2 text-sm text-base-content/60">{user.bio}</p>
                    )}

                    {sentRequestId ? (
                      <div className="mt-auto flex gap-2">
                        <span className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/10 text-sm font-semibold text-success">
                          <CheckIcon className="size-4" />
                          Request sent
                        </span>
                        <button
                          className="btn btn-sm border-white/10 bg-white/5 hover:border-error/40 hover:bg-error/10 hover:text-error"
                          onClick={() => cancelRequestMutation(sentRequestId)}
                          disabled={isCancelling}
                          title="Cancel request"
                        >
                          <XIcon className="size-4" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-brand btn-sm mt-auto gap-2"
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={isSending}
                      >
                        <UserPlusIcon className="size-4" />
                        Add friend
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
