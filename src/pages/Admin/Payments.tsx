import { useEffect, useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";

interface MpesaPayment {
  id: number;
  merchantRequestId: string;
  checkoutRequestId: string;
  amount: number;
  phoneNumber?: string;
  transactionDate?: string;
  status?: string;
  mpesaReceiptNumber?: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<MpesaPayment[]>([]);
  const [newPayment, setNewPayment] = useState({
    phoneNumber: "",
    amount: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch Payments from Backend
  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/mpesa/transactions");
      const data = await response.json();
      
      // Check if response has success: true and data array
      if (data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      } else {
        console.error("Unexpected API response:", data);
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    }
  };

  // Initiate a New M-Pesa Payment
  const handleCreate = async () => {
    try {
      await fetch("http://localhost:8000/api/mpesa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: newPayment.phoneNumber,
          amount: newPayment.amount
        }),
      });
      setNewPayment({ phoneNumber: "", amount: "" });
      fetchPayments();
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  // Delete a Payment
  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/mpesa/transactions/${id}`, { 
        method: "DELETE" 
      });
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4 text-center">M-Pesa Transactions</h2>

      {/* Initiate Payment Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <label>
          Phone Number (254...)
          <input
            type="text"
            placeholder="254712345678"
            className="border p-2 w-full"
            value={newPayment.phoneNumber}
            onChange={(e) => setNewPayment({ ...newPayment, phoneNumber: e.target.value })}
          />
        </label>
        <label>
          Amount (KES)
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 w-full"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
          />
        </label>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 w-full self-end"
        >
          Initiate Payment
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-green-600 text-white border-b border-gray-300">
              <th className="p-2 border-r">ID</th>
              <th className="p-2 border-r">Merchant Request ID</th>
              <th className="p-2 border-r">Checkout Request ID</th>
              <th className="p-2 border-r">Amount (KES)</th>
              <th className="p-2 border-r">Phone Number</th>
              <th className="p-2 border-r">Transaction Date</th>
              <th className="p-2 border-r">Status</th>
              <th className="p-2 border-r">Receipt Number</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-300 text-center">
                  <td className="p-2 border-r">{payment.id}</td>
                  <td className="p-2 border-r text-xs">{payment.merchantRequestId}</td>
                  <td className="p-2 border-r text-xs">{payment.checkoutRequestId}</td>
                  <td className="p-2 border-r">{payment.amount}</td>
                  <td className="p-2 border-r">{payment.phoneNumber || 'N/A'}</td>
                  <td className="p-2 border-r">{payment.transactionDate || 'N/A'}</td>
                  <td className={`p-2 border-r ${
                    payment.status === 'Completed' ? 'text-green-600' : 
                    payment.status === 'Failed' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {payment.status || 'Pending'}
                  </td>
                  <td className="p-2 border-r">{payment.mpesaReceiptNumber || 'N/A'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="bg-red-600 text-white px-4 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Payments;