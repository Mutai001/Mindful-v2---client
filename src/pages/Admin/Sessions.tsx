import { useEffect, useState, useRef, useCallback } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { FaDownload, FaFilter, FaSearch, FaPlus, FaEdit, FaTrash, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface User {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
}

interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  experience_years: number;
  contact_phone: string;
}

interface Booking {
  id: number;
  user_id: number;
  therapist_id: number;
  slot_id: number;
  booking_status: string;
  created_at: string;
  updated_at: string;
  user?: User;
  therapist?: Therapist;
}

interface Session {
  id: number;
  booking_id: number;
  session_notes: string;
  created_at: string;
  updated_at: string;
  booking: Booking;
}

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [newSession, setNewSession] = useState({
    booking_id: "",
    session_notes: "",
  });
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [therapistFilter, setTherapistFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sessionsPerPage] = useState<number>(10);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/sessions");
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const { data } = await response.json();
      
      // Enrich sessions with user and therapist data
      const enrichedData = await Promise.all(data.map(async (session: Session) => {
        // If user data not included, fetch it
        if (!session.booking.user) {
          try {
            const userResponse = await fetch(`http://localhost:8000/api/users/${session.booking.user_id}`);
            if (userResponse.ok) {
              session.booking.user = await userResponse.json();
            }
          } catch (err) {
            console.error("Error fetching user details", err);
          }
        }
        
        // If therapist data not included, fetch it
        if (!session.booking.therapist) {
          try {
            const therapistResponse = await fetch(`http://localhost:8000/api/therapists/${session.booking.therapist_id}`);
            if (therapistResponse.ok) {
              session.booking.therapist = await therapistResponse.json();
            }
          } catch (err) {
            console.error("Error fetching therapist details", err);
          }
        }
        
        return session;
      }));
      
      setSessions(enrichedData);
      setFilteredSessions(enrichedData);
    } catch (err) {
      setError((err as Error).message);
      setSessions([]);
      setFilteredSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTherapists = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/api/therapists");
      if (!response.ok) throw new Error("Failed to fetch therapists");
      const data = await response.json();
      setTherapists(data);
    } catch (err) {
      console.error("Error fetching therapists", err);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...sessions];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        session => 
          (session.booking.user?.full_name?.toLowerCase().includes(term) || false) ||
          (session.booking.therapist?.full_name?.toLowerCase().includes(term) || false) ||
          session.session_notes.toLowerCase().includes(term) ||
          session.created_at.includes(term)
      );
    }

    // Apply therapist filter
    if (therapistFilter) {
      result = result.filter(session => session.booking.therapist_id.toString() === therapistFilter);
    }

    setFilteredSessions(result);
    setCurrentPage(1);
  }, [sessions, searchTerm, therapistFilter]);

  useEffect(() => {
    fetchSessions();
    fetchTherapists();
  }, [fetchSessions, fetchTherapists]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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

  const handleCreate = async () => {
    if (!newSession.booking_id) {
      alert("Please select a booking");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: Number(newSession.booking_id),
          session_notes: newSession.session_notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create session");
      }

      setNewSession({
        booking_id: "",
        session_notes: ""
      });
      setIsModalOpen(false);
      fetchSessions();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/sessions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete session");
      setSessions(sessions.filter((session) => session.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession({...session});
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingSession) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/sessions/${editingSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_notes: editingSession.session_notes
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update session");
      }
      setSessions(sessions.map((session) => (session.id === editingSession.id ? editingSession : session)));
      setEditingSession(null);
      setIsModalOpen(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Patient', 'Patient Phone', 'Therapist', 'Specialization', 'Session Date', 'Session Notes'];
    
    const csvRows = [
      headers.join(','),
      ...filteredSessions.map(session => {
        return [
          session.id,
          `"${session.booking.user?.full_name?.replace(/"/g, '""') || 'N/A'}"`,
          `"${session.booking.user?.contact_phone || 'N/A'}"`,
          `"${session.booking.therapist?.full_name?.replace(/"/g, '""') || 'N/A'}"`,
          `"${session.booking.therapist?.specialization || 'N/A'}"`,
          session.created_at,
          `"${session.session_notes.replace(/"/g, '""')}"`
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sessions-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Therapy Sessions Report', 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    const tableData = filteredSessions.map(session => [
      session.id,
      session.booking.user?.full_name || 'N/A',
      session.booking.user?.contact_phone || 'N/A',
      session.booking.therapist?.full_name || 'N/A',
      session.booking.therapist?.specialization || 'N/A',
      new Date(session.created_at).toLocaleDateString(),
      session.session_notes.length > 30 ? session.session_notes.substring(0, 30) + '...' : session.session_notes
    ]);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      head: [['ID', 'Patient', 'Phone', 'Therapist', 'Specialization', 'Date', 'Notes']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`sessions-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTherapistFilter("");
    setFilteredSessions(sessions);
  };

  // Pagination logic
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getAvatarInitials = (name: string = "Unknown User") => {
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Therapy Sessions</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setEditingSession(null);
                setIsModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Add Session
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaFilter className="mr-2" /> Filters
            </button>
            <div className="relative" ref={exportRef}>
              <button 
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaDownload className="mr-2" /> Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-10 w-44">
                  <button 
                    onClick={exportToCSV} 
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                  >
                    <FaFileExcel className="mr-2 text-green-600" /> Export to Excel
                  </button>
                  <button 
                    onClick={exportToPDF} 
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center"
                  >
                    <FaFilePdf className="mr-2 text-red-600" /> Export to PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filter Options</h3>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded p-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search sessions..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Therapist</label>
                <select
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                  value={therapistFilter}
                  onChange={(e) => setTherapistFilter(e.target.value)}
                >
                  <option value="">All Therapists</option>
                  {therapists.map((therapist) => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.full_name} ({therapist.specialization})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search sessions by patient, therapist, date or notes..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}
        
        {error && <p className="text-center text-red-500 p-4 bg-red-50 rounded-lg">{error}</p>}

        {!loading && !error && (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Showing {filteredSessions.length} sessions ({currentSessions.length} on this page)
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Therapist</th>
                    <th className="p-3">Specialization</th>
                    <th className="p-3">Session Date</th>
                    <th className="p-3">Session Notes</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSessions.length > 0 ? (
                    currentSessions.map((session) => (
                      <tr key={session.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{session.id}</td>
                        <td className="p-3 font-medium">
                          <div>{session.booking.user?.full_name || `User ID: ${session.booking.user_id}`}</div>
                          <div className="text-xs text-gray-500">{session.booking.user?.contact_phone || 'No phone'}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-2">
                              {getAvatarInitials(session.booking.therapist?.full_name)}
                            </div>
                            <div>
                              <div>{session.booking.therapist?.full_name || `Therapist ID: ${session.booking.therapist_id}`}</div>
                              <div className="text-xs text-gray-500">{session.booking.therapist?.contact_phone || 'No phone'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">{session.booking.therapist?.specialization || 'N/A'}</td>
                        <td className="p-3">{formatDate(session.created_at)}</td>
                        <td className="p-3">
                          <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={session.session_notes}>
                            {session.session_notes.length > 30 ? session.session_notes.substring(0, 30) + '...' : session.session_notes}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(session)} 
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(session.id)} 
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No sessions found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    &laquo;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 border-t border-b border-gray-300 ${currentPage === number ? 'bg-blue-50 text-blue-600 font-medium' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    &raquo;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Session Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {editingSession ? "Edit Session" : "Add New Session"}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-4">
                {editingSession ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Session Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Patient:</p>
                        <p className="font-medium">{editingSession.booking.user?.full_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{editingSession.booking.user?.contact_phone || 'No phone'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Therapist:</p>
                        <p className="font-medium">{editingSession.booking.therapist?.full_name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{editingSession.booking.therapist?.specialization || 'No specialization'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created:</p>
                        <p className="font-medium">{formatDate(editingSession.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Updated:</p>
                        <p className="font-medium">{formatDate(editingSession.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-700 mb-2">Booking ID*</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded p-2"
                      value={newSession.booking_id}
                      onChange={(e) => setNewSession({...newSession, booking_id: e.target.value})}
                      placeholder="Enter booking ID"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 mb-2">Session Notes</label>
                  <textarea
                    rows={5}
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingSession ? editingSession.session_notes : newSession.session_notes}
                    onChange={(e) => 
                      editingSession 
                        ? setEditingSession({...editingSession, session_notes: e.target.value})
                        : setNewSession({...newSession, session_notes: e.target.value})
                    }
                    placeholder="Enter session notes"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={editingSession ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingSession ? "Update Session" : "Add Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Sessions;