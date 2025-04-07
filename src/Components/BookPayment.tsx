// BookPayment.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUserMd, FaMoneyBillWave, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import defaultDoctorImg from "../assets/images/Doc 1.webp";

interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  profile_picture: string | null;
  session_fee?: number;
  image_url?: string;
}

interface TimeSlot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

type BookPaymentProps = Record<string, unknown>;
// Any props if needed

interface LocationState {
  therapist: Therapist;
  sessionFee: number;
  bookingId: number;
  slotDetails: TimeSlot;
}

interface PaymentResponse {
  message: string;
  checkoutRequestID?: string;
  merchantRequestID?: string;
  responseCode?: string;
}

const BookPayment: React.FC<BookPaymentProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("mpesa");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [transactionInfo, setTransactionInfo] = useState<{
    checkoutRequestID?: string;
    merchantRequestID?: string;
  } | null>(null);

  useEffect(() => {
    // Get booking details from location state
    if (location.state) {
      setBookingDetails(location.state as LocationState);
      
      // Get user phone number from localStorage if available
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.phone) {
        setPhoneNumber(user.phone);
      }
    } else {
      setError("No booking information found. Please try booking again.");
    }
  }, [location]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingDetails) {
      toast.error("Booking details not found");
      return;
    }
    
    if (!phoneNumber && paymentMethod === "mpesa") {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }
      
      // Correctly formatted payment request body matching the validator's expectations
      const paymentData = {
        phoneNumber: phoneNumber.startsWith("254") ? phoneNumber : `254${phoneNumber.replace(/^0+/, '')}`,
        amount: bookingDetails.sessionFee,
        referenceCode: `BOOK${bookingDetails.bookingId}`,
        description: `Therapy Session Payment for Booking #${bookingDetails.bookingId}`,
        bookingId: bookingDetails.bookingId
      };
      
      // Make API call to initiate payment
      const response = await fetch("https://mindful-app-r8ur.onrender.com/api/mpesa/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment initiation failed");
      }
      
      const responseData: PaymentResponse = await response.json();
      
      // Use the responseData to store transaction information
      setTransactionInfo({
        checkoutRequestID: responseData.checkoutRequestID,
        merchantRequestID: responseData.merchantRequestID
      });
      
      // Log the transaction details for debugging (optional)
      console.log("Payment initiated:", responseData);
      
      // Handle successful payment initiation
      setIsProcessing(false);
      setSuccess(true);
      toast.success(responseData.message || "Payment initiated successfully!");
      
      // After a brief delay, redirect to the sessions/appointments page
      // FIXED: Pass all necessary data to the confirmation page
      setTimeout(() => {
        navigate("/confirmation", { 
          state: { 
            paymentInitiated: true,
            bookingId: bookingDetails.bookingId,
            checkoutRequestID: responseData.checkoutRequestID,
            therapist: bookingDetails.therapist,
            sessionFee: bookingDetails.sessionFee,
            slotDetails: bookingDetails.slotDetails
          }
        });
      }, 3000);
      
    } catch (error) {
      setIsProcessing(false);
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
    }
  };
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-5 text-center">
        <div className="bg-red-50 p-5 rounded-lg border border-red-200 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={() => navigate("/book-session")}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Book a New Session
        </button>
      </div>
    );
  }
  
  if (!bookingDetails) {
    return (
      <div className="max-w-3xl mx-auto p-5 flex justify-center items-center h-64">
        <BeatLoader color="#2E7D32" size={15} />
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="max-w-3xl mx-auto p-5">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Initiated!</h2>
          <p className="text-gray-600 mb-6">
            Your payment is being processed. You'll receive a confirmation shortly.
          </p>
          {transactionInfo && transactionInfo.checkoutRequestID && (
            <p className="text-sm text-gray-500 mb-4">
              Transaction Reference: {transactionInfo.checkoutRequestID}
            </p>
          )}
          <p className="text-gray-600 mb-6">
            You will be redirected to your appointments page in a few seconds...
          </p>
          <BeatLoader color="#2E7D32" size={10} />
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Complete Your Booking</h2>
      
      {/* Booking Summary */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-green-50 p-5 border-b border-green-100">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Booking Summary</h3>
          <p className="text-gray-600">Please review your booking details before proceeding to payment</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start mb-6">
            <div className="flex justify-center mb-4 md:mb-0">
              <img 
                src={bookingDetails.therapist.image_url || defaultDoctorImg}
                alt={bookingDetails.therapist.full_name} 
                className="w-24 h-24 rounded-full object-cover md:mr-5 border-2 border-green-200 shadow-md"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultDoctorImg;
                }}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800">{bookingDetails.therapist.full_name}</h3>
              <p className="text-green-600 font-medium">{bookingDetails.therapist.specialization}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaCalendarAlt className="text-green-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Appointment Date</div>
                  <div className="font-medium">{formatDate(bookingDetails.slotDetails.date)}</div>
                </div>
              </div>
              <div className="flex items-center">
                <FaClock className="text-green-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Appointment Time</div>
                  <div className="font-medium">
                    {bookingDetails.slotDetails.start_time} - {bookingDetails.slotDetails.end_time}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <FaUserMd className="text-green-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Booking ID</div>
                  <div className="font-medium">#{bookingDetails.bookingId}</div>
                </div>
              </div>
              <div className="flex items-center">
                <FaMoneyBillWave className="text-green-600 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Session Fee</div>
                  <div className="font-medium">KES {bookingDetails.sessionFee.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Section */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-green-600" />
              Payment Details
            </h4>
            
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-3">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("mpesa")}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                      paymentMethod === "mpesa" 
                        ? "border-green-500 bg-green-50" 
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-medium mb-1">M-Pesa</div>
                    <div className="text-xs text-gray-500">Pay with mobile money</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("card")}
                    className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                      paymentMethod === "card" 
                        ? "border-green-500 bg-green-50" 
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="font-medium mb-1">Card Payment</div>
                    <div className="text-xs text-gray-500">Pay with credit/debit card</div>
                  </button>
                </div>
              </div>
              
              {paymentMethod === "mpesa" && (
                <div className="mb-5">
                  <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">+254</span>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="7XX XXX XXX"
                      className="pl-14 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your M-Pesa registered phone number
                  </p>
                </div>
              )}
              
              {paymentMethod === "card" && (
                <div className="mb-5">
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
                    Card payment integration is currently in testing. Please use M-Pesa for now.
                  </div>
                </div>
              )}
              
              <div className="mb-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Session Fee</span>
                  <span className="font-medium">KES {bookingDetails.sessionFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm text-gray-500">
                  <span>Transaction Fee</span>
                  <span>KES 0.00</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-green-700">
                  <span>Total Amount</span>
                  <span>KES {bookingDetails.sessionFee.toLocaleString()}</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isProcessing || (paymentMethod === "mpesa" && !phoneNumber)}
                className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center mt-4 ${
                  isProcessing || (paymentMethod === "mpesa" && !phoneNumber)
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isProcessing ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  "Pay Now"
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/book-session")}
                disabled={isProcessing}
                className="w-full mt-3 py-2 text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
              >
                Change Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPayment;