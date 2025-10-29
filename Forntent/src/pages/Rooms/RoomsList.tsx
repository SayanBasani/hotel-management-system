import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { FilterRooms } from "../../Storage/Backend_Request";
import { useStorage } from "../../Storage/StorageProvider";
import NoPermission from "../../Component/NoPermission";
import RoomBooking from "./RoomBooking";
import AddRoom from "./AddRoom";

export default function RoomList() {
  const { Dark } = useStorage();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isPermission, setIsPermission] = useState(false);

  const [filters, setFilters] = useState({
    room_number: "",
    bed: "",
    ac: "",
    bathroom: "",
    room_capacity: "",
    price_min: "",
    price_max: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRooms = async (f = filters) => {
    try {
      setLoading(true);
      const data = await FilterRooms(f);
      setRooms(data);
      setLoading(false);
      setIsPermission(true);
    } catch (error) {
      setIsPermission(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const applyFilters = () => {
    fetchRooms(filters);
  };

  const clearFilters = () => {
    const cleared = {
      room_number: "",
      bed: "",
      ac: "",
      bathroom: "",
      room_capacity: "",
      price_min: "",
      price_max: "",
    };
    setFilters(cleared);
    fetchRooms();
  };
  const [popUp, setShowPopUp] = useState(false);
  const [BookRoomForUser, setBookRoomForUser] = useState<any>(false);
  const [addRoom, setAddRoom] = useState(false);
  return (
    <>
      {isPermission === false && <NoPermission />}
      {isPermission === true && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`custom-scrollbar h-full w-full p-4 md:p-8 rounded-2xl shadow-2xl overflow-y-auto slim-scroll ${
            Dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold mb-3 md:mb-0">🏨 Room</h1>
            <span className="flex items-center gap-3">
              <button
                onClick={() => (setAddRoom(true), setShowPopUp(true))}
                // onClick={() => (setAddRoom(!addRoom), setShowPopUp(!popUp))}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                <i className="bi bi-house-add text-xl"></i>
                <span className={`max-md:hidden`}>Add Room</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                <Filter size={18} />
                <span className="max-md:hidden">
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </span>
              </button>
            </span>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <div
              className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 p-4 rounded-xl ${
                Dark ? "bg-gray-800" : "bg-gray-100"
              }`}>
              <input
                type="text"
                placeholder="Room Number"
                value={filters.room_number}
                onChange={(e) =>
                  handleFilterChange("room_number", e.target.value)
                }
                className="p-2 rounded-lg border"
              />
              <input
                type="text"
                placeholder="Bed Type"
                value={filters.bed}
                onChange={(e) => handleFilterChange("bed", e.target.value)}
                className="p-2 rounded-lg border"
              />
              <select
                value={filters.ac}
                onChange={(e) => handleFilterChange("ac", e.target.value)}
                className="p-2 rounded-lg border">
                <option value="">AC / Non-AC</option>
                <option value="True">AC</option>
                <option value="False">Non-AC</option>
              </select>
              <input
                type="text"
                placeholder="Bathroom Type"
                value={filters.bathroom}
                onChange={(e) => handleFilterChange("bathroom", e.target.value)}
                className="p-2 rounded-lg border"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={filters.room_capacity}
                onChange={(e) =>
                  handleFilterChange("room_capacity", e.target.value)
                }
                className="p-2 rounded-lg border"
              />
              <input
                type="number"
                placeholder="Min Price"
                value={filters.price_min}
                onChange={(e) =>
                  handleFilterChange("price_min", e.target.value)
                }
                className="p-2 rounded-lg border"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.price_max}
                onChange={(e) =>
                  handleFilterChange("price_max", e.target.value)
                }
                className="p-2 rounded-lg border"
              />
              <div className="flex items-center justify-end md:col-span-3 lg:col-span-4 gap-3">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <X size={18} /> Clear
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-400 mt-10">Loading rooms...</p>
          )}

          {/* Room Cards */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <motion.div
                  key={room.room_number}
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-xl p-4 shadow-md border cursor-pointer ${
                    Dark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => {
                    setShowPopUp(true);
                    setBookRoomForUser(room);
                  }}>
                  <h2 className="text-lg font-semibold mb-2">
                    {room.room_number}
                  </h2>
                  <p>🛏️ Bed: {room.features.bed}</p>
                  <p>❄️ AC: {room.features.ac ? "Yes" : "No"}</p>
                  <p>🛁 Bathroom: {room.features.bathroom.type}</p>
                  <p>👥 Capacity: {room.room_capacity}</p>
                  <p>💰 ₹{room.price_per_night}/night</p>
                  <p>📍 {room.location}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && rooms.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No rooms match your filters.
            </p>
          )}

          {/* Fullscreen Add User Popup */}
          {popUp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div
                className={`relative w-full max-w-2xl h-[90%] overflow-y-auto rounded-lg shadow-lg ${
                  Dark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}>
                {/* Close button */}
                <button
                  onClick={() => {
                    setBookRoomForUser(false);
                    setShowPopUp(false);
                    setAddRoom(false);
                  }}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
                  <i className="bi bi-x-lg text-xl"></i>
                </button>

                {/* Load AddNewUser Component */}
                <div className="p-6">
                  {BookRoomForUser ? (
                    <RoomBooking
                      data={BookRoomForUser}
                      // setShowPopup={setShowPopUp}
                      // setShowAddUser={setShowAddUser}
                    />
                  ) : (
                    ""
                  )}
                  {addRoom ? <AddRoom /> : <></>}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
