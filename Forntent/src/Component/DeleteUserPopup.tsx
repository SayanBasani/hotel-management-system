import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DeleteUser } from "../Storage/Backend_Request";

export default function DeleteUserPopup({
  user,
  isOpen,
  onClose,
  onDeleted,
}: {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (email: string) => void; // callback to update UI after deletion
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    setLoading(true);
    console.log("email to delete:", user.email);
    try {
      const res = await DeleteUser({ email: user.email });
      swal({
        title: "User Deleted",
        text: res.message || "User deleted successfully!",
        icon: "success",
      });
      onDeleted(user.email); // update parent UI
      onClose();
    } catch (err) {
      swal({
        title: "Error",
        text: "Failed to delete user.",
        icon: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Box */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Delete User
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete user{" "}
              <span className="font-bold">{user?.email}</span>?
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
