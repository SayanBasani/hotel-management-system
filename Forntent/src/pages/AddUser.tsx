"use client";

import { useForm } from "react-hook-form";
import { Singup_ } from "../Storage/Backend_Request";
import { useStorage } from "../Storage/StorageProvider";

type Inputs = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
};

export default function AddUser() {
  const { dark } = useStorage(); // ✅ get dark mode state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    try {
      const res = await Singup_(data);
      console.log("Account Create success:", res);
      alert("Account created successfully!");
      reset();
    } catch (err: any) {
      console.error("Account Create failed:", err);

      if (err?.email) {
        alert(`Email error: ${err.email[0]}`);
      } else if (err?.password) {
        alert(`Password error: ${err.password[0]}`);
      } else if (err?.error) {
        alert(err.error);
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  // ✅ Conditional classes based on dark
  const containerClasses = `w-full max-w-md mx-auto ${
    dark ? "text-gray-100" : "text-gray-900"
  }`;
  const cardClasses = `space-y-4 p-6 rounded-lg shadow ${
    dark ? "bg-gray-800" : "bg-white"
  }`;
  const inputClasses = `w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 ${
    dark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
  }`;
  const resetBtnClasses = `px-4 py-2 rounded-lg ${
    dark
      ? "bg-gray-600 hover:bg-gray-500 text-white"
      : "bg-gray-300 hover:bg-gray-400 text-black"
  }`;
  const submitBtnClasses = `px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white`;

  return (
    <div className={containerClasses}>
      <nav className="mb-6">
        <h2 className="text-xl font-semibold">Add New User</h2>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} className={cardClasses}>
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input
            {...register("first_name", { required: "First name is required" })}
            className={inputClasses}
            placeholder="Enter first name"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.first_name.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input
            {...register("last_name", { required: "Last name is required" })}
            className={inputClasses}
            placeholder="Enter last name"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.last_name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            className={inputClasses}
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            {...register("phone", {
              required: "Phone number is required",
              minLength: { value: 10, message: "Must be at least 10 digits" },
            })}
            className={inputClasses}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters required" },
            })}
            className={inputClasses}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => reset()} className={resetBtnClasses}>
            Reset
          </button>
          <button type="submit" className={submitBtnClasses}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
