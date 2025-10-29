// src/pages/UserPermissions.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useStorage } from "../Storage/StorageProvider";
import { assignPermissions, assignRoleToUser, getAllPermissions, getAllRoles, getUserPermissions, getUserRole, } from "../Storage/Backend_Request";
import { FaUser, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import swal from "sweetalert";

type Permission = {
  id: number;
  name: string;
  description?: string;
  codename: string; // make codename required
};

type User = {
  id?: number | string;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatarUrl?: string | null;
  groups?: number[]; // assigned permission IDs
};

type RoleResponse = {
  roles?: string;
};

export default function UserPermissions() {
  const { Dark, permissionList, setPermissionList ,allRoles, setAllRoles } = useStorage();
  const location = useLocation();

  // ✅ user always comes from SearchUser
  const user: User | null = (location.state as any)?.user ?? null;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allPermissions, setAllPermissions] = useState<Permission[]>(
    permissionList ?? []
  );
  const [userRole, setUserRole] = useState<RoleResponse[]>([]);

  const [assignedIds, setAssignedIds] = useState<number[]>(user?.groups ?? []);
  const [filter, setFilter] = useState("");

  const [selectedRole, setSelectedRole] = useState<string>("");

  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  // --- Load all user old permissions ---
  useEffect(() => {
    (async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const oldpermissions = await getUserPermissions({
          email: user.email,
        });
        if (oldpermissions?.user_permissions) {
          setAssignedIds(oldpermissions.user_permissions.map((p: any) => p.id));
        }

        const oldRole = await getUserRole({ email: user.email });
        setUserRole(oldRole?.roles || "No role assigned");
      } catch (err) {
        console.error("Failed to load permissions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.email]);

  // --- Load all permissions and roles ---
  useEffect(() => {
    (async () => {
      try {
        if (!permissionList || permissionList.length === 0) {
          setLoading(true);
          const perms = await getAllPermissions();
          setAllPermissions(perms || []);
          setPermissionList && setPermissionList(perms || []);
          const roles = await getAllRoles();
          setAllRoles(roles || []);
        } else {
          setAllPermissions(permissionList);
        }
      } catch (err) {
        console.error("Failed to load permissions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- Handlers ---
  const togglePermission = (id: number) =>
    setAssignedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const removeAssigned = (id: number) =>
    setAssignedIds((prev) => prev.filter((x) => x !== id));

  const handleSave = async () => {
    if (!user) {
      swal("Error", "Please select a user first.", "error");
      return;
    }
    setSaving(true);
    try {
      const data = await assignPermissions(
        user.email,
        assignedIds.map(
          (id) => allPermissions.find((p) => p.id === id)?.codename || ""
        )
      );
      const AssigneRoleResponse = await assignRoleToUser({
        email: user.email,
        role: selectedRole,
      });
      setTimeout(() => {
        swal(
          "Success",
          AssigneRoleResponse.message ||
            "Permissions and Role updated successfully!",
          "success"
        );
        setTimeout(() => {
          swal(
            "Success",
            data.message || "Permissions and Role updated successfully!",
            "success"
          );
        }, 1000);
      }, 200);
      await loadUserData();
    } catch (err) {
      console.error("Error assigning permissions:", err);
      swal("Error", "Failed to save permissions.", "error");
    } finally {
      setSaving(false);
    }
  };

  const visiblePermissions = allPermissions.filter((p) =>
    `${p.name} ${p.description ?? ""}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );
  const loadUserData = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const oldpermissions = await getUserPermissions({ email: user.email });
      if (oldpermissions?.user_permissions) {
        setAssignedIds(oldpermissions.user_permissions.map((p: any) => p.id));
      }

      const oldRole = await getUserRole({ email: user.email });
      setUserRole(oldRole?.roles || "No role assigned");
    } catch (err) {
      console.error("Failed to load permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- useEffect to run initially ---
  useEffect(() => {
    loadUserData();
  }, [user?.email]);

  return (
    <div
      className={`page-hight-adjustCss p-4 max-w-6xl mx-auto space-y-6 ${
        Dark ? "text-white" : "text-gray-900"
      }`}
      // style={{ maxHeight: "15vh" }}
      >
      {/* Header */}
      <nav
        className={`flex items-center justify-between gap-4 p-4 rounded-xl shadow ${
          Dark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}>
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden bg-blue-50 text-blue-700">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="w-8 h-8" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold truncate">
              {user
                ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                : "No user selected"}
            </p>
            <p className="text-sm truncate opacity-80">
              {user ? user.email : "Select a user"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-center">
            <div className="text-xs opacity-80">Assigned</div>
            <div className="text-lg font-semibold">{assignedIds.length}</div>
          </div>
          <button
            onClick={handleSave}
            disabled={!user || saving}
            className={`px-4 py-2 rounded-sm font-medium shadow ${
              !user || saving
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      {/* <div className="grid gap-6"> */}
      <div
        className={`grid gap-6 overflow-y-auto custom-scrollbar`}
        style={{ maxHeight: "85vh" }} // adjust height as you like
      >
        {/* Left: Roles */}
        <div
          className={`gap-3 grid p-4 rounded-lg shadow h-fit ${
            Dark
              ? "bg-gray-900 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
          // style={{ maxHeight: "70vh" }}
        >
          <h2 className="text-lg font-semibold flex gap-2">
            <span>Current Role :- </span>
            <div className="flex gap-1">
              {userRole && userRole.length > 0
                ? userRole.join(", ")
                : "No role assigned"}
            </div>
          </h2>
          <div className="flex items-center justify-start gap-3 mb-4">
            <h2 className="text-lg font-semibold">All Roles</h2>
            <select
              name="roles"
              id="roles"
              value={selectedRole}
              onChange={handleRoleChange}
              className={`px-3 py-2 rounded-md text-sm outline-none ${
                Dark
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "bg-gray-100 text-gray-900 border border-transparent"
              }`}>
              <option value="">No role to assign</option>
              {/* Map through available roles and create an option for each */}
              {allRoles.map((role: any, index: number) => (
                <option key={index} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Permissions */}
          <div
            className={`h-fit col-span-2 p-4 rounded-lg shadow ${
              Dark
                ? "bg-gray-900 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
            // style={{ maxHeight: "70vh" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Permissions</h2>
              <input
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 rounded-md w-64 text-sm outline-none ${
                  Dark
                    ? "bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
                    : "bg-gray-100 text-gray-900 placeholder-gray-500 border border-transparent"
                }`}
              />
            </div>

            {loading ? (
              <div className="py-8 text-center">Loading permissions...</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {visiblePermissions.map((perm) => {
                  const isAssigned = assignedIds.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      onClick={() => togglePermission(perm.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" ? togglePermission(perm.id) : null
                      }
                      className={`max-md:p-2 p-3 rounded-md cursor-pointer select-none transition-shadow border flex items-start justify-between gap-3 ${
                        isAssigned
                          ? Dark
                            ? "bg-gray-800 border-blue-400 shadow-md"
                            : "bg-blue-50 border-blue-300 shadow-sm"
                          : Dark
                          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                          : "bg-white border-gray-200 hover:shadow-sm"
                      }`}>
                      <div>
                        <div className="font-medium truncate">{perm.name}</div>
                        {perm.description && (
                          <div className="text-xs opacity-80 mt-1 truncate">
                            {perm.description}
                          </div>
                        )}
                      </div>
                      <div>
                        {isAssigned ? (
                          <FaCheck className="text-green-500 w-5 h-5" />
                        ) : (
                          <FaTimes className="text-gray-400 w-5 h-5" />
                        )}
                      </div>
                    </div>
                  );
                })}
                {visiblePermissions.length === 0 && (
                  <div className="col-span-full py-6 text-center text-sm opacity-70">
                    No permissions match "{filter}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Assigned */}
          <aside
            className={`p-4 rounded-lg shadow overflow-y-auto ${
              Dark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
            style={{ maxHeight: "70vh" }}>
            <h3 className="text-md font-semibold mb-3">Assigned permissions</h3>
            {assignedIds.length === 0 ? (
              <p className="text-sm opacity-70">No permissions assigned yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {assignedIds.map((id) => {
                  const p = allPermissions.find((x) => x.id === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-2 bg-transparent rounded px-2 py-1 border">
                      <div className="text-sm truncate">
                        {p ? p.name : `Permission #${id}`}
                      </div>
                      <button
                        onClick={() => removeAssigned(id)}
                        className="p-1 rounded bg-red-100 hover:bg-red-200 text-red-700">
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 border-t pt-4 text-sm opacity-80 flex flex-col gap-2">
              <div>Quick actions</div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setAssignedIds(allPermissions.map((p) => p.id))
                  }
                  className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 flex items-center gap-1">
                  <FaCheck /> Assign all
                </button>
                <button
                  onClick={() => setAssignedIds([])}
                  className="px-3 py-1 rounded bg-gray-300 text-sm hover:bg-gray-400 flex items-center gap-1">
                  <FaTimes /> Clear all
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
