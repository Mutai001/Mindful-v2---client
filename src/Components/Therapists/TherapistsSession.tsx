import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Search, Mail, Video, Calendar, Clock, User, Phone, MapPin, Filter } from "lucide-react";

interface Patient {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
  address: string;
  role: string;
  profile_picture: string | null;
}

interface Therapist {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
  address: string;
  role: string;
  specialization: string;
  experience_years: number;
  profile_picture: string | null;
}

interface Slot {
  id: number;
  therapist_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface Booking {
  id: number;
  user_id: number;
  therapist_id: number;
  slot_id: number;
  booking_status: string;
  created_at: string;
  updated_at: string;
  patient: Patient;
  therapist: Therapist;
  slot: Slot;
  meet_link?: string;
}

const Bookings = ({ therapistId }: { therapistId: number }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!therapistId) {
      setError("Therapist ID is missing. Unable to fetch bookings.");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
    
      try {
        console.log("Fetching bookings for therapist ID:", therapistId);
        const response = await fetch(
          `http://localhost:8000/api/bookings?therapist_id=${therapistId}`
        );
    
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }
    
        const responseData = await response.json();
        console.log("Raw API Response:", responseData);
    
        if (!responseData.success || !Array.isArray(responseData.data)) {
          setError("Invalid data format received.");
          return;
        }
    
        const data: Booking[] = responseData.data;
        
        if (data.length === 0) {
          setBookings([]);
          return;
        }

        // Sort bookings by date (newest first)
        const sortedData = [...data].sort((a, b) => {
          const dateA = new Date(`${a.slot.date}T${a.slot.start_time}`);
          const dateB = new Date(`${b.slot.date}T${b.slot.start_time}`);
          return dateA.getTime() - dateB.getTime();
        });
        
        console.log("Sorted Bookings:", sortedData);
        setBookings(sortedData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [therapistId]);

  const createMeetLink = (patientEmail: string, sessionDate: string, sessionTime: string) => {
    const formattedDate = new Date(`${sessionDate}T${sessionTime}`).toISOString();
    return `https://meet.google.com/new?authuser=0&date=${encodeURIComponent(formattedDate)}`;
  };

  const sendMeetLink = async (bookingId: number, patientEmail: string, meetLink: string) => {
    if (!bookingId || !meetLink) {
      setError("Booking ID and Meet link are required.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/send-meet-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bookingId, 
          meetLink,
          patientEmail 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || "Failed to send Meet link.");
      }

      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, meet_link: meetLink } 
            : booking
        )
      );

      setSuccessMessage(`Meeting link sent successfully to ${patientEmail}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to send Meet link:", error);
      setError("Failed to send Meet link. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Format date and time
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Filter and search bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.patient.contact_phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
      booking.booking_status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Toggle expanded booking details
  const toggleExpand = (bookingId: number) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(bookingId);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-500 p-6">
        <h2 className="text-2xl font-bold text-white">Patient Appointments</h2>
        <p className="text-green-100">Manage and view all your scheduled sessions</p>
      </div>

      {/* Search and filters */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient name, email or phone..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status messages */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && filteredBookings.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No appointments found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your search or filters" 
              : "You don't have any appointments scheduled yet"}
          </p>
        </div>
      )}

      {/* Appointments Table */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBookings.map((booking) => {
                const meetLink = booking.meet_link || createMeetLink(
                  booking.patient.email, 
                  booking.slot.date, 
                  booking.slot.start_time
                );
                const isExpanded = expandedBooking === booking.id;

                return (
                  <>
                    <tr key={booking.id} className={`${isExpanded ? "bg-green-50" : "hover:bg-gray-50"}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.patient.full_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {booking.patient.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-green-600" /> {formatDate(booking.slot.date)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-green-600" /> 
                            {formatTime(booking.slot.start_time)} - {formatTime(booking.slot.end_time)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.booking_status)} text-white`}>
                          {booking.booking_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <a 
                            href={meetLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Video className="h-4 w-4 mr-1" /> Join
                          </a>
                          <button
                            onClick={() => sendMeetLink(booking.id, booking.patient.email, meetLink)}
                            disabled={!!booking.meet_link}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md ${
                              booking.meet_link
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            }`}
                          >
                            <Mail className="h-4 w-4 mr-1" /> 
                            {booking.meet_link ? "Sent" : "Send Link"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => toggleExpand(booking.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {isExpanded ? "Hide" : "Show"} Details
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-green-50 border-b border-green-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-semibold text-green-800 mb-2 border-b border-green-200 pb-2">Patient Details</h4>
                              <div className="space-y-2">
                                <p className="text-sm flex items-center">
                                  <User className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="font-medium">Name:</span>
                                  <span className="ml-2">{booking.patient.full_name}</span>
                                </p>
                                <p className="text-sm flex items-center">
                                  <Mail className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="font-medium">Email:</span>
                                  <span className="ml-2">{booking.patient.email}</span>
                                </p>
                                <p className="text-sm flex items-center">
                                  <Phone className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="font-medium">Phone:</span>
                                  <span className="ml-2">{booking.patient.contact_phone}</span>
                                </p>
                                <p className="text-sm flex items-start">
                                  <MapPin className="h-4 w-4 mr-2 text-green-600 mt-1" />
                                  <span className="font-medium">Address:</span>
                                  <span className="ml-2">{booking.patient.address}</span>
                                </p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-semibold text-green-800 mb-2 border-b border-green-200 pb-2">Appointment Details</h4>
                              <div className="space-y-2">
                                <p className="text-sm">
                                  <span className="font-medium">Booking ID:</span>
                                  <span className="ml-2">#{booking.id}</span>
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Slot ID:</span>
                                  <span className="ml-2">#{booking.slot_id}</span>
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Created:</span>
                                  <span className="ml-2">{new Date(booking.created_at).toLocaleString()}</span>
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Last Updated:</span>
                                  <span className="ml-2">{new Date(booking.updated_at).toLocaleString()}</span>
                                </p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-semibold text-green-800 mb-2 border-b border-green-200 pb-2">Meeting Link</h4>
                              <div className="space-y-3">
                                <p className="text-sm break-all">
                                  {booking.meet_link ? (
                                    <>
                                      <span className="font-medium text-green-600">Link sent:</span>
                                      <a href={booking.meet_link} target="_blank" rel="noopener noreferrer" className="block mt-1 text-blue-600 hover:underline">
                                        {booking.meet_link}
                                      </a>
                                    </>
                                  ) : (
                                    <span className="text-yellow-600">Meeting link not yet sent to patient</span>
                                  )}
                                </p>
                                <div className="pt-2">
                                  <button
                                    onClick={() => sendMeetLink(booking.id, booking.patient.email, meetLink)}
                                    disabled={!!booking.meet_link}
                                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                                      booking.meet_link
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "text-white bg-blue-600 hover:bg-blue-700"
                                    }`}
                                  >
                                    <Mail className="mr-2 h-5 w-5" />
                                    {booking.meet_link ? "Link Already Sent" : "Send Meeting Link"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredBookings.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredBookings.length)}
                </span>{" "}
                of <span className="font-medium">{filteredBookings.length}</span> appointments
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">First Page</span>
                  <ArrowLeft className="h-5 w-5" />
                  <ArrowLeft className="h-5 w-5 -ml-3" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  // Display current page, 2 pages before and after current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === pageNumber
                            ? "bg-green-50 border-green-500 text-green-600 z-10"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        } text-sm font-medium`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-500 text-sm font-medium"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Last Page</span>
                  <ArrowRight className="h-5 w-5" />
                  <ArrowRight className="h-5 w-5 -ml-3" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;