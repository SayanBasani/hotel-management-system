import { Link, useNavigate } from "react-router";
import DarkToggle from "../../Component/DarkToggleBtn";
import { useStorage } from "../../Storage/StorageProvider";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Login_ } from "../../Storage/Backend_Request";

type Inputs = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login() {
  const { Dark } = useStorage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // console.log("Login Data:", data);
    try {
      const res = await Login_(data);
      // console.log("Login success:", res);
      alert("Login successful!");
      navigate("/home");
      // navigate("/home", { replace: true });

      // maybe redirect to dashboard or show success message
    } catch (err: any) {
      console.log("Login failed:", err);

      // Example: If backend sends field-specific errors
      // { email: ["This email is already taken"] }
      if (err.email) {
        alert(`Email error: ${err.email[0]}`);
      } else if (err.password) {
        alert(`Password error: ${err.password[0]}`);
      } else if (err.error) {
        alert(err.error); // custom error (like network issue)
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div
      className={`${
        Dark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } w-screen h-screen flex justify-center items-center relative`}>
      {/* Dark Toggle */}
      <div className="absolute bottom-5 left-5 bg-gray-500 p-2 rounded-md">
        <DarkToggle />
      </div>

      {/* Card */}
      <div
        className={`${
          Dark ? "bg-gray-800" : "bg-white"
        } shadow-xl rounded-2xl p-8 w-[90%] max-w-md`}>
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                Dark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none ${
                Dark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-end text-sm">
            {/* <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4"
              />
              <span>Remember me</span>
            </label> */}
            <Link
              to="#"
              className="text-blue-500 hover:underline text-sm font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition ${
              Dark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}>
            Login
          </button>

          {/* Divider */}
          <div className="hidden flex items-center justify-center my-4">
            <span className="border-t w-1/4"></span>
            <span className="px-2 text-sm text-gray-500">or</span>
            <span className="border-t w-1/4"></span>
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3 hidden">
            <button
              type="button"
              className={`w-1/2 py-2 rounded-md font-medium border flex justify-center items-center gap-2 ${
                Dark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}>
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button
              type="button"
              className={`w-1/2 py-2 rounded-md font-medium border flex justify-center items-center gap-2 ${
                Dark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}>
              <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
              GitHub
            </button>
          </div>
        </form>

        {/* Signup link */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
