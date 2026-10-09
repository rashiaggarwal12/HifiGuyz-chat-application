import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import Avatar from "./Avatar";
import LanguageBadges from "./LanguageBadges";

const FriendCard = ({ friend }) => {
  return (
    <div className="card-neon flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3">
        <Avatar src={friend.profilePic} name={friend.fullName} size="size-12" ring />
        <h3 className="truncate font-semibold">{friend.fullName}</h3>
      </div>

      <LanguageBadges native={friend.nativeLanguage} learning={friend.learningLanguage} />

      <Link to={`/chat/${friend._id}`} className="btn-brand btn-sm mt-auto gap-2">
        <MessageCircleIcon className="size-4" />
        Message
      </Link>
    </div>
  );
};
export default FriendCard;
