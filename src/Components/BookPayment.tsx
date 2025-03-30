// import React, { useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { 
//   FaMobileAlt, 
//   FaLock, 
//   FaCalendarAlt, 
//   FaClock, 
//   FaUserMd 
// } from "react-icons/fa";

// const BookPayment: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { doctor = null, sessionFee = 0 } = location.state || {};
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [selectedTime, setSelectedTime] = useState<string>("");
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [paymentError, setPaymentError] = useState<string>("");
//   const [phoneFormat, setPhoneFormat] = useState<"254" | "07">("07");

//   if (!doctor) {
//     navigate('/');
//     return null;
//   }

//   // Generate time slots
//   const timeSlots = [
//     "9:00 - 11:00",
//     "11:00 - 13:00", 
//     "13:00 - 15:00", 
//     "15:00 - 17:00"
//   ];

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/[^\d]/g, '');
    
//     // Dynamically switch format based on input
//     if (value.startsWith('254')) {
//       setPhoneFormat("254");
//       // Limit to 12 digits for 254 format
//       setPhoneNumber(value.slice(0, 12));
//     } else if (value.startsWith('0')) {
//       setPhoneFormat("07");
//       // Limit to 10 digits for 07 format
//       setPhoneNumber(value.slice(0, 10));
//     } else {
//       // If input doesn't start with 254 or 0, assume 07 format and prepend 0
//       setPhoneFormat("07");
//       setPhoneNumber(value.slice(0, 10));
//     }
//   };

//   const handlePayment = async () => {
//     setPaymentError("");

//     if (!phoneNumber.trim() || !selectedDate || !selectedTime) {
//       setPaymentError("Please fill all fields");
//       return;
//     }

//     // Validate based on current format
//     if (phoneFormat === "254" && !/^254[17]\d{8}$/.test(phoneNumber)) {
//       setPaymentError("Please enter a valid 254 format number (254XXXXXXXXX)");
//       return;
//     }

//     if (phoneFormat === "07" && !/^(07|01)\d{8}$/.test(phoneNumber)) {
//       setPaymentError("Please enter a valid Kenyan number (07XXXXXXXX or 01XXXXXXXX)");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Format phone number to 254 format
//       const formattedPhone = phoneFormat === "07" 
//         ? `254${phoneNumber.substring(1)}` 
//         : phoneNumber;

//       // Prepare payment data exactly as per API specification
//       const paymentData = {
//         phoneNumber: formattedPhone,
//         amount: sessionFee,
//         referenceCode: `THERAPY-${doctor.name.split(' ')[1] || 'SESSION'}`,
//         description: `Therapy session with Dr. ${doctor.name} on ${selectedDate} at ${selectedTime}`
//       };

//       // Send STK push request
//       const response = await axios.post('http://localhost:8000/api/mpesa/initiate', paymentData, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       // Navigate to confirmation or handle response
//       navigate('/confirmation', {
//         state: {
//           doctor,
//           amount: sessionFee,
//           date: selectedDate,
//           time: selectedTime,
//           transactionId: response.data.CheckoutRequestID || 'N/A'
//         }
//       });
//     } catch (error) {
//       // Handle network or API errors
//       if (axios.isAxiosError(error)) {
//         setPaymentError(
//           error.response?.data?.message || 
//           error.message || 
//           "Payment failed. Please try again."
//         );
//       } else {
//         setPaymentError("An unexpected error occurred");
//       }
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const getDisplayPhone = () => {
//     if (!phoneNumber) return "";
//     return phoneFormat === "254" ? phoneNumber : `254${phoneNumber.substring(1)}`;
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 my-8 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Complete Your Booking</h2>
      
//       <div className="mb-6 p-4 bg-green-50 rounded-lg">
//         <div className="flex items-center mb-3">
//           <FaUserMd className="text-green-600 mr-3" size={20} />
//           <div>
//             <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
//             <p className="text-sm text-gray-600">{doctor.specialty}</p>
//           </div>
//         </div>
//         <div className="flex justify-between text-sm">
//           <div className="flex items-center text-gray-600">
//             <FaCalendarAlt className="mr-2" />
//             <span>KES {sessionFee.toLocaleString()}</span>
//           </div>
//           <div className="flex items-center text-gray-600">
//             <FaClock className="mr-2" />
//             <span>2-hour session</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
//           <div className="relative">
//             <input
//               type="date"
//               min={new Date().toISOString().split('T')[0]}
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               required
//               title="Select a session date"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
//           <select
//             title="Select a time slot"
//             value={selectedTime}
//             onChange={(e) => setSelectedTime(e.target.value)}
//             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             required
//           >
//             <option value="">Select a time slot</option>
//             {timeSlots.map((slot, index) => (
//               <option key={index} value={slot}>{slot}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             M-Pesa Number
//             <span className="ml-2 text-xs text-gray-500">
//               (Currently using {phoneFormat} format)
//             </span>
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-gray-500">+</span>
//             </div>
//             <input
//               type="tel"
//               value={phoneNumber}
//               onChange={handlePhoneChange}
//               placeholder={phoneFormat === "254" ? "254XXXXXXXXX" : "07XXXXXXXX"}
//               className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               maxLength={phoneFormat === "254" ? 12 : 10}
//               required
//             />
//             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//               <FaMobileAlt className="text-gray-400" />
//             </div>
//           </div>
//           <div className="mt-1 text-xs text-gray-500">
//             {phoneNumber && (
//               <span>Will process as: +{getDisplayPhone()}</span>
//             )}
//             {!phoneNumber && (
//               <span>Enter number in 254XXXXXXXXX or 07XXXXXXXX format</span>
//             )}
//           </div>
//         </div>

//         {paymentError && (
//           <div className="text-red-500 text-sm mt-2">{paymentError}</div>
//         )}

//         <button
//           onClick={handlePayment}
//           disabled={isProcessing}
//           className={`w-full py-3 text-white rounded-lg shadow-md mt-4 flex items-center justify-center ${
//             isProcessing ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//           }`}
//         >
//           {isProcessing ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : (
//             <>
//               <FaLock className="mr-2" /> Pay KES {sessionFee.toLocaleString()} via M-Pesa
//             </>
//           )}
//         </button>

//         <div className="text-xs text-gray-500 mt-4 flex items-center">
//           <FaLock className="mr-2 text-green-500" />
//           Your payment is secure and encrypted
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookPayment;



import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMobileAlt, FaLock, FaUserMd } from "react-icons/fa";

