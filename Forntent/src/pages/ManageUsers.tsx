import { useRef, useState } from "react";
import AllUserList from "../Component/AllUserList";
import { useStorage } from "../Storage/StorageProvider";
import AddUser from "./AddUser";
import SearchUser from "./SearchUser";

export default function ManageUsers() {
  const { Dark } = useStorage();
  const [showAddUser, setShowAddUser] = useState(false);
  const [showSearchUser, setSearchUser] = useState(false);
  const [popUp, setShowPopUp] = useState(false);
  const ReffBtn = useRef<HTMLButtonElement | null>(null);

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
        <h1 className="text-lg font-semibold">Manage Users</h1>
        <button
          onClick={() => {
            setShowAddUser(true);
            setShowPopUp(true);
          }}
          className="flex items-center gap-2 px-3 py-1 rounded-lg 
                     bg-white text-blue-600 hover:bg-gray-200 transition
                     dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600"
          title="Add User">
          <i className="bi bi-person-add text-xl"></i>
          <span className="hidden sm:inline">Add User</span>
        </button>
      </nav>

      {/* Content Area */}
      <main className="p-4">
        <div
          className={`rounded-xl shadow-lg p-4 ${
            Dark ? "bg-gray-800" : "bg-white"
          }`}>
          <h2 className="text-lg font-medium mb-4 flex justify-between">
            <span>User List</span>
            <div className="flex gap-5">
              <div className="flex gap-5">
                <div className="flex items-center w-full max-w-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm overflow-hidden">
                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Search user..."
                    className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />

                  {/* Button */}
                  <button
                    type="button"
                    title="Search"
                    className="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                    onClick={() => {
                      setSearchUser(true);
                      setShowPopUp(true);
                    }}>
                    <i className="bi bi-search text-lg"></i>
                  </button>
                </div>
              </div>

              <button type="button" title="Search" ref={ReffBtn}>
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </h2>

          {/* Example Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr
                  className={`text-left text-sm ${
                    Dark ? "bg-gray-700" : "bg-gray-200"
                  }`}>
                  <th className="p-2">#</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AllUserList refBtn={ReffBtn} />

                {/* Empty State */}
                <tr>
                  <td
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                    colSpan={4}>
                    No users yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Fullscreen Add User Popup */}
      {(showAddUser || popUp) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            className={`relative w-full max-w-2xl h-[90%] overflow-y-auto rounded-lg shadow-lg ${
              Dark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}>
            {/* Close button */}
            <button
              onClick={() => {
                setShowAddUser(false);
                setShowPopUp(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <i className="bi bi-x-lg text-xl"></i>
            </button>

            {/* Load AddNewUser Component */}
            <div className="p-6">
              {showAddUser ? <AddUser /> : ""}
              {showSearchUser ? <SearchUser /> : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
