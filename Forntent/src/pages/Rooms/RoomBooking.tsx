import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { RoomBookingCreate, type BookingData } from "@/Storage/Backend_Request";

// export type BookingData = {
//   room: string;
//   user_name: string;
//   user_email: string;
//   user_phone: string;
//   number_of_guests: number;
//   check_in_date: string;
//   check_out_date: string;
//   special_requests?: string;
//   id_proof_type?: string;
//   id_proof_number?: string;
//   additional_guests?: {
//     name: string;
//     age: number;
//     relation: string;
//   }[];
// };

export default function RoomBooking({ data }: { data: any }) {
  const { register, handleSubmit, control, reset } = useForm<BookingData>({
    defaultValues: {
      room_number: data?.room_number || "",
      additional_guests: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additional_guests",
  });

  const onSubmit = (formData: BookingData) => {
    try {
      // formData.room_number = data.room_number;
      console.log("Booking Data:", formData);
      RoomBookingCreate(formData);
      alert(`Booking confirmed for Room ${formData.room_number}`);
      reset();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-900 dark:text-gray-200 overflow-hidden"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        🏨 Book Room {data.room_number}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      >
        {/* Guest Info Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">
            👤 Guest Information
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              {...register("user_name", { required: true })}
              placeholder="Full Name"
              className="input"
            />
            <input
              type="email"
              {...register("user_email", { required: true })}
              placeholder="Email Address"
              className="input"
            />
            <input
              type="tel"
              {...register("user_phone", { required: true })}
              placeholder="Phone Number"
              className="input"
            />
            <input
              type="number"
              {...register("number_of_guests", { required: true })}
              placeholder="Number of Guests"
              className="input"
            />
          </div>
        </div>

        {/* Stay Details Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">
            🗓️ Stay Details
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="block">
              Check-in Date
              <input
                type="date"
                {...register("check_in_date", { required: true })}
                className="input mt-1"
              />
            </label>
            <label className="block">
              Check-out Date
              <input
                type="date"
                {...register("check_out_date", { required: true })}
                className="input mt-1"
              />
            </label>
          </div>
        </div>

        {/* ID Proof Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">
            🪪 ID Proof
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <select {...register("id_proof_type")} className="input">
              <option value="">Select ID Type</option>
              <option value="Aadhar">Aadhar</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
            </select>
            <input
              type="text"
              {...register("id_proof_number")}
              placeholder="ID Proof Number"
              className="input"
            />
          </div>
        </div>

        {/* Additional Guests */}
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1 flex justify-between items-center">
            👥 Additional Guests
            <button
              type="button"
              onClick={() => append({ name: "", age: 0, relation: "" })}
              className="px-2 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              + Add Guest
            </button>
          </h3>
          {fields.length === 0 && (
            <p className="text-sm text-gray-400">No additional guests added.</p>
          )}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid md:grid-cols-3 gap-2 items-center mb-2"
            >
              <input
                type="text"
                placeholder="Name"
                {...register(`additional_guests.${index}.name`)}
                className="input"
              />
              <input
                type="number"
                placeholder="Age"
                {...register(`additional_guests.${index}.age`)}
                className="input"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Relation"
                  {...register(`additional_guests.${index}.relation`)}
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Special Requests */}
        <div>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">
            📝 Special Requests
          </h3>
          <textarea
            {...register("special_requests")}
            placeholder="Any additional requests or preferences?"
            rows={3}
            className="input resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200"
        >
          Confirm Booking
        </motion.button>
      </form>
    </motion.div>
  );
}

/* 🧩 Tailwind helper class (add in your global.css)
--------------------------------------------------- */
