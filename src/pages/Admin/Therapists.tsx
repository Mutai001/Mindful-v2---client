import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { FaDownload, FaFilter, FaSearch, FaUserPlus, FaEdit, FaTrash, FaFilePdf, FaFileExcel, FaCalendarAlt } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

interface Therapist {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
  specialization: string;
  experience_years: number;
  role: string;
  created_at?: string;
}

const Therapists = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [newTherapist, setNewTherapist] = useState<Omit<Therapist, 'id' | 'created_at' | 'role'> & { password: string }>({
    full_name: "",
    email: "",
    contact_phone: "",
    specialization: "",
    experience_years: 0,
    password: ""
  });
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [therapistsPerPage] = useState<number>(10);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTherapists();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [therapists, searchTerm]);

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

  const fetchTherapists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/users?role=therapist");
      if (!response.ok) throw new Error("Failed to fetch therapists");
      const data = await response.json();
      const filteredData = data.filter((user: Therapist) => user.role === "therapist");
      setTherapists(filteredData);
      setFilteredTherapists(filteredData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...therapists];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        therapist => 
          therapist.full_name.toLowerCase().includes(term) ||
          therapist.email.toLowerCase().includes(term) ||
          therapist.contact_phone.includes(term) ||
          therapist.specialization.toLowerCase().includes(term)
      );
    }

    setFilteredTherapists(result);
    setCurrentPage(1);
  };

  const handleCreate = async () => {
    if (!newTherapist.full_name || !newTherapist.email || !newTherapist.contact_phone || !newTherapist.password) {
      alert("Please fill in all required fields (Name, Email, Phone, and Password).");
      return;
    }

    const therapistToCreate = {
      ...newTherapist,
      role: "therapist"
    };

    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(therapistToCreate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create therapist");
      }

      setNewTherapist({
        full_name: "",
        email: "",
        contact_phone: "",
        specialization: "",
        experience_years: 0,
        password: ""
      });
      setIsModalOpen(false);
      fetchTherapists();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this therapist?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete therapist");
      setTherapists(therapists.filter((therapist) => therapist.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEdit = (therapist: Therapist) => {
    setEditingTherapist({...therapist});
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTherapist) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/users/${editingTherapist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTherapist),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update therapist");
      }
      setTherapists(therapists.map((therapist) => (therapist.id === editingTherapist.id ? editingTherapist : therapist)));
      setEditingTherapist(null);
      setIsModalOpen(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Specialization', 'Experience (years)', 'Created At'];
    
    const csvRows = [
      headers.join(','),
      ...filteredTherapists.map(therapist => {
        return [
          therapist.id,
          `"${therapist.full_name.replace(/"/g, '""')}"`,
          `"${therapist.email}"`,
          `"${therapist.contact_phone}"`,
          `"${therapist.specialization}"`,
          therapist.experience_years,
          `"${therapist.created_at || ''}"`,
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `therapists-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Therapists Report', 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    const tableData = filteredTherapists.map(therapist => [
      therapist.id,
      therapist.full_name,
      therapist.email,
      therapist.contact_phone,
      therapist.specialization,
      therapist.experience_years,
      therapist.created_at ? new Date(therapist.created_at).toLocaleDateString() : 'N/A'
    ]);
    
    (doc as any).autoTable({
      head: [['ID', 'Name', 'Email', 'Phone', 'Specialization', 'Experience', 'Created At']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`therapists-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilteredTherapists(therapists);
  };

  // Pagination logic
  const indexOfLastTherapist = currentPage * therapistsPerPage;
  const indexOfFirstTherapist = indexOfLastTherapist - therapistsPerPage;
  const currentTherapists = filteredTherapists.slice(indexOfFirstTherapist, indexOfLastTherapist);
  const totalPages = Math.ceil(filteredTherapists.length / therapistsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const assignSlots = (therapistId: number) => {
    navigate(`/admin/assign-slots/${therapistId}`);
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Therapist Management</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setEditingTherapist(null);
                setIsModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              aria-label="Add new therapist"
            >
              <FaUserPlus className="mr-2" /> Add Therapist
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
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="therapist-search-filter" className="block text-sm text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    id="therapist-search-filter"
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded p-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search therapists..."
                    aria-label="Search therapists"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <label htmlFor="therapist-search" className="sr-only">Search therapists</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="therapist-search"
            type="text"
            placeholder="Search therapists by name, email, phone or specialization..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search therapists"
          />
        </div>

        {loading && (
          <div className="flex justify-center my-12" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        {error && <p className="text-center text-red-500 p-4 bg-red-50 rounded-lg" role="alert">{error}</p>}

        {/* Therapist Table */}
        {!loading && !error && (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Showing {filteredTherapists.length} therapists ({currentTherapists.length} on this page)
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left" aria-label="Therapists table">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th scope="col" className="p-3">ID</th>
                    <th scope="col" className="p-3">Name</th>
                    <th scope="col" className="p-3">Email</th>
                    <th scope="col" className="p-3">Phone</th>
                    <th scope="col" className="p-3">Specialization</th>
                    <th scope="col" className="p-3">Experience</th>
                    <th scope="col" className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTherapists.length > 0 ? (
                    currentTherapists.map((therapist) => (
                      <tr key={therapist.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{therapist.id}</td>
                        <td className="p-3 font-medium">{therapist.full_name}</td>
                        <td className="p-3">{therapist.email}</td>
                        <td className="p-3">{therapist.contact_phone}</td>
                        <td className="p-3">{therapist.specialization}</td>
                        <td className="p-3">{therapist.experience_years} years</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => assignSlots(therapist.id)} 
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                              aria-label={`Assign slots to ${therapist.full_name}`}
                              title={`Assign slots to ${therapist.full_name}`}
                            >
                              <FaCalendarAlt aria-hidden="true" />
                            </button>
                            <button 
                              onClick={() => handleEdit(therapist)} 
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                              aria-label={`Edit therapist ${therapist.full_name}`}
                              title={`Edit therapist ${therapist.full_name}`}
                            >
                              <FaEdit aria-hidden="true" />
                            </button>
                            <button 
                              onClick={() => handleDelete(therapist.id)} 
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                              aria-label={`Delete therapist ${therapist.full_name}`}
                              title={`Delete therapist ${therapist.full_name}`}
                            >
                              <FaTrash aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No therapists found matching your criteria
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

      {/* Therapist Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 id="modal-title" className="text-xl font-bold text-gray-800">
                {editingTherapist ? "Edit Therapist" : "Add New Therapist"}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="therapist-name" className="block text-gray-700 mb-2">Full Name*</label>
                  <input
                    id="therapist-name"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingTherapist ? editingTherapist.full_name : newTherapist.full_name}
                    onChange={(e) => 
                      editingTherapist 
                        ? setEditingTherapist({...editingTherapist, full_name: e.target.value})
                        : setNewTherapist({...newTherapist, full_name: e.target.value})
                    }
                    placeholder="Enter therapist's full name"
                    aria-required="true"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="therapist-email" className="block text-gray-700 mb-2">Email*</label>
                  <input
                    id="therapist-email"
                    type="email"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingTherapist ? editingTherapist.email : newTherapist.email}
                    onChange={(e) => 
                      editingTherapist 
                        ? setEditingTherapist({...editingTherapist, email: e.target.value})
                        : setNewTherapist({...newTherapist, email: e.target.value})
                    }
                    placeholder="Enter email address"
                    aria-required="true"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="therapist-phone" className="block text-gray-700 mb-2">Phone*</label>
                  <input
                    id="therapist-phone"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingTherapist ? editingTherapist.contact_phone : newTherapist.contact_phone}
                    onChange={(e) => 
                      editingTherapist 
                        ? setEditingTherapist({...editingTherapist, contact_phone: e.target.value})
                        : setNewTherapist({...newTherapist, contact_phone: e.target.value})
                    }
                    placeholder="Enter phone number"
                    aria-required="true"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="therapist-specialization" className="block text-gray-700 mb-2">Specialization*</label>
                  <input
                    id="therapist-specialization"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingTherapist ? editingTherapist.specialization : newTherapist.specialization}
                    onChange={(e) => 
                      editingTherapist 
                        ? setEditingTherapist({...editingTherapist, specialization: e.target.value})
                        : setNewTherapist({...newTherapist, specialization: e.target.value})
                    }
                    placeholder="Enter specialization"
                    aria-required="true"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="therapist-experience" className="block text-gray-700 mb-2">Experience (years)*</label>
                  <input
                    id="therapist-experience"
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingTherapist ? editingTherapist.experience_years : newTherapist.experience_years}
                    onChange={(e) => 
                      editingTherapist 
                        ? setEditingTherapist({...editingTherapist, experience_years: parseInt(e.target.value) || 0})
                        : setNewTherapist({...newTherapist, experience_years: parseInt(e.target.value) || 0})
                    }
                    placeholder="Enter years of experience"
                    aria-required="true"
                    required
                  />
                </div>
                {!editingTherapist && (
                  <div>
                    <label htmlFor="therapist-password" className="block text-gray-700 mb-2">Password*</label>
                    <input
                      id="therapist-password"
                      type="password"
                      className="w-full border border-gray-300 rounded p-2"
                      value={newTherapist.password || ""}
                      onChange={(e) => setNewTherapist({...newTherapist, password: e.target.value})}
                      placeholder="Enter password"
                      aria-required="true"
                      required
                    />
                  </div>
                )}
              </div>
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
                onClick={editingTherapist ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                aria-label={editingTherapist ? "Update therapist information" : "Add new therapist"}
              >
                {editingTherapist ? "Update Therapist" : "Add Therapist"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Therapists;