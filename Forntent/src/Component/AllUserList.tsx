import React, { use, useEffect } from "react";
import { getAllUserList } from "../Storage/Backend_Request";
import { useStorage } from "../Storage/StorageProvider";
import { useNavigate } from "react-router"; // Make sure to use react-router-dom

export default function AllUserList({
  refBtn,
}: {
  refBtn: React.RefObject<HTMLButtonElement | null>;
}) {
  // const [users, setUsers] = React.useState<any>([]);
  const { Dark, users, setUsers } = useStorage();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const data = await getAllUserList();
      console.log("data is :-", data);
      setUsers({
        isPermission: true,
        data: data,
        error: "",
      });
    } catch (error) {
      setUsers({
        isPermission: false,
        data: [],
        error: "You don't have permission to access user list.",
      });
      // alert("Failed to load user permissions.");
      console.error("You don't have permission to access user list.");
      // console.error("Error fetching user list:", error);
    }
  };

  const handleReload = async () => {
    if (refBtn.current) {
      refBtn.current.classList.add("animate-spin");
      setTimeout(() => refBtn.current?.classList.remove("animate-spin"), 1000);
    }
    await fetchUsers();
  };

  useEffect(() => {
    const btn = refBtn.current;
    if (!btn) return;
    btn.addEventListener("click", handleReload);
    return () => btn.removeEventListener("click", handleReload);
  }, [refBtn]);

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    console.log("users :- ");
    console.log(users);
    console.log(users.isPermission);
  }, [users]);
  return (
    <>
      {
        users.data.map((user: any, index: number) => (
          <tr
            onClick={() => navigate(`/user-permissions/`, { state: { user } })}
            key={index}
            className={`border-b dark:border-gray-600 transition duration-200 cursor-pointer ${
              Dark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}>
            {/* Wrap only the cells except action buttons */}
            {/* <Link
            to={`/user/${user.email}`}
            className="contents" // allows Link to act like its children
          > */}
            <td className="p-2">{index + 1}</td>
            <td className="p-2">{user.first_name + " " + user.last_name}</td>
            <td className="p-2">{user.email}</td>
            {/* </Link> */}

            {/* Action buttons */}
            <td className="p-2 text-center flex justify-center gap-2">
              <button
                className="px-2 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation(); // prevent row link click
                  console.log("Edit", user);
                }}>
                <i className="bi bi-pencil"></i>
              </button>
              <button
                className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition duration-200"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation(); // prevent row link click
                  console.log("Delete", user);
                }}>
                <i className="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        ))}
    </>
  );
}
