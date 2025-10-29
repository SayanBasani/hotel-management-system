import { useEffect } from "react";
import TopNav from "../Component/SideNav";
import { useStorage } from "../Storage/StorageProvider";
import { Outlet, useNavigate } from "react-router";
import { getOwnProfile, getTokenExpiry, refreshAccessToken } from "../Storage/Backend_Request";

export default function Layout() {
  const navigate = useNavigate();
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    async function scheduleRefresh() {
      const access = localStorage.getItem("access");
      // console.log("access : " + access);
      console.log("----------------")
      try {
        const resp = await getOwnProfile();
        console.log(resp)
        console.log("----------------!")
        // console.log("resp code :- "+resp.code)
        console.log("resp :- "+resp)
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      }


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
