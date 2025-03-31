import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaHome, FaFileInvoiceDollar, FaQrcode, FaPhoneAlt, FaCalendarAlt, FaClock, FaUserMd, FaMoneyBillWave, FaPrint, FaDownload } from "react-icons/fa";
import defaultDoctorImg from "../assets/images/Doc 1.webp";

interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  profile_picture: string | null;
  image_url?: string;
}

interface TimeSlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

interface ConfirmationState {
  paymentInitiated: boolean;
  bookingId: number;
  checkoutRequestID?: string;
  therapist?: Therapist;
  sessionFee?: number;
  slotDetails?: TimeSlot;
}

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationState | null>(null);

  useEffect(() => {
    if (location.state) {
      setConfirmationDetails(location.state as ConfirmationState);
    }
  }, [location]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const generateReceiptContent = () => {
    if (!confirmationDetails) return "";
    
    // Format the receipt data
    const receiptData = `
    THERAPY SESSION RECEIPT
    ==============================================
    
    Booking ID: #${confirmationDetails.bookingId}
    Transaction ID: ${confirmationDetails.checkoutRequestID || "N/A"}
    
    Therapist: ${confirmationDetails.therapist?.full_name || "N/A"}
    Specialization: ${confirmationDetails.therapist?.specialization || "N/A"}
    
    Date: ${confirmationDetails.slotDetails?.date ? formatDate(confirmationDetails.slotDetails.date) : "N/A"}
    Time: ${confirmationDetails.slotDetails?.start_time || "N/A"} - ${confirmationDetails.slotDetails?.end_time || "N/A"}
    
    Amount Paid: KES ${confirmationDetails.sessionFee?.toLocaleString() || "N/A"}
    Status: COMPLETED
    
    ==============================================
    Thank you for your booking!
    `;
    
    return receiptData;
  };

  const handlePrintReceipt = () => {
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Therapy Session Receipt</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2E7D32;
              }
              .receipt {
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 5px;
              }
              .receipt-item {
                display: flex;
                margin-bottom: 10px;
              }
              .receipt-label {
                flex: 1;
                font-weight: bold;
              }
              .receipt-value {
                flex: 2;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 14px;
                color: #666;
              }
              .status {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 3px;
                background-color: #4CAF50;
                color: white;
              }
              @media print {
                body {
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Therapy Session Receipt</div>
              <p>Receipt Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="receipt">
              <div class="receipt-item">
                <div class="receipt-label">Booking ID:</div>
                <div class="receipt-value">#${confirmationDetails?.bookingId || "N/A"}</div>
              </div>
              
              <div class="receipt-item">
                <div class="receipt-label">Transaction ID:</div>
                <div class="receipt-value">${confirmationDetails?.checkoutRequestID || "N/A"}</div>
              </div>
              
              <div class="receipt-item">
                <div class="receipt-label">Therapist:</div>
                <div class="receipt-value">${confirmationDetails?.therapist?.full_name || "N/A"}</div>
              </div>
              
              <div class="receipt-item">
                <div class="receipt-label">Specialization:</div>
                <div class="receipt-value">${confirmationDetails?.therapist?.specialization || "N/A"}</div>
              </div>
              
              <div class="receipt-item">
                <div class="receipt-label">Date:</div>
                <div class="receipt-value">${confirmationDetails?.slotDetails?.date ? formatDate(confirmationDetails.slotDetails.date) : "N/A"}</div>
              </div>
              
              <div class="receipt-item">
                <div class="receipt-label">Time:</div>
                <div class="receipt-value">${confirmationDetails?.slotDetails?.start_time || "N/A"} - ${confirmationDetails?.slotDetails?.end_time || "N/A"}</div>
              </div>
              
              <div class="receipt-item">
                <div class="receipt-label">Amount Paid:</div>
                <div class="receipt-value">KES ${confirmationDetails?.sessionFee?.toLocaleString() || "N/A"}</div>
              </div>
              
              <div class="receipt-item">
                <div class="receipt-label">Status:</div>
                <div class="receipt-value">
                  <span class="status">COMPLETED</span>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for your booking!</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 30px;">
              <button onClick="window.print()" style="padding: 10px 20px; background-color: #2E7D32; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Print Receipt
              </button>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
      receiptWindow.focus();
    }
  };

  const handleDownloadReceipt = () => {
    const receiptContent = generateReceiptContent();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Therapy_Receipt_${confirmationDetails?.bookingId || 'unknown'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!confirmationDetails) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden p-6 text-center">
          <p className="text-gray-600 mb-4">No booking information found</p>
          <button
            className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            onClick={() => navigate("/book-session")}
          >
            Book a Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-green-500 text-white p-6 text-center">
          <FaCalendarCheck className="mx-auto text-5xl mb-4" />
          <h2 className="text-2xl font-bold">Booking Confirmed</h2>
          <p className="text-green-100 mt-2">Your therapy session is now confirmed</p>
        </div>

        <div className="p-6">
          {/* Therapist info (if available) */}
          {confirmationDetails.therapist && (
            <div className="flex flex-col md:flex-row items-center mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-center mb-4 md:mb-0">
                <img 
                  src={confirmationDetails.therapist.image_url || defaultDoctorImg}
                  alt={confirmationDetails.therapist.full_name} 
                  className="w-20 h-20 rounded-full object-cover md:mr-5 border-2 border-green-200 shadow-md"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultDoctorImg;
                  }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-800">{confirmationDetails.therapist.full_name}</h3>
                <p className="text-green-600 font-medium">{confirmationDetails.therapist.specialization}</p>
              </div>
            </div>
          )}

          {/* Session Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Session Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {confirmationDetails.slotDetails?.date && (
                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-green-600 text-xl" />
                  <div>
                    <h4 className="font-medium text-gray-700">Date</h4>
                    <p className="text-sm text-gray-600">{formatDate(confirmationDetails.slotDetails.date)}</p>
                  </div>
                </div>
              )}
              
              {confirmationDetails.slotDetails?.start_time && (
                <div className="flex items-center space-x-3">
                  <FaClock className="text-green-600 text-xl" />
                  <div>
                    <h4 className="font-medium text-gray-700">Time</h4>
                    <p className="text-sm text-gray-600">
                      {confirmationDetails.slotDetails.start_time} - {confirmationDetails.slotDetails.end_time}
                    </p>
                  </div>
                </div>
              )}
              
              {confirmationDetails.bookingId && (
                <div className="flex items-center space-x-3">
                  <FaUserMd className="text-blue-600 text-xl" />
                  <div>
                    <h4 className="font-medium text-gray-700">Booking ID</h4>
                    <p className="text-sm text-gray-600">#{confirmationDetails.bookingId}</p>
                  </div>
                </div>
              )}
              
              {confirmationDetails.sessionFee && (
                <div className="flex items-center space-x-3">
                  <FaMoneyBillWave className="text-purple-600 text-xl" />
                  <div>
                    <h4 className="font-medium text-gray-700">Session Fee</h4>
                    <p className="text-sm text-gray-600">KES {confirmationDetails.sessionFee.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Payment Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaFileInvoiceDollar className="text-blue-600 text-2xl" />
                <div>
                  <h4 className="font-medium text-gray-700">Payment Status</h4>
                  <p className="text-sm">
                    <span className="inline-block px-2 py-1 rounded text-white bg-green-500">
                      Payment Successful
                    </span>
                  </p>
                </div>
              </div>
              
              {confirmationDetails.checkoutRequestID && (
                <div className="flex items-center space-x-3">
                  <FaQrcode className="text-purple-600 text-2xl" />
                  <div>
                    <h4 className="font-medium text-gray-700">Transaction ID</h4>
                    <p className="text-sm text-gray-600 break-all">{confirmationDetails.checkoutRequestID}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-green-600 text-2xl" />
                <div>
                  <h4 className="font-medium text-gray-700">Support</h4>
                  <p className="text-sm text-gray-600">Contact our support if you need to reschedule</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Receipt Download/Print Options */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handlePrintReceipt}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
            >
              <FaPrint className="mr-2" /> Print Receipt
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Download Receipt
            </button>
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