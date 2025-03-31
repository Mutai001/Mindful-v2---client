import { useEffect, useState } from "react";

interface Patient {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
}

interface Slot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface Appointment {
  id: number;
  user_id: number;
  therapist_id: number;
  slot_id: number;
  booking_status: string;
  created_at: string;
  updated_at: string;
  patient: Patient;
  slot: Slot;
}

interface ApiResponse {
  success: boolean;
  data: Appointment[];
}

interface AppointmentsProps {
  therapistId: number;
}

const Appointments = ({ therapistId }: AppointmentsProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/bookings?therapistId=${therapistId}`
        );

        if (!response.ok) throw new Error("Failed to fetch appointments");

        const result: ApiResponse = await response.json();
        
        if (!result.success) throw new Error("API returned unsuccessful status");

        setAppointments(result.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [therapistId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/bookings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete appointment");

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      setUpdatingId(id);
      const response = await fetch(
        `http://localhost:8000/api/bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ booking_status: "Confirmed" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update appointment status");

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, booking_status: "Confirmed" } : appt
        )
      );
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date: string, time: string) => {
    return `${date} at ${time.substring(0, 5)}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-green-800";
      default:
        return "bg-gray-100 text-green-800";
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-6 px-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-6xl mx-auto">
        <div className="bg-green-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            Appointments
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-green-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-medium text-lg">
                              {appointment.patient?.full_name?.charAt(0) || "?"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-900">
                              {appointment.patient?.full_name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.patient?.email || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.patient?.contact_phone || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">
                          {appointment.slot && formatDate(appointment.slot.date, appointment.slot.start_time)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Duration: {appointment.slot?.start_time?.substring(0, 5)} - {appointment.slot?.end_time?.substring(0, 5)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.booking_status)}`}>
                          {appointment.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex space-x-2 justify-end">
                          {appointment.booking_status.toLowerCase() === "pending" && (
                            <button
                              onClick={() => handleConfirm(appointment.id)}
                              disabled={updatingId === appointment.id}
                              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                            >
                              {updatingId === appointment.id ? "Updating..." : "Confirm Booking"}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;