import { useEffect, useState } from "react";
import {
  getOwnPermissions,
  getOwnProfile,
  getUserPermissions,
} from "../Storage/Backend_Request";
import { useStorage } from "../Storage/StorageProvider";
import { Link } from "react-router";

export default function Profile() {
  const { Dark } = useStorage();
  const [profile, setProfile] = useState<any>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profileData = await getOwnProfile();
        setProfile(profileData?.user || profileData || null);
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    }

    async function fetchPermissions() {
      try {
        const permissionsData = await getOwnPermissions();
        console.log("permissions from API:", permissionsData);

        if (Array.isArray(permissionsData)) {
          setPermissions(permissionsData);
        } else if (typeof permissionsData === "string") {
          setPermissions([{ permissions: [permissionsData] }]);
        } else if (permissionsData) {
          setPermissions([permissionsData]);
        } else {
          setPermissions([]);
        }
      } catch (err) {
        console.error("Failed to load permissions:", err);
        setPermissions([]);
      } finally {
        setLoadingPermissions(false);
      }
    }

    fetchProfile();
    fetchPermissions();
  }, []);
  useEffect(() => {
    if (profile?.email) {
      (async () => {
        const oldpermissions = await getUserPermissions({
          email: profile.email,
        });
        console.log("Old permissions loaded:", oldpermissions);
      })();
    }
  }, [profile]);

  return (
    <div
      className={`h-full ${
        Dark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
      {/* Top Navbar */}
      <nav
        className={`flex items-center justify-between px-4 py-3 shadow ${
          Dark ? "bg-gray-800" : "bg-blue-600 text-white"
        }`}>
        <h1 className="text-lg font-semibold">My Profile</h1>
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-lg 
                     bg-white text-blue-600 hover:bg-gray-200 transition
                     dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600">
          <i className="bi bi-box-arrow-right text-xl"></i>
          <Link to="/login" className="hidden sm:inline">Logout</Link>
        </button>
      </nav>

      {/* Content Area */}
      <main className="p-4 grid gap-4">
        {/* Profile Details */}
        <div
          className={`rounded-xl shadow-lg p-4 ${
            Dark ? "bg-gray-800" : "bg-white"
          }`}>
          <h2 className="text-lg font-medium mb-4">Profile Details</h2>

          {loadingProfile ? (
            <p className="text-gray-500 dark:text-gray-400">
              Loading profile...
            </p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : profile ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Username:</span>{" "}
                {profile.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {profile.email}
              </div>
              <div>
                <span className="font-medium">ID:</span> {profile.id}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No profile data available.
            </p>
          )}
        </div>

        {/* Roles / Permissions Details */}
        <div
          className={`rounded-xl shadow-lg p-4 ${
            Dark ? "bg-gray-800" : "bg-white"
          }`}>
          <h2 className="text-lg font-medium mb-4">Roles Details</h2>

          {loadingPermissions ? (
            <p className="text-gray-500 dark:text-gray-400">
              Loading permissions...
            </p>
          ) : permissions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {permissions.map((perm: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {perm?.name ||
                      (perm?.permissions && perm.permissions[0]) ||
                      JSON.stringify(perm)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No permissions data available.
            </p>
          )}
        </div>

        {/* Permissions Details */}
        <div
          className={`rounded-xl shadow-lg p-4 ${
            Dark ? "bg-gray-800" : "bg-white"
          }`}>
          <h2 className="text-lg font-medium mb-4">Permissions Details</h2>

          {loadingPermissions ? (
            <p className="text-gray-500 dark:text-gray-400">
              Loading permissions...
            </p>
          ) : permissions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {permissions.map((perm: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {perm?.name ||
                      (perm?.permissions && perm.permissions[0]) ||
                      JSON.stringify(perm)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No permissions data available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