const BookPayment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { doctor = null, sessionFee = 0, date = "", time = "" } = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [phoneFormat, setPhoneFormat] = useState<"254" | "07">("07");

  if (!doctor) {
    navigate('/');
    return null;
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    
    if (value.startsWith('254')) {
      setPhoneFormat("254");
      setPhoneNumber(value.slice(0, 12));
    } else if (value.startsWith('0')) {
      setPhoneFormat("07");
      setPhoneNumber(value.slice(0, 10));
    } else {
      setPhoneFormat("07");
      setPhoneNumber(value.slice(0, 10));
    }
  };

  const handlePayment = async () => {
    setPaymentError("");

    if (!phoneNumber.trim()) {
      setPaymentError("Please enter your phone number");
      return;
    }

    if (phoneFormat === "254" && !/^254[17]\d{8}$/.test(phoneNumber)) {
      setPaymentError("Please enter a valid 254 format number (254XXXXXXXXX)");
      return;
    }

    if (phoneFormat === "07" && !/^(07|01)\d{8}$/.test(phoneNumber)) {
      setPaymentError("Please enter a valid Kenyan number (07XXXXXXXX or 01XXXXXXXX)");
      return;
    }

    setIsProcessing(true);

    try {
      const formattedPhone = phoneFormat === "07" 
        ? `254${phoneNumber.substring(1)}` 
        : phoneNumber;

      const paymentData = {
        phoneNumber: formattedPhone,
        amount: sessionFee,
        referenceCode: `THERAPY-${doctor.name.split(' ')[1] || 'SESSION'}`,
        description: `Therapy session with Dr. ${doctor.name}`
      };

      const response = await axios.post('http://localhost:8000/api/mpesa/initiate', paymentData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      navigate('/confirmation', {
        state: {
          doctor,
          amount: sessionFee,
          date,
          time,
          transactionId: response.data.CheckoutRequestID || 'N/A'
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPaymentError(
          error.response?.data?.message || 
          error.message || 
          "Payment failed. Please try again."
        );
      } else {
        setPaymentError("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getDisplayPhone = () => {
    if (!phoneNumber) return "";
    return phoneFormat === "254" ? phoneNumber : `254${phoneNumber.substring(1)}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 my-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Complete Payment</h2>
      
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center mb-3">
          <FaUserMd className="text-green-600 mr-3" size={20} />
          <div>
            <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
            <p className="text-sm text-gray-600">{doctor.specialty}</p>
          </div>
        </div>
        <div className="space-y-2">
          {date && <p><strong>Date:</strong> {date}</p>}
          {time && <p><strong>Time:</strong> {time}</p>}
          <p className="text-lg font-bold">KES {sessionFee.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            M-Pesa Number
            <span className="ml-2 text-xs text-gray-500">
              (Currently using {phoneFormat} format)
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">+</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={phoneFormat === "254" ? "254XXXXXXXXX" : "07XXXXXXXX"}
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              maxLength={phoneFormat === "254" ? 12 : 10}
              required
              aria-label="M-Pesa phone number"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <FaMobileAlt className="text-gray-400" />
            </div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {phoneNumber && (
              <span>Will process as: +{getDisplayPhone()}</span>
            )}
            {!phoneNumber && (
              <span>Enter number in 254XXXXXXXXX or 07XXXXXXXX format</span>
            )}
          </div>
        </div>

        {paymentError && (
          <div className="text-red-500 text-sm mt-2">{paymentError}</div>
        )}

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-3 text-white rounded-lg shadow-md mt-4 flex items-center justify-center ${
            isProcessing ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
          }`}
          aria-label="Complete payment"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <FaLock className="mr-2" /> Pay KES {sessionFee.toLocaleString()} via M-Pesa
            </>
          )}
        </button>

        <div className="text-xs text-gray-500 mt-4 flex items-center">
          <FaLock className="mr-2 text-green-500" />
          Your payment is secure and encrypted
        </div>
      </div>
    </div>
  );
};

export default BookPayment;
