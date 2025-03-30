import { useEffect, useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";

interface Booking {
  id: number;
  user_id: number;
  therapist_id: number;
  session_date: string;
  booking_status: string;
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newBooking, setNewBooking] = useState({
    user_id: "",
    therapist_id: "",
    session_date: "",
    booking_status: "Booked",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch Bookings from Backend
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/bookings");
      const data = await response.json();

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings.");
      setBookings([]);
    }
    setLoading(false);
  };

  // Create a New Booking
  const handleCreate = async () => {
    try {
      await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newBooking,
          user_id: Number(newBooking.user_id),
          therapist_id: Number(newBooking.therapist_id),
        }),
      });

      setNewBooking({ user_id: "", therapist_id: "", session_date: "", booking_status: "Booked" });
      fetchBookings();
    } catch (err) {
      console.error("Error creating booking:", err);
    }
  };

  // Delete a Booking
  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/bookings/${id}`, { method: "DELETE" });
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>

      {/* Create Booking Form */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="user-id" className="text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            id="user-id"
            type="number"
            placeholder="Enter User ID"
            className="border p-2 w-full sm:w-auto"
            value={newBooking.user_id}
            onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
          />
        </div>

        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="therapist-id" className="text-sm font-medium text-gray-700 mb-1">
            Therapist ID
          </label>
          <input
            id="therapist-id"
            type="number"
            placeholder="Enter Therapist ID"
            className="border p-2 w-full sm:w-auto"
            value={newBooking.therapist_id}
            onChange={(e) => setNewBooking({ ...newBooking, therapist_id: e.target.value })}
          />
        </div>

        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="session-date" className="text-sm font-medium text-gray-700 mb-1">
            Session Date
          </label>
          <input
            id="session-date"
            type="date"
            className="border p-2 w-full sm:w-auto"
            value={newBooking.session_date}
            onChange={(e) => setNewBooking({ ...newBooking, session_date: e.target.value })}
          />
        </div>

        <div className="flex flex-col w-full sm:w-auto">
          <label htmlFor="booking-status" className="text-sm font-medium text-gray-700 mb-1">
            Booking Status
          </label>
          <select
            id="booking-status"
            className="border p-2 w-full sm:w-auto"
            value={newBooking.booking_status}
            onChange={(e) => setNewBooking({ ...newBooking, booking_status: e.target.value })}
          >
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 w-full sm:w-auto mt-6 sm:mt-0"
        >
          Add Booking
        </button>
      </div>

      {/* Error & Loading Handling */}
      {loading && <p className="text-center text-gray-500">Loading bookings...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Scrollable Table for Small Screens */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-green-600 text-white border-b border-gray-300">
              <th className="p-2 border-r">ID</th>
              <th className="p-2 border-r">User ID</th>
              <th className="p-2 border-r">Therapist ID</th>
              <th className="p-2 border-r">Session Date</th>
              <th className="p-2 border-r">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-300 text-center">
                  <td className="p-2 border-r">{booking.id}</td>
                  <td className="p-2 border-r">{booking.user_id}</td>
                  <td className="p-2 border-r">{booking.therapist_id}</td>
                  <td className="p-2 border-r">{booking.session_date}</td>
                  <td
                    className={`p-2 border-r ${
                      booking.booking_status === "Completed"
                        ? "text-green-600"
                        : booking.booking_status === "Canceled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {booking.booking_status}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="bg-red-600 text-white px-4 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 p-4">
                  No bookings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Bookings;
