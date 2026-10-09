import { Link } from "react-router";
import { BellIcon, LogOutIcon, MessageCircleIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import useIncomingRequestCount from "../hooks/useIncomingRequestCount";
import { useStream } from "../context/streamContext";
import Logo from "./Logo";
import Avatar from "./Avatar";

const Navbar = ({ showSidebar }) => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
  const requestCount = useIncomingRequestCount();
  const { unreadCount } = useStream();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/5 bg-base-100/70 backdrop-blur-xl lg:h-20">
      <div className="flex w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo lives in the sidebar on large screens */}
        <Link to="/" className={showSidebar ? "lg:hidden" : ""}>
          <Logo size="sm" />
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link to="/chats" className="btn btn-circle btn-ghost relative" aria-label="Chats">
            <MessageCircleIcon className="size-5 text-base-content/70" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold leading-4 text-white shadow-glow-pink">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>

          <Link
            to="/notifications"
            className="btn btn-circle btn-ghost relative"
            aria-label="Notifications"
          >
            <BellIcon className="size-5 text-base-content/70" />
            {requestCount > 0 && (
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-secondary shadow-glow-pink" />
            )}
          </Link>

          <Link
            to="/profile"
            title="Edit profile"
            className="mx-1 flex items-center gap-3 rounded-full transition hover:opacity-80"
          >
            <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="size-9" ring />
            <span className="hidden text-sm font-medium sm:block">{authUser?.fullName}</span>
          </Link>

          <button
            className="btn btn-circle btn-ghost"
            onClick={() => logoutMutation()}
            aria-label="Log out"
            title="Log out"
          >
            <LogOutIcon className="size-5 text-base-content/70" />
          </button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
