import { useStorage } from "../Storage/StorageProvider";

export default function NoPermission() {
  const { Dark } = useStorage();
  return (
    <div
      className={`h-screen flex items-center justify-center ${
        Dark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
      <div className="text-center p-6 bg-red-100 dark:bg-red-200 rounded-lg shadow-md">
        <i className="bi bi-exclamation-triangle-fill text-4xl mb-4 text-red-600"></i>
        <p>You don't have permission to access this page.</p>
      </div>
    </div>
  );
}
