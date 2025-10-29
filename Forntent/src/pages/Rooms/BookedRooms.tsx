import { BookedRoomList } from "@/Storage/Backend_Request";
import { useEffect, useState } from "react";

export default function BookedRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Date filter states
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");

  const fetchBookedRooms = async (start:string, end:string) => {
    try {
      setLoading(true);
      const res = await BookedRoomList({ start_date: start, end_date: end });
      const data = res.data || [];
      setRooms(data);
      setFilteredRooms(data);
    } catch (error) {
      console.error("Error fetching booked rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookedRooms(startDate, endDate);
  }, []);

  // 🔹 Filter rooms by date range
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredRooms(rooms);
      return;
    }

    // const filtered = rooms.filter((room) => {
    //   const checkIn = new Date(room.check_in_date);
    //   const checkOut = new Date(room.check_out_date);

    //   const start = startDate ? new Date(startDate) : null;
    //   const end = endDate ? new Date(endDate) : null;

    //   // Conditions:
    //   //  - If both start and end: booking overlaps the range
    //   //  - If only start: booking starts after start date
    //   //  - If only end: booking ends before end date
    //   if (start && end) {
    //     return checkIn <= end && checkOut >= start;
    //   } else if (start) {
    //     return checkOut >= start;
    //   } else if (end) {
    //     return checkIn <= end;
    //   }
    //   return true;
    // });

    // setFilteredRooms(filtered);
    fetchBookedRooms(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <div className="p-6 bg-gray-900 text-white page-hight-adjustCss">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">🏨 Booked Rooms</h1>
        <div className="flex items-center gap-3">
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-800 text-white rounded-md px-3 py-1 border border-gray-700"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-800 text-white rounded-md px-3 py-1 border border-gray-700"
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setFilteredRooms(rooms);
            }}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-sm">
            Clear
          </button>
          <button
            onClick={() => fetchBookedRooms({ startDate, endDate }.startDate, { startDate, endDate }.endDate)}
            className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-all">
            Refresh
          </button>
        </div>
      </div>

      {/* Loading / Empty / Grid */}
      {loading ? (
        <p className="text-gray-400">Loading booked rooms...</p>
      ) : filteredRooms.length === 0 ? (
        <p className="text-gray-400">
          No booked rooms found for the selected date.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-700 hover:shadow-amber-500/30 transition-all">
              <h2 className="text-lg font-bold text-amber-400 mb-2">
                Room #{room.room}
              </h2>
              <p>
                <span className="font-semibold">Booked By:</span>{" "}
                {room.user_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {room.user_email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {room.user_phone}
              </p>
              <p>
                <span className="font-semibold">Guests:</span>{" "}
                {room.number_of_guests}
              </p>
              <p>
                <span className="font-semibold">Check-in:</span>{" "}
                {room.check_in_date}
              </p>
              <p>
                <span className="font-semibold">Check-out:</span>{" "}
                {room.check_out_date}
              </p>
              <p>
                <span className="font-semibold">ID Proof:</span>{" "}
                {room.id_proof_type} - {room.id_proof_number}
              </p>
              {room.special_requests && (
                <p>
                  <span className="font-semibold">Special Requests:</span>{" "}
                  {room.special_requests}
                </p>
              )}
              <p className="mt-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-sm ${
                    room.status === "booked" ? "bg-green-700" : "bg-gray-600"
                  }`}>
                  {room.status}
                </span>
              </p>

              {room.additional_guests && room.additional_guests.length > 0 && (
                <div className="mt-3 border-t border-gray-700 pt-2">
                  <p className="font-semibold text-amber-400 mb-1">
                    Additional Guests:
                  </p>
                  {room.additional_guests.map((guest: any, i: number) => (
                    <div
                      key={i}
                      className="ml-2 text-sm text-gray-300 flex flex-col gap-1">
                      <p>👤 {guest.name}</p>
                      <p>🎂 Age: {guest.age}</p>
                      <p>🤝 Relation: {guest.relation}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">
                Created: {new Date(room.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
