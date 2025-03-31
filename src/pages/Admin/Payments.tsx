import { useEffect, useState, useRef, useCallback } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";
import { 
  FaDownload, 
  FaFilter, 
  FaSearch, 
  FaMoneyBillWave, 
  FaFilePdf, 
  FaFileExcel,
  FaTrash
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Payment {
  id: number;
  booking_id: number;
  phone_number: string;
  amount: string;
  reference_code: string;
  mpesa_receipt_number: string | null;
  transaction_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  booking: {
    id: number;
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
  };
}

interface TherapistSummary {
  id: number;
  full_name: string;
  specialization: string;
  total_payments: number;
  completed_payments: number;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [therapistSummaries, setTherapistSummaries] = useState<TherapistSummary[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [newPayment, setNewPayment] = useState({
    phoneNumber: "",
    amount: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paymentsPerPage] = useState<number>(10);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/mpesa");
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setPayments(data.data);
        calculateSummaries(data.data);
      } else {
        setPayments([]);
        setFilteredPayments([]);
      }
    } catch (err) {
      setError((err as Error).message);
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateSummaries = (paymentsData: Payment[]) => {
    // Calculate total revenue
    const revenue = paymentsData.reduce((sum, payment) => {
      return sum + parseFloat(payment.amount);
    }, 0);
    setTotalRevenue(revenue);

    // Calculate therapist summaries
    const summariesMap = new Map<number, TherapistSummary>();
    
    paymentsData.forEach(payment => {
      const therapist = payment.booking.therapist;
      const amount = parseFloat(payment.amount);
      
      if (!summariesMap.has(therapist.id)) {
        summariesMap.set(therapist.id, {
          id: therapist.id,
          full_name: therapist.full_name,
          specialization: therapist.specialization,
          total_payments: 0,
          completed_payments: 0
        });
      }
      
      const summary = summariesMap.get(therapist.id)!;
      summary.total_payments += amount;
      
      if (payment.status === "Completed") {
        summary.completed_payments += amount;
      }
    });

    setTherapistSummaries(Array.from(summariesMap.values()));
  };

  const applyFilters = useCallback(() => {
    let result = [...payments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        payment => 
          payment.booking.patient.full_name.toLowerCase().includes(term) ||
          payment.booking.therapist.full_name.toLowerCase().includes(term) ||
          payment.phone_number.includes(term) ||
          payment.reference_code.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(result);
    setCurrentPage(1);
  }, [payments, searchTerm, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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

  const handleCreate = async () => {
    if (!newPayment.phoneNumber || !newPayment.amount) {
      alert("Please fill in all required fields (Phone Number and Amount).");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/mpesa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: newPayment.phoneNumber,
          amount: newPayment.amount
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to initiate payment");
      }

      setNewPayment({ phoneNumber: "", amount: "" });
      fetchPayments();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/mpesa/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete payment");
      fetchPayments();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Patient', 'Therapist', 'Amount (KES)', 'Phone', 'Reference', 'Status', 'Receipt', 'Date'];
    
    const csvRows = [
      headers.join(','),
      ...filteredPayments.map(payment => {
        return [
          payment.id,
          `"${payment.booking.patient.full_name.replace(/"/g, '""')}"`,
          `"${payment.booking.therapist.full_name.replace(/"/g, '""')}"`,
          payment.amount,
          `"${payment.phone_number}"`,
          `"${payment.reference_code}"`,
          `"${payment.status}"`,
          `"${payment.mpesa_receipt_number || ''}"`,
          `"${formatDate(payment.transaction_date)}"`
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Payments Report', 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // Add summary section
    doc.text('Revenue Summary', 14, 30);
    doc.text(`Total Revenue: KES ${totalRevenue.toLocaleString()}`, 14, 38);
    
    // Add therapist performance table
    doc.autoTable({
      head: [['Therapist', 'Specialization', 'Total Payments', 'Completed Payments']],
      body: therapistSummaries.map(summary => [
        summary.full_name,
        summary.specialization,
        `KES ${summary.total_payments.toLocaleString()}`,
        `KES ${summary.completed_payments.toLocaleString()}`
      ]),
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Add payments table
    doc.autoTable({
      head: [['ID', 'Patient', 'Therapist', 'Amount', 'Status', 'Date']],
      body: filteredPayments.map(payment => [
        payment.id,
        payment.booking.patient.full_name,
        payment.booking.therapist.full_name,
        `KES ${payment.amount}`,
        payment.status,
        formatDate(payment.transaction_date)
      ]),
      startY: doc.lastAutoTable.finalY + 15,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`payments-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowExportOptions(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setFilteredPayments(payments);
  };

  // Pagination logic
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

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

  const formatCurrency = (amount: string) => {
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment Management</h2>
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

        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-800">
                  KES {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed Payments</p>
                <p className="text-2xl font-bold text-green-800">
                  KES {therapistSummaries.reduce((sum, t) => sum + t.completed_payments, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Active Therapists</p>
                <p className="text-2xl font-bold text-purple-800">
                  {therapistSummaries.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Therapist Performance */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg mb-3 text-gray-700">Therapist Revenue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-2 text-left">Therapist</th>
                  <th className="p-2 text-left">Specialization</th>
                  <th className="p-2 text-right">Total Payments</th>
                  <th className="p-2 text-right">Completed</th>
                </tr>
              </thead>
              <tbody>
                {therapistSummaries.map(therapist => (
                  <tr key={therapist.id} className="border-b border-gray-200">
                    <td className="p-2">{therapist.full_name}</td>
                    <td className="p-2">{therapist.specialization}</td>
                    <td className="p-2 text-right font-medium">KES {therapist.total_payments.toLocaleString()}</td>
                    <td className="p-2 text-right">KES {therapist.completed_payments.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Initiate Payment Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h3 className="font-bold text-lg mb-3 text-gray-700">Initiate New Payment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="phone-number" className="block text-sm text-gray-600 mb-1">Phone Number*</label>
              <input
                id="phone-number"
                type="text"
                placeholder="254712345678"
                className="w-full border border-gray-300 rounded p-2"
                value={newPayment.phoneNumber}
                onChange={(e) => setNewPayment({ ...newPayment, phoneNumber: e.target.value })}
                aria-required="true"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm text-gray-600 mb-1">Amount (KES)*</label>
              <input
                id="amount"
                type="number"
                placeholder="Amount"
                className="w-full border border-gray-300 rounded p-2"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                aria-required="true"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCreate}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                aria-label="Initiate payment"
              >
                Initiate Payment
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
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
                <label htmlFor="payment-search-filter" className="block text-sm text-gray-600 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    id="payment-search-filter"
                    type="text"
                    className="pl-10 w-full border border-gray-300 rounded p-2 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search payments..."
                    aria-label="Search payments"
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
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <label htmlFor="payment-search" className="sr-only">Search payments</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="payment-search"
            type="text"
            placeholder="Search payments by patient, therapist, phone or reference..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search payments"
          />
        </div>

        {loading && (
          <div className="flex justify-center my-12" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        
        {error && <p className="text-center text-red-500 p-4 bg-red-50 rounded-lg" role="alert">{error}</p>}

        {/* Payment Table */}
        {!loading && !error && (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Showing {filteredPayments.length} payments ({currentPayments.length} on this page)
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left" aria-label="Payments table">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th scope="col" className="p-3">ID</th>
                    <th scope="col" className="p-3">Patient</th>
                    <th scope="col" className="p-3">Therapist</th>
                    <th scope="col" className="p-3">Amount</th>
                    <th scope="col" className="p-3">Reference</th>
                    <th scope="col" className="p-3">Date</th>
                    <th scope="col" className="p-3">Status</th>
                    <th scope="col" className="p-3">Receipt</th>
                    <th scope="col" className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPayments.length > 0 ? (
                    currentPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{payment.id}</td>
                        <td className="p-3 font-medium">
                          <div>{payment.booking.patient.full_name}</div>
                          <div className="text-xs text-gray-500">{payment.booking.patient.contact_phone}</div>
                        </td>
                        <td className="p-3">
                          <div>{payment.booking.therapist.full_name}</div>
                          <div className="text-xs text-gray-500">{payment.booking.therapist.specialization}</div>
                        </td>
                        <td className="p-3 font-medium">{formatCurrency(payment.amount)}</td>
                        <td className="p-3">{payment.reference_code}</td>
                        <td className="p-3">{formatDate(payment.transaction_date)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="p-3">{payment.mpesa_receipt_number || 'N/A'}</td>
                        <td className="p-3">
                          <button 
                            onClick={() => handleDelete(payment.id)} 
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                            aria-label={`Delete payment ${payment.id}`}
                            title={`Delete payment ${payment.id}`}
                          >
                            <FaTrash aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-4 text-center text-gray-500">
                        No payments found matching your criteria
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
    </AdminLayout>
  );
};

export default Payments;