import { useEffect, useState } from "react";

interface Appointment {
  id: number;
  user_id: number;
  therapist_id: number;
  slot_id: number;
  booking_status: string;
  created_at: string;
  updated_at: string;
  therapist: {
    id: number;
    full_name: string;
    specialization: string;
  };
  slot: {
    date: string;
    start_time: string;
    end_time: string;
  };
}

interface Payment {
  id: number;
  amount: number;
  status: string;
  booking_id: number;
  created_at: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Record<number, Payment>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("No authorization token found.");
      setLoading(false);
      return;
    }

    fetchAppointments(token);
  }, [token]);

  const fetchAppointments = async (token: string) => {
    try {
      // Fetch appointments
      const appointmentsResponse = await fetch("http://localhost:8000/api/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!appointmentsResponse.ok) throw new Error("Failed to fetch appointments");

      const appointmentsData = await appointmentsResponse.json();
      const userAppointments = appointmentsData.data || [];
      setAppointments(userAppointments);

      // Fetch payments for each appointment
      const paymentPromises = userAppointments.map(async (appt: Appointment) => {
        try {
          const paymentResponse = await fetch(`http://localhost:8000/api/mpesa?booking_id=${appt.id}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (paymentResponse.ok) {
            const paymentData = await paymentResponse.json();
            return { [appt.id]: paymentData.data[0] || null };
          }
          return { [appt.id]: null };
        } catch (err) {
          console.error(`Error fetching payment for appointment ${appt.id}:`, err);
          return { [appt.id]: null };
        }
      });

      const paymentResults = await Promise.all(paymentPromises);
      const paymentsMap = paymentResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setPayments(paymentsMap);
    } catch (err) {
      console.error("Fetch error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    if (!token) {
      alert("No authorization token found");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete appointment");

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert((err as Error).message);
    }
  };

  const formatDateTime = (date: string, startTime: string, endTime: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return `${formattedDate}, ${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
  };

  const downloadReport = () => {
    if (appointments.length === 0) {
      alert("No appointments to download");
      return;
    }

    setDownloading(true);
    
    try {
      // Create CSV content
      const headers = [
        "Appointment ID",
        "Therapist",
        "Specialization",
        "Date",
        "Start Time",
        "End Time",
        "Status",
        "Payment Status",
        "Payment Amount",
        "Booking Date"
      ];
      
      const csvRows = [headers.join(",")];
      
      appointments.forEach(appt => {
        const payment = payments[appt.id];
        const row = [
          appt.id,
          `"${appt.therapist.full_name}"`,
          `"${appt.therapist.specialization}"`,
          appt.slot.date,
          appt.slot.start_time,
          appt.slot.end_time,
          appt.booking_status,
          payment ? "Paid" : "Not Paid",
          payment ? payment.amount : 0,
          new Date(appt.created_at).toLocaleDateString()
        ];
        
        csvRows.push(row.join(","));
      });
      
      const csvContent = csvRows.join("\n");
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `appointments_report_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAppointmentDetails = (id: number) => {
    const appointment = appointments.find(appt => appt.id === id);
    if (!appointment) {
      alert("Appointment not found");
      return;
    }

    const payment = payments[id];
    
    try {
      // Create appointment details text
      const details = [
        `Appointment Details - #${appointment.id}`,
        `-----------------------------------`,
        `Therapist: ${appointment.therapist.full_name}`,
        `Specialization: ${appointment.therapist.specialization}`,
        `Date: ${appointment.slot.date}`,
        `Time: ${appointment.slot.start_time.slice(0, 5)} - ${appointment.slot.end_time.slice(0, 5)}`,
        `Status: ${appointment.booking_status}`,
        `-----------------------------------`,
        `Payment Information:`,
        payment 
          ? `Amount: KES ${payment.amount.toLocaleString()}\nStatus: ${payment.status}\nPayment Date: ${new Date(payment.created_at).toLocaleDateString()}`
          : `No payment information available`,
        `-----------------------------------`,
        `Generated on: ${new Date().toLocaleString()}`
      ].join("\n");
      
      // Create and download the text file
      const blob = new Blob([details], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `appointment_${id}_details.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download appointment details");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
          <button
            onClick={downloadReport}
            disabled={downloading || appointments.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-400 disabled:bg-gray-400 flex items-center gap-2"
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download All Appointments</span>
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-4 py-3 text-left">Therapist</th>
                <th className="border px-4 py-3 text-left">Specialization</th>
                <th className="border px-4 py-3 text-left">Session Date & Time</th>
                <th className="border px-4 py-3 text-left">Status</th>
                <th className="border px-4 py-3 text-left">Payment</th>
                <th className="border px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-3">{appointment.therapist.full_name}</td>
                    <td className="border px-4 py-3">{appointment.therapist.specialization}</td>
                    <td className="border px-4 py-3">
                      {formatDateTime(
                        appointment.slot.date,
                        appointment.slot.start_time,
                        appointment.slot.end_time
                      )}
                    </td>
                    <td className="border px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.booking_status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.booking_status}
                      </span>
                    </td>
                    <td className="border px-4 py-3">
                      {payments[appointment.id] ? (
                        <span className="text-green-600 font-medium">
                          KES {payments[appointment.id].amount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-500">Not paid</span>
                      )}
                    </td>
                    <td className="border px-4 py-3 w-1.5 space-x-2">
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => downloadAppointmentDetails(appointment.id)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;