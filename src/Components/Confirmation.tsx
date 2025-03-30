import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaHome, FaFileInvoiceDollar, FaQrcode, FaPhoneAlt } from "react-icons/fa";

const Confirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-green-500 text-white p-6 text-center">
          <FaCalendarCheck className="mx-auto text-5xl mb-4" />
          <h2 className="text-2xl font-bold">Booking Successful</h2>
          <p className="text-green-100 mt-2">Your therapy session is now confirmed</p>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Important Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaFileInvoiceDollar className="text-blue-600 text-2xl" />
                <div>
                  <h4 className="font-medium text-gray-700">Payment Confirmation</h4>
                  <p className="text-sm text-gray-600">Your payment of KES 1,500 has been processed</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaQrcode className="text-purple-600 text-2xl" />
                <div>
                  <h4 className="font-medium text-gray-700">Booking Reference</h4>
                  <p className="text-sm text-gray-600">Keep your transaction ID for records</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-green-600 text-2xl" />
                <div>
                  <h4 className="font-medium text-gray-700">Support</h4>
                  <p className="text-sm text-gray-600">Contact our support if you need to reschedule</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4 text-sm">
              A confirmation SMS will be sent to your registered phone number shortly.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            className="w-full flex items-center justify-center py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/user-dashboard")}
          >
            <FaHome className="mr-2" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;