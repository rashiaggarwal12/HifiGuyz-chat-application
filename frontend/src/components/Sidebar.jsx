import { Link, useLocation } from "react-router";
import { BellIcon, CircleUserIcon, HouseIcon, MessageCircleIcon, UsersIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useIncomingRequestCount from "../hooks/useIncomingRequestCount";
import { useStream } from "../context/streamContext";
import Logo from "./Logo";
import Avatar from "./Avatar";

export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: HouseIcon },
  { to: "/chats", label: "Chats", icon: MessageCircleIcon },
  { to: "/friends", label: "Friends", icon: UsersIcon },
  { to: "/notifications", label: "Notifications", icon: BellIcon },
  { to: "/profile", label: "Profile", icon: CircleUserIcon },
];

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const requestCount = useIncomingRequestCount();
  const { unreadCount } = useStream();
  const currentPath = useLocation().pathname;

  const badges = { "/chats": unreadCount, "/notifications": requestCount };

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/5 bg-base-200/60 backdrop-blur-xl lg:flex">
      <Link to="/" className="flex h-20 items-center px-6">
        <Logo />
      </Link>

      <nav className="flex-1 space-y-1.5 px-4 py-4">
        <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-base-content/40">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon }) => {
          const Icon = icon;
          const active = to === "/chats" ? currentPath.startsWith("/chat") : currentPath === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "bg-gradient-to-r from-primary/20 to-secondary/5 text-white ring-1 ring-primary/30"
                  : "text-base-content/60 hover:bg-white/5 hover:text-base-content"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand shadow-glow" />
              )}
              <Icon className={`size-5 ${active ? "text-primary" : ""}`} />
              <span>{label}</span>
              {badges[to] > 0 && (
                <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-white shadow-glow-pink">
                  {badges[to] > 99 ? "99+" : badges[to]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Link
        to="/profile"
        title="Edit profile"
        className={`glass-panel m-4 flex items-center gap-3 rounded-2xl p-3 transition hover:border-primary/30 ${
          currentPath === "/profile" ? "border-primary/40" : ""
        }`}
      >
        <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="size-11" online />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{authUser?.fullName}</p>
          <p className="flex items-center gap-1.5 text-xs text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            Online
          </p>
        </div>
      </Link>
    </aside>
  );
};
export default Sidebar;
