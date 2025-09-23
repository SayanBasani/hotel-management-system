import { useState } from "react";
import { useForm } from "react-hook-form";
import { getSearchUsers } from "../Storage/Backend_Request";
import { useStorage } from "../Storage/StorageProvider";
import { useNavigate } from "react-router";

type SearchInput = {
  query: string;
};

export default function SearchUser() {
  const { Dark } = useStorage();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchInput>();
  const [results, setResults] = useState<any[]>([]);

  const onSubmit = async (data: SearchInput) => {
    const query = data.query.trim();
    if (!query) {
      setResults([]);
      return;
    }
    const response = await getSearchUsers({ query });
    setResults(response || []);
    reset();
  };

  return (
    <div
      className={`p-6 max-w-lg mx-auto rounded-lg shadow-md ${
        Dark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex items-center gap-3 rounded-lg shadow-sm border px-3 py-2 ${
          Dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}>
        <input
          type="text"
          {...register("query", { required: "Search query is required" })}
          className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            Dark
              ? "bg-gray-800 text-white placeholder-gray-400"
              : "bg-white text-gray-900 placeholder-gray-500"
          }`}
          placeholder="Enter name, email or phone..."
        />
        <button
          type="submit"
          className={`px-5 py-2 rounded-md font-medium transition ${
            Dark
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}>
          Search
        </button>
      </form>

      {errors.query && (
        <p className="text-red-500 text-sm mt-2">{errors.query.message}</p>
      )}

      <div className="mt-5 space-y-2">
        {results.length > 0 ? (
          results.map((user, idx) => (
            <div
              key={idx}
              onClick={() => {
                console.log(user);
                navigate("/user-permissions", { state: { user } });
              }}
              className={`p-3 rounded-md shadow-sm cursor-pointer transition transform duration-200 ${
                Dark
                  ? "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 hover:scale-[1.02]"
                  : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 hover:scale-[1.02]"
              }`}>
              <p className="font-medium">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm opacity-80">{user.email}</p>
            </div>
          ))
        ) : (
          <p
            className={`mt-4 text-center italic ${
              Dark ? "text-gray-400" : "text-gray-500"
            }`}>
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
