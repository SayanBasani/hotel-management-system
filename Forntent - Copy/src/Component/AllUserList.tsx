import React, { useEffect } from "react";
import { getAllUserList } from "../Storage/Backend_Request";

export default function AllUserList({
  refBtn,
}: {
  refBtn: React.RefObject<HTMLButtonElement | null>;
}) {
  const [users, setUsers] = React.useState([]);
  
  const fetchUsers = async () => {
    const data = await getAllUserList();
    console.log("Fetched users:", data);
    setUsers(data);
  };
  const handleReload = async () => {
    console.log("Reload users...");
    if (refBtn.current) {
      // spin animation
      refBtn.current.classList.add("animate-spin");
      setTimeout(() => refBtn.current?.classList.remove("animate-spin"), 1000);
    }
    await fetchUsers();
  };

   useEffect(() => {
    const btn = refBtn.current;
    if (!btn) return;

    btn.addEventListener("click", handleReload);

    return () => {
      btn.removeEventListener("click", handleReload);
    };
  }, [refBtn]);

  // First load
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {users.map((user: any, index) => (
        <tr className="border-b dark:border-gray-600">
          <td className="p-2">{index + 1}</td>
          <td className="p-2">{user.first_name + " " + user.last_name}</td>
          <td className="p-2">{user.email}</td>
          <td className="p-2 text-center">
            <button
              className="px-2 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600 mr-2"
              title="Edit">
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              title="Delete">
              <i className="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
