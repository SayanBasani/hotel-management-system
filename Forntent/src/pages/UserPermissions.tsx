import React, { useState } from "react";

type Permission = {
  id: number;
  name: string;
  description: string;
  allowed: boolean;
};

export default function UserPermissions() {
  // Example user
  const [selectedUser, setSelectedUser] = useState<string>("");

  // Example permission data (you’ll later fetch this from API)
  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 1, name: "View Users", description: "Can view the user list", allowed: true },
    { id: 2, name: "Add Users", description: "Can create new users", allowed: false },
    { id: 3, name: "Edit Users", description: "Can modify user data", allowed: false },
    { id: 4, name: "Delete Users", description: "Can remove users", allowed: false },
    { id: 5, name: "Manage Roles", description: "Can assign or update roles", allowed: false },
  ]);

  // Handle permission toggle
  const togglePermission = (id: number) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === id ? { ...perm, allowed: !perm.allowed } : perm
      )
    );
  };

  const handleSave = () => {
    console.log("Saving permissions for:", selectedUser, permissions);
    alert("Permissions updated successfully!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">User Permissions</h1>

      {/* Select User Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select User</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="">-- Choose a User --</option>
          <option value="1">John Doe</option>
          <option value="2">Jane Smith</option>
          <option value="3">Alex Johnson</option>
        </select>
      </div>

      {/* Permissions List */}
      <div className="space-y-4">
        {permissions.map((perm) => (
          <div
            key={perm.id}
            className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600"
          >
            <div>
              <p className="font-medium">{perm.name}</p>
              <p className="text-sm text-gray-500">{perm.description}</p>
            </div>
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={perm.allowed}
                  onChange={() => togglePermission(perm.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!selectedUser}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
}
