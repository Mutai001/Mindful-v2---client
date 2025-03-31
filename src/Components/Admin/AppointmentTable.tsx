import { useEffect, useState, useRef, useCallback } from "react";
import { 
  FaDownload, 
  FaFilter, 
  FaSearch, 
  FaEdit, 
  FaTrash,
  FaFilePdf, 
  FaFileExcel,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Appointment {
  id: number;
  user_id: number;
  therapist_id: number;
  slot_id: number;
  booking_status: string;
  created_at: string;
  updated_at: string;
  patient: {
    id: number;
    full_name: string;
    email: string;
    contact_phone: string;
  };
  therapist: {
    id: number;
    full_name: string;
    specialization: string;
  };
  slot: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    is_booked: boolean;
  };
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [appointmentsPerPage] = useState<number>(10);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/bookings");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setAppointments(data.data);
        setFilteredAppointments(data.data);
      } else {
        setAppointments([]);
        setFilteredAppointments([]);
      }
    } catch (err) {
      setError((err as Error).message);
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...appointments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        appointment => 
          appointment.patient.full_name.toLowerCase().includes(term) ||
          appointment.therapist.full_name.toLowerCase().includes(term) ||
          appointment.patient.contact_phone.includes(term) ||
          appointment.slot.date.includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(appointment => appointment.booking_status === statusFilter);
    }

    setFilteredAppointments(result);
    setCurrentPage(1);
  }, [appointments, searchTerm, statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete appointment");
      setAppointments(prev => prev.filter(appt => appt.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Patient', 'Patient Phone', 'Therapist', 'Specialization', 'Date', 'Time', 'Status', 'Created At'];
    
    const csvRows = [
      headers.join(','),
      ...filteredAppointments.map(appointment => {
        return [
          appointment.id,
          `"${appointment.patient.full_name.replace(/"/g, '""')}"`,
          `"${appointment.patient.contact_phone}"`,
          `"${appointment.therapist.full_name.replace(/"/g, '""')}"`,
          `"${appointment.therapist.specialization}"`,
          appointment.slot.date,
          `${appointment.slot.start_time} - ${appointment.slot.end_time}`,
          `"${appointment.booking_status}"`,
          `"${appointment.created_at}"`
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Appointments Report', 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    const tableData = filteredAppointments.map(appointment => [
      appointment.id,
      appointment.patient.full_name,
      appointment.therapist.full_name,
      appointment.therapist.specialization,
      appointment.slot.date,
      `${formatTime(appointment.slot.start_time)} - ${formatTime(appointment.slot.end_time)}`,
      appointment.booking_status,
      formatDate(appointment.created_at)
    ]);
    
    autoTable(doc, {
      head: [['ID', 'Patient', 'Therapist', 'Specialization', 'Date', 'Time', 'Status', 'Created']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`appointments-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setFilteredAppointments(appointments);
  };

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Display only hours and minutes
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              aria-label={`${showFilters ? 'Hide' : 'Show'} filter options`}
              aria-expanded={showFilters}
            >
              <FaFilter className="mr-2" /> Filters
            </button>
            <div className="relative" ref={exportRef}>
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                aria-label="Export options"
                aria-haspopup="true"
              >
                <FaDownload className="mr-2" /> Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-10 w-44" role="menu">
                  <button 
                    onClick={exportToCSV} 
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                    aria-label="Export to Excel format"
                    role="menuitem"
                  >
                    <FaFileExcel className="mr-2 text-green-600" /> Export to Excel
                  </button>
                  <button 
                    onClick={exportToPDF} 
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                    aria-label="Export to PDF format"
                    role="menuitem"
                  >
                    <FaFilePdf className="mr-2 text-red-600" /> Export to PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filter Options</h3>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
                aria-label="Reset all filters"
              >
                Reset Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="appointment-search-filter" className="block text-sm text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    id="appointment-search-filter"
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded p-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search appointments..."
                    aria-label="Search appointments"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="status-filter" className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  id="status-filter"
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <label htmlFor="appointment-search" className="sr-only">Search appointments</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="appointment-search"
            type="text"
            placeholder="Search appointments by patient, therapist, phone or date..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search appointments"
          />
        </div>

        <div className="mb-2 text-sm text-gray-500">
          Showing {filteredAppointments.length} appointments ({currentAppointments.length} on this page)
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm text-left" aria-label="Appointments table">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th scope="col" className="p-3">ID</th>
                <th scope="col" className="p-3">Patient</th>
                <th scope="col" className="p-3">Therapist</th>
                <th scope="col" className="p-3">Specialization</th>
                <th scope="col" className="p-3">Date</th>
                <th scope="col" className="p-3">Time</th>
                <th scope="col" className="p-3">Status</th>
                <th scope="col" className="p-3">Created</th>
                <th scope="col" className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.length > 0 ? (
                currentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{appointment.id}</td>
                    <td className="p-3 font-medium">
                      <div>{appointment.patient.full_name}</div>
                      <div className="text-xs text-gray-500">{appointment.patient.contact_phone}</div>
                    </td>
                    <td className="p-3">
                      <div>{appointment.therapist.full_name}</div>
                      <div className="text-xs text-gray-500">{appointment.therapist.specialization}</div>
                    </td>
                    <td className="p-3">{appointment.therapist.specialization}</td>
                    <td className="p-3">{appointment.slot.date}</td>
                    <td className="p-3">
                      {formatTime(appointment.slot.start_time)} - {formatTime(appointment.slot.end_time)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.booking_status === 'Completed' ? 'bg-green-100 text-green-800' :
                        appointment.booking_status === 'Canceled' ? 'bg-red-100 text-red-800' :
                        appointment.booking_status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.booking_status}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(appointment.created_at)}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button 
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                          aria-label={`Edit appointment ${appointment.id}`}
                          title={`Edit appointment ${appointment.id}`}
                        >
                          <FaEdit aria-hidden="true" />
                        </button>
                        <button 
                          onClick={() => handleDelete(appointment.id)} 
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                          aria-label={`Delete appointment ${appointment.id}`}
                          title={`Delete appointment ${appointment.id}`}
                        >
                          <FaTrash aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-4 text-center text-gray-500">
                    No appointments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Previous page"
              >
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === number ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  aria-label={`Page ${number}`}
                  aria-current={currentPage === number ? 'page' : undefined}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                aria-label="Next page"
              >
                &raquo;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;