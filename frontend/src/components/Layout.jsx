import { useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Layout = ({ children, showSidebar = false }) => {
  const { pathname } = useLocation();
  const inConversation = pathname.startsWith("/chat/");
  const isChatRoute = inConversation || pathname === "/chats";

  // chat pages size themselves to the screen; the mobile tab bar hides inside a conversation
  const showMobileNav = showSidebar && !inConversation;
  const padForMobileNav = showMobileNav && !isChatRoute;

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar showSidebar={showSidebar} />

        <main className={`flex-1 ${padForMobileNav ? "pb-24 lg:pb-0" : ""}`}>{children}</main>

        {showMobileNav && <MobileNav />}
      </div>
    </div>
  );
};
export default Layout;
