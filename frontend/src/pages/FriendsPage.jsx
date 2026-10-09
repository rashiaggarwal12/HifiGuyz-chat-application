import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { CompassIcon, UsersIcon } from "lucide-react";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import EmptyState from "../components/EmptyState";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Friends</h1>
          <p className="mt-1 text-base-content/60">
            {friends.length > 0
              ? `${friends.length} ${friends.length === 1 ? "friend" : "friends"} to chat with`
              : "Your language partners will show up here"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : friends.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No friends yet"
            action={
              <Link to="/" className="btn-brand btn-sm gap-2">
                <CompassIcon className="size-4" />
                Meet new learners
              </Link>
            }
          >
            Send friend requests to language partners to start practicing together.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FriendsPage;
