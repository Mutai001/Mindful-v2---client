/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { FaDownload, FaFilter, FaSearch, FaUserPlus, FaEdit, FaTrash, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Patient {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
  address: string;
  role: string;
  created_at?: string;
}

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id' | 'created_at'> & { password: string }>({
    full_name: "",
    email: "",
    contact_phone: "",
    address: "",
    role: "patient",
    password: ""
  });
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientsPerPage] = useState<number>(10);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    // Apply filters when patients data changes or search term changes
    applyFilters();
  }, [patients, searchTerm]);

  // Handle clicking outside of modal to close it
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

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://mindful-app-r8ur.onrender.com/api/users?role=patient");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      // Filter to ensure only patients are shown (double check)
      const filteredData = data.filter((user: Patient) => user.role === "patient");
      setPatients(filteredData);
      setFilteredPatients(filteredData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...patients];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        patient => 
          patient.full_name.toLowerCase().includes(term) ||
          patient.email.toLowerCase().includes(term) ||
          patient.contact_phone.includes(term)
      );
    }

    setFilteredPatients(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCreate = async () => {
    if (!newPatient.full_name || !newPatient.email || !newPatient.contact_phone || !newPatient.password) {
      alert("Please fill in all required fields (Name, Email, Phone, and Password).");
      return;
    }

    try {
      const response = await fetch("https://mindful-app-r8ur.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create patient");
      }

      // Reset the form after successful creation
      setNewPatient({
        full_name: "",
        email: "",
        contact_phone: "",
        address: "",
        role: "patient",
        password: ""
      });
      setIsModalOpen(false);
      fetchPatients(); // Re-fetch the updated patients list
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const response = await fetch(`https://mindful-app-r8ur.onrender.com/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete patient");
      setPatients(patients.filter((patient) => patient.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient({...patient});
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPatient) return;
    
    try {
      const response = await fetch(`https://mindful-app-r8ur.onrender.com/api/users/${editingPatient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPatient),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update patient");
      }
      setPatients(patients.map((patient) => (patient.id === editingPatient.id ? editingPatient : patient)));
      setEditingPatient(null);
      setIsModalOpen(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const exportToCSV = () => {
    // Create headers for CSV
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Address', 'Created At'];
    
    // Map patient data to CSV rows
    const csvRows = [
      headers.join(','),
      ...filteredPatients.map(patient => {
        return [
          patient.id,
          `"${patient.full_name.replace(/"/g, '""')}"`, // Handle quotes in names
          `"${patient.email}"`,
          `"${patient.contact_phone}"`,
          `"${patient.address?.replace(/"/g, '""') || ''}"`,
          `"${patient.created_at || ''}"`,
        ].join(',');
      })
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `patients-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text('Patients Report', 14, 15);
    
    // Add date
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Prepare data for the table
    const tableData = filteredPatients.map(patient => [
      patient.id,
      patient.full_name,
      patient.email,
      patient.contact_phone,
      patient.address || 'N/A',
      patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'
    ]);
    
    // Add table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      head: [['ID', 'Name', 'Email', 'Phone', 'Address', 'Created At']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Save the PDF
    doc.save(`patients-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilteredPatients(patients);
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Patient Management</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setEditingPatient(null);
                setIsModalOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              aria-label="Add new patient"
            >
              <FaUserPlus className="mr-2" /> Add Patient
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
                <label htmlFor="patient-search-filter" className="block text-sm text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    id="patient-search-filter"
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded p-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patients..."
                    aria-label="Search patients"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <label htmlFor="patient-search" className="sr-only">Search patients</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="patient-search"
            type="text"
            placeholder="Search patients by name, email or phone..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search patients"
          />
        </div>

        {loading && (
          <div className="flex justify-center my-12" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        {error && <p className="text-center text-red-500 p-4 bg-red-50 rounded-lg" role="alert">{error}</p>}

        {/* Patient Table */}
        {!loading && !error && (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Showing {filteredPatients.length} patients ({currentPatients.length} on this page)
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left" aria-label="Patients table">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th scope="col" className="p-3">ID</th>
                    <th scope="col" className="p-3">Name</th>
                    <th scope="col" className="p-3">Email</th>
                    <th scope="col" className="p-3">Phone</th>
                    <th scope="col" className="p-3">Address</th>
                    <th scope="col" className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.length > 0 ? (
                    currentPatients.map((patient) => (
                      <tr key={patient.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{patient.id}</td>
                        <td className="p-3 font-medium">{patient.full_name}</td>
                        <td className="p-3">{patient.email}</td>
                        <td className="p-3">{patient.contact_phone}</td>
                        <td className="p-3 max-w-xs truncate">{patient.address || "N/A"}</td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(patient)} 
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                              aria-label={`Edit patient ${patient.full_name}`}
                              title={`Edit patient ${patient.full_name}`}
                            >
                              <FaEdit aria-hidden="true" />
                            </button>
                            <button 
                              onClick={() => handleDelete(patient.id)} 
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                              aria-label={`Delete patient ${patient.full_name}`}
                              title={`Delete patient ${patient.full_name}`}
                            >
                              <FaTrash aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        No patients found matching your criteria
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

      {/* Patient Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 id="modal-title" className="text-xl font-bold text-gray-800">
                {editingPatient ? "Edit Patient" : "Add New Patient"}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="patient-name" className="block text-gray-700 mb-2">Full Name*</label>
                  <input
                    id="patient-name"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingPatient ? editingPatient.full_name : newPatient.full_name}
                    onChange={(e) => 
                      editingPatient 
                        ? setEditingPatient({...editingPatient, full_name: e.target.value})
                        : setNewPatient({...newPatient, full_name: e.target.value})
                    }
                    placeholder="Enter patient's full name"
                    aria-required="true"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="patient-email" className="block text-gray-700 mb-2">Email*</label>
                  <input
                    id="patient-email"
                    type="email"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingPatient ? editingPatient.email : newPatient.email}
                    onChange={(e) => 
                      editingPatient 
                        ? setEditingPatient({...editingPatient, email: e.target.value})
                        : setNewPatient({...newPatient, email: e.target.value})
                    }
                    placeholder="Enter email address"
                    aria-required="true"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="patient-phone" className="block text-gray-700 mb-2">Phone*</label>
                  <input
                    id="patient-phone"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingPatient ? editingPatient.contact_phone : newPatient.contact_phone}
                    onChange={(e) => 
                      editingPatient 
                        ? setEditingPatient({...editingPatient, contact_phone: e.target.value})
                        : setNewPatient({...newPatient, contact_phone: e.target.value})
                    }
                    placeholder="Enter phone number"
                    aria-required="true"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="patient-address" className="block text-gray-700 mb-2">Address</label>
                  <input
                    id="patient-address"
                    type="text"
                    className="w-full border border-gray-300 rounded p-2"
                    value={editingPatient ? editingPatient.address || "" : newPatient.address || ""}
                    onChange={(e) => 
                      editingPatient 
                        ? setEditingPatient({...editingPatient, address: e.target.value})
                        : setNewPatient({...newPatient, address: e.target.value})
                    }
                    placeholder="Enter patient address"
                    aria-label="Patient address"
                  />
                </div>
                {!editingPatient && (
                  <div>
                    <label htmlFor="patient-password" className="block text-gray-700 mb-2">Password*</label>
                    <input
                      id="patient-password"
                      type="password"
                      className="w-full border border-gray-300 rounded p-2"
                      value={newPatient.password || ""}
                      onChange={(e) => setNewPatient({...newPatient, password: e.target.value})}
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
                onClick={editingPatient ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                aria-label={editingPatient ? "Update patient information" : "Add new patient"}
              >
                {editingPatient ? "Update Patient" : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Patients;