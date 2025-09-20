import { useState } from "react";
import { useForm } from "react-hook-form";

type SearchInput = {
  query: string;
  email: string;
};

export default function SearchUser() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SearchInput>();
  const [results, setResults] = useState<string[]>([]);

  // Dummy data (replace with API later)
  const users = [
    "Sayan Basani",
    "Rohit Sharma",
    "Ankit Kumar",
    "Priya Singh",
    "Sneha Das",
    "Aman Gupta",
  ];

  const onSubmit = (data: SearchInput) => {
    const query = data.query.trim();
    if (!query) {
      setResults([]);
      return;
    }
    const filtered = users.filter((u) =>
      u.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    reset(); // clear input after search
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Search Box */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* <input
          type="text"
          placeholder="Search user..."
          {...register("query", { required: true })}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        /> */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Validation error */}
      {errors.query && (
        <p className="text-red-500 text-sm mb-2">Search field is required</p>
      )}

      {/* Results */}
      <div className="space-y-2">
        {results.length > 0 ? (
          results.map((user, idx) => (
            <div
              key={idx}
              className="p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
            >
              {user}
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No results found. Try searching a name.
          </p>
        )}
      </div>
    </div>
  );
}
