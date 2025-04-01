/* eslint-disable react-hooks/exhaustive-deps */
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
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [exportLoading, setExportLoading] = useState<boolean>(false);

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
        setFilteredAppointments(result.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [therapistId]);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, searchQuery, appointments]);

  const applyFilters = () => {
    let filtered = [...appointments];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        appt => appt.booking_status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(
        appt => appt.slot?.date === dateFilter
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        appt => 
          appt.patient?.full_name?.toLowerCase().includes(query) ||
          appt.patient?.email?.toLowerCase().includes(query) ||
          appt.patient?.contact_phone?.includes(query)
      );
    }

    setFilteredAppointments(filtered);
  };

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
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailableDates = () => {
    const dates = new Set<string>();
    appointments.forEach(appt => {
      if (appt.slot?.date) {
        dates.add(appt.slot.date);
      }
    });
    return Array.from(dates).sort();
  };

  const exportToCSV = () => {
    setExportLoading(true);
    try {
      // Create CSV content
      const headers = ["Patient Name", "Email", "Phone", "Date", "Time", "Status"];
      const csvContent = [
        headers.join(","),
        ...filteredAppointments.map(appt => [
          `"${appt.patient?.full_name || "Unknown"}"`,
          `"${appt.patient?.email || "N/A"}"`,
          `"${appt.patient?.contact_phone || "N/A"}"`,
          `"${appt.slot?.date || "N/A"}"`,
          `"${appt.slot?.start_time?.substring(0, 5) || "N/A"} - ${appt.slot?.end_time?.substring(0, 5) || "N/A"}"`,
          `"${appt.booking_status || "N/A"}"`
        ].join(","))
      ].join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `appointments_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Failed to export CSV");
      console.error(err);
    } finally {
      setExportLoading(false);
    }
  };

  const exportToPDF = async () => {
    setExportLoading(true);
    try {
      // In a real implementation, you would use a library like jsPDF, pdfmake, or a server endpoint
      // This is a placeholder for demonstration
      const response = await fetch(
        "http://localhost:8000/api/reports/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            therapistId,
            appointments: filteredAppointments.map(appt => appt.id),
            filters: {
              status: statusFilter,
              date: dateFilter,
              query: searchQuery
            }
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate PDF report");

      // This assumes the server returns a PDF as a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `appointments_report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert((err as Error).message || "Failed to export PDF");
    } finally {
      setExportLoading(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setDateFilter("");
    setSearchQuery("");
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
        <div className="p-6">
          {/* Filters and Actions Section */}
          <div className="mb-6 bg-green-50 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Appointments</h2>
              <div className="flex space-x-2">
                <button
                  onClick={exportToCSV}
                  disabled={exportLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={exportLoading}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <select
                  id="dateFilter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Dates</option>
                  {getAvailableDates().map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-700 mb-1">Search Patient</label>
                <input
                  id="searchFilter"
                  type="text"
                  placeholder="Name, email or phone"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
              <p className="text-sm text-gray-600">
                Showing {filteredAppointments.length} of {appointments.length} appointments
              </p>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
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
                              {updatingId === appointment.id ? "Updating..." : "Confirm"}
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