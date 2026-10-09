import { Link, useLocation } from "react-router";
import useIncomingRequestCount from "../hooks/useIncomingRequestCount";
import { useStream } from "../context/streamContext";
import { NAV_ITEMS } from "./Sidebar";

// Bottom tab bar shown below the lg breakpoint, where the sidebar is hidden
const MobileNav = () => {
  const currentPath = useLocation().pathname;
  const requestCount = useIncomingRequestCount();
  const { unreadCount } = useStream();
  const badges = { "/chats": unreadCount, "/notifications": requestCount };

  return (
    <nav className="glass-panel fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl px-2 py-2 shadow-2xl lg:hidden">
      {NAV_ITEMS.map(({ to, label, icon }) => {
        const Icon = icon;
        const active = to === "/chats" ? currentPath.startsWith("/chat") : currentPath === to;
        return (
          <Link
            key={to}
            to={to}
            className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors ${
              active ? "bg-primary/15 text-white" : "text-base-content/50"
            }`}
          >
            <Icon className={`size-5 ${active ? "text-primary" : ""}`} />
            {label}
            {badges[to] > 0 && (
              <span className="absolute right-[30%] top-1 size-2 rounded-full bg-secondary shadow-glow-pink" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
export default MobileNav;
