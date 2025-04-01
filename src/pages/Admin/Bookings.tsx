/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { FaDownload, FaFilter, FaSearch, FaPlus, FaEdit, FaTrash, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Booking {
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
    email: string;
    contact_phone: string;
    specialization: string;
  };
  slot: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  };
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [newBooking, setNewBooking] = useState({
    user_id: "",
    therapist_id: "",
    slot_id: "",
    booking_status: "Pending",
  });
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookingsPerPage] = useState<number>(10);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, searchTerm, statusFilter]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setBookings(data.data);
        setFilteredBookings(data.data);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (err) {
      setError((err as Error).message);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...bookings];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        booking => 
          booking.patient.full_name.toLowerCase().includes(term) ||
          booking.therapist.full_name.toLowerCase().includes(term) ||
          booking.patient.contact_phone.includes(term) ||
          booking.therapist.contact_phone.includes(term) ||
          booking.slot.date.includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(booking => booking.booking_status === statusFilter);
    }

    setFilteredBookings(result);
    setCurrentPage(1);
  };

  const handleCreate = async () => {
    if (!newBooking.user_id || !newBooking.therapist_id || !newBooking.slot_id) {
      alert("Please fill in all required fields (User ID, Therapist ID, and Slot ID).");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(newBooking.user_id),
          therapist_id: Number(newBooking.therapist_id),
          slot_id: Number(newBooking.slot_id),
          booking_status: newBooking.booking_status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create booking");
      }

      setNewBooking({
        user_id: "",
        therapist_id: "",
        slot_id: "",
        booking_status: "Pending"
      });
      setIsModalOpen(false);
      fetchBookings();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete booking");
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking({...booking});
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingBooking) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_status: editingBooking.booking_status
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update booking");
      }
      setBookings(bookings.map((booking) => (booking.id === editingBooking.id ? editingBooking : booking)));
      setEditingBooking(null);
      setIsModalOpen(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Patient', 'Patient Phone', 'Therapist', 'Specialization', 'Date', 'Time', 'Status', 'Created At'];
    
    const csvRows = [
      headers.join(','),
      ...filteredBookings.map(booking => {
        return [
          booking.id,
          `"${booking.patient.full_name.replace(/"/g, '""')}"`,
          `"${booking.patient.contact_phone}"`,
          `"${booking.therapist.full_name.replace(/"/g, '""')}"`,
          `"${booking.therapist.specialization}"`,
          booking.slot.date,
          `${booking.slot.start_time} - ${booking.slot.end_time}`,
          `"${booking.booking_status}"`,
          `"${booking.created_at}"`
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Bookings Report', 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    const tableData = filteredBookings.map(booking => [
      booking.id,
      booking.patient.full_name,
      booking.patient.contact_phone,
      booking.therapist.full_name,
      booking.therapist.specialization,
      booking.slot.date,
      `${booking.slot.start_time} - ${booking.slot.end_time}`,
      booking.booking_status,
      new Date(booking.created_at).toLocaleDateString()
    ]);
    
    (doc as any).autoTable({
      head: [['ID', 'Patient', 'Phone', 'Therapist', 'Specialization', 'Date', 'Time', 'Status', 'Created']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`bookings-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setFilteredBookings(bookings);
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Display only hours and minutes
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setEditingBooking(null);
                setIsModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              aria-label="Add new booking"
            >
              <FaPlus className="mr-2" /> Add Booking
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              aria-label="Show filter options"
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
                <label htmlFor="booking-search-filter" className="block text-sm text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    id="booking-search-filter"
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded p-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search bookings..."
                    aria-label="Search bookings"
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
          <label htmlFor="booking-search" className="sr-only">Search bookings</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="booking-search"
            type="text"
            placeholder="Search bookings by patient, therapist, phone or date..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search bookings"
          />
        </div>

        {loading && (
          <div className="flex justify-center my-12" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        {error && <p className="text-center text-red-500 p-4 bg-red-50 rounded-lg" role="alert">{error}</p>}

        {/* Booking Table */}
        {!loading && !error && (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Showing {filteredBookings.length} bookings ({currentBookings.length} on this page)
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left" aria-label="Bookings table">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th scope="col" className="p-3">ID</th>
                    <th scope="col" className="p-3">Patient</th>
                    <th scope="col" className="p-3">Therapist</th>
                    <th scope="col" className="p-3">Specialization</th>
                    <th scope="col" className="p-3">Date</th>
                    <th scope="col" className="p-3">Time</th>
                    <th scope="col" className="p-3">Status</th>
                    <th scope="col" className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.length > 0 ? (
                    currentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{booking.id}</td>
                        <td className="p-3 font-medium">
                          <div>{booking.patient.full_name}</div>
                          <div className="text-xs text-gray-500">{booking.patient.contact_phone}</div>
                        </td>
                        <td className="p-3">
                          <div>{booking.therapist.full_name}</div>
                          <div className="text-xs text-gray-500">{booking.therapist.contact_phone}</div>
                        </td>
                        <td className="p-3">{booking.therapist.specialization}</td>
                        <td className="p-3">{formatDate(booking.slot.date)}</td>
                        <td className="p-3">
                          {formatTime(booking.slot.start_time)} - {formatTime(booking.slot.end_time)}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.booking_status === "Completed" ? "bg-green-100 text-green-800" :
                            booking.booking_status === "Canceled" ? "bg-red-100 text-red-800" :
                            booking.booking_status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {booking.booking_status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(booking)} 
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                              aria-label={`Edit booking ${booking.id}`}
                              title={`Edit booking ${booking.id}`}
                            >
                              <FaEdit aria-hidden="true" />
                            </button>
                            <button 
                              onClick={() => handleDelete(booking.id)} 
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                              aria-label={`Delete booking ${booking.id}`}
                              title={`Delete booking ${booking.id}`}
                            >
                              <FaTrash aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-500">
                        No bookings found matching your criteria
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
          </>
        )}
      </div>

      {/* Booking Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 id="modal-title" className="text-xl font-bold text-gray-800">
                {editingBooking ? "Edit Booking" : "Add New Booking"}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="user-id" className="block text-gray-700 mb-2">User ID*</label>
                  <input
                    id="user-id"
                    type="number"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingBooking ? editingBooking.user_id : newBooking.user_id}
                    onChange={(e) => 
                      editingBooking 
                        ? setEditingBooking({...editingBooking, user_id: Number(e.target.value)})
                        : setNewBooking({...newBooking, user_id: e.target.value})
                    }
                    placeholder="Enter user ID"
                    aria-required="true"
                    required
                    disabled={!!editingBooking}
                  />
                </div>
                <div>
                  <label htmlFor="therapist-id" className="block text-gray-700 mb-2">Therapist ID*</label>
                  <input
                    id="therapist-id"
                    type="number"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingBooking ? editingBooking.therapist_id : newBooking.therapist_id}
                    onChange={(e) => 
                      editingBooking 
                        ? setEditingBooking({...editingBooking, therapist_id: Number(e.target.value)})
                        : setNewBooking({...newBooking, therapist_id: e.target.value})
                    }
                    placeholder="Enter therapist ID"
                    aria-required="true"
                    required
                    disabled={!!editingBooking}
                  />
                </div>
                <div>
                  <label htmlFor="slot-id" className="block text-gray-700 mb-2">Slot ID*</label>
                  <input
                    id="slot-id"
                    type="number"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingBooking ? editingBooking.slot_id : newBooking.slot_id}
                    onChange={(e) => 
                      editingBooking 
                        ? setEditingBooking({...editingBooking, slot_id: Number(e.target.value)})
                        : setNewBooking({...newBooking, slot_id: e.target.value})
                    }
                    placeholder="Enter slot ID"
                    aria-required="true"
                    required
                    disabled={!!editingBooking}
                  />
                </div>
                <div>
                  <label htmlFor="booking-status" className="block text-gray-700 mb-2">Status*</label>
                  <select
                    id="booking-status"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingBooking ? editingBooking.booking_status : newBooking.booking_status}
                    onChange={(e) => 
                      editingBooking 
                        ? setEditingBooking({...editingBooking, booking_status: e.target.value})
                        : setNewBooking({...newBooking, booking_status: e.target.value})
                    }
                    aria-required="true"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>
              {editingBooking && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Patient:</p>
                      <p className="font-medium">{editingBooking.patient.full_name}</p>
                      <p className="text-sm text-gray-500">{editingBooking.patient.contact_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Therapist:</p>
                      <p className="font-medium">{editingBooking.therapist.full_name}</p>
                      <p className="text-sm text-gray-500">{editingBooking.therapist.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date:</p>
                      <p className="font-medium">{formatDate(editingBooking.slot.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time:</p>
                      <p className="font-medium">
                        {formatTime(editingBooking.slot.start_time)} - {formatTime(editingBooking.slot.end_time)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={editingBooking ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                aria-label={editingBooking ? "Update booking" : "Add new booking"}
              >
                {editingBooking ? "Update Booking" : "Add Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Bookings;