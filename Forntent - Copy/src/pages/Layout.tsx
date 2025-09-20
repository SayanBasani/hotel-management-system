import { useEffect } from "react";
import TopNav from "../Component/SideNav";
import { useStorage } from "../Storage/StorageProvider";
import { Outlet } from "react-router";
import { getTokenExpiry, refreshAccessToken } from "../Storage/Backend_Request";

export default function Layout() {
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    async function scheduleRefresh() {
      const access = localStorage.getItem("access");
      if (!access) return;

      const expiry = getTokenExpiry(access);
      const timeout = expiry - Date.now() - 60_000; // refresh 1 min before expiry

      if (timeout <= 0) {
        // already expired → refresh now
        try {
          const newAccess = await refreshAccessToken();
          if (newAccess) scheduleRefresh(); // schedule again for new token
        } catch (err) {
          console.error("Auto-refresh failed", err);
        }
      } else {
        // schedule refresh
        timer = setTimeout(async () => {
          try {
            const newAccess = await refreshAccessToken();
            if (newAccess) scheduleRefresh(); // reschedule after refresh
          } catch (err) {
            console.error("Auto-refresh failed", err);
          }
        }, timeout);
      }
    }

    scheduleRefresh();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);
  const { Dark } = useStorage();
  return (
    <div
      className={`${
        Dark ? "bg-gray-800 text-white" : ""
      } layout flex h-screen`}>
      <div className="side-nav grid m-1">
        <TopNav />
      </div>
      <div className="main-content w-full h-full py-1 pr-1">
        <Outlet />
      </div>
    </div>
  );
}
