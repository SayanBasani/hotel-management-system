import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useStorage } from "../../Storage/StorageProvider";
import { AddNewRoom } from "../../Storage/Backend_Request";
import type { RoomData } from "../../Storage/Backend_Request";
import NoPermission from "../../Component/NoPermission";

export default function AddRoom() {
  const { Dark } = useStorage();
  const { register, handleSubmit, reset } = useForm<RoomData>();
  const [loading, setLoading] = useState(false);
  const [isPermission, setIsPermission] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await AddNewRoom({});
        console.log("add user is permited :- ", resp);
        console.log("status :- ", resp.status);
        setIsPermission(true);
      } catch (error) {
        console.error("Error adding user:", error);
        setIsPermission(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: RoomData) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Convert amenities from comma-separated to array
    const amenitiesInput = data.features?.bathroom
      ?.amenities as unknown as string;
    data.features.bathroom.amenities = amenitiesInput
      ? amenitiesInput.split(",").map((a) => a.trim())
      : [];

    try {
      const result = await AddNewRoom(data);
      swal("Success", "Room added successfully!", "success");
      setMessage({ text: "✅ Room added successfully!", type: "success" });
      reset();
    } catch (err) {
      console.error(err);
      swal("Error", "Failed to add room. Try again!", "error");
      setMessage({ text: "❌ Failed to add room. Try again!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isPermission === false && <NoPermission />}
      {isPermission === true && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`h-full flex justify-center items-start py-8 px-3 sm:px-6 md:px-10 ${
            Dark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-800"
          }`}>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`custom-scrollbar h-full w-full max-w-5xl rounded-2xl shadow-2xl overflow-y-auto ${
              Dark ? "bg-gray-900" : "bg-white"
            }`}>
            {/* Header */}
            <div
              className={`p-6 sm:p-8 text-center ${
                Dark
                  ? "bg-gradient-to-r from-indigo-800 to-purple-700"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500"
              }`}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide">
                🏨 Add New Room
              </h1>
              <p className="text-indigo-100 mt-2 text-sm sm:text-base">
                Enter all details below to register a new room in the system.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-5 sm:p-8 space-y-8">
              {/* Room Details */}
              <Section title="Room Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Room Number"
                    {...register("room_number")}
                    required
                  />
                  <Input
                    label="Room Capacity"
                    type="number"
                    {...register("room_capacity")}
                    required
                  />
                  <Input
                    label="Floor"
                    type="number"
                    {...register("floor")}
                    required
                  />
                  <Input
                    label="Price per Night"
                    type="number"
                    {...register("price_per_night")}
                    required
                  />
                  <Input label="Location" {...register("location")} required />
                  <Select
                    label="Status"
                    {...register("status")}
                    options={{ 1: "Available", 0: "Unavailable" }}
                  />
                </div>
              </Section>

              {/* Features */}
              <Section title="Room Features">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Bed Type"
                    placeholder="e.g., Queen / King"
                    {...register("features.bed")}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <Toggle label="AC" {...register("features.ac")} />
                  <Toggle label="TV" {...register("features.tv")} />
                  <Toggle label="Wi-Fi" {...register("features.wifi")} />
                  <Toggle label="Balcony" {...register("features.balcony")} />
                </div>
              </Section>

              {/* Bathroom */}
              <Section title="Bathroom Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Bathroom Type"
                    placeholder="e.g., Attached / Shared"
                    {...register("features.bathroom.type")}
                  />
                  <Input
                    label="Amenities"
                    placeholder="Comma separated (e.g., Shower, Towels, Hairdryer)"
                    {...register("features.bathroom.amenities")}
                  />
                </div>
              </Section>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto px-8 py-3 font-semibold text-white rounded-xl transition-all shadow-md ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
                  }`}>
                  {loading ? "Adding Room..." : "Add Room"}
                </motion.button>
              </div>

              {/* Feedback */}
              {message.text && (
                <p
                  className={`text-center font-medium text-sm sm:text-base ${
                    message.type === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                  {message.text}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/* ---------- Reusable UI Components ---------- */

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <input
        ref={ref}
        {...props}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
      />
    </div>
  )
);
Input.displayName = "Input";

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <select
        {...props}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base">
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}

const Toggle = React.forwardRef<
  HTMLInputElement,
  { label: string } & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, ...props }, ref) => (
  <label className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-gray-600">
    <span className="text-sm sm:text-base">{label}</span>
    <input
      ref={ref}
      type="checkbox"
      {...props}
      className="accent-indigo-600 h-4 w-4 sm:h-5 sm:w-5"
    />
  </label>
));
Toggle.displayName = "Toggle";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
    <h2 className="text-lg sm:text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
      {title}
    </h2>
    {children}
  </div>
);
