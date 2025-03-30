// // BookSession.tsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import dayjs from "dayjs";

// interface Therapist {
//   id: number;
//   full_name: string;
//   specialization: string;
//   experience_years: number;
//   contact_phone: string;
//   availability: boolean;
// }

// interface BookingSlot {
//   therapistId: number;
//   date: string;
//   timeSlot: string;
//   userId: number;
//   bookedAt: string;
// }

// interface TimeSlot {
//   slot: string;
//   start: string;
//   end: string;
// }

// const BookSession: React.FC = () => {
//   const { therapistId: paramTherapistId } = useParams<{ therapistId: string }>();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // State declarations
//   const [therapists, setTherapists] = useState<Therapist[]>([]);
//   const [sessionNotes, setSessionNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isFetching, setIsFetching] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
//   const [bookedSlots, setBookedSlots] = useState<BookingSlot[]>([]);
//   const [currentTime, setCurrentTime] = useState(dayjs());

//   // All possible time slots with their full time range
//   const allTimeSlots: TimeSlot[] = [
//     { slot: "09:00-11:00", start: "09:00", end: "11:00" },
//     { slot: "11:00-13:00", start: "11:00", end: "13:00" },
//     { slot: "13:00-15:00", start: "13:00", end: "15:00" },
//     { slot: "15:00-17:00", start: "15:00", end: "17:00" }
//   ];

//   // Update current time every minute to handle slot expiration
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(dayjs());
//     }, 60000); // Update every minute

//     return () => clearInterval(timer);
//   }, []);

//   // Get user data from localStorage
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser).user : null;
//   const token = localStorage.getItem("token");

//   // Get therapist ID from URL params
//   const therapistId = paramTherapistId || searchParams.get("therapistId");
//   const therapistIdNum = therapistId ? Number(therapistId) : NaN;
//   const userIdNum = user ? Number(user.id) : NaN;

//   // Check if selected date is today
//   const isToday = selectedDate === currentTime.format("YYYY-MM-DD");

//   // Precise time slot filtering
//   const getAvailableTimeSlots = (): string[] => {
//     if (!isToday) return allTimeSlots.map(ts => ts.slot);
    
//     return allTimeSlots
//       .filter(timeSlotObj => {
//         // Parse start and end times for the current slot
//         const [startHour, startMinute] = timeSlotObj.start.split(':').map(Number);
//         const [endHour, endMinute] = timeSlotObj.end.split(':').map(Number);

//         // Create full datetime objects for comparison
//         const slotStartTime = dayjs(selectedDate)
//           .hour(startHour)
//           .minute(startMinute);
        
//         const slotEndTime = dayjs(selectedDate)
//           .hour(endHour)
//           .minute(endMinute);
        
//         // Check if the entire slot is in the future
//         // Return true if either start or end time is after current time
//         return slotStartTime.isAfter(currentTime) || 
//                slotEndTime.isAfter(currentTime);
//       })
//       .map(ts => ts.slot);
//   };

//   const availableTimeSlots = getAvailableTimeSlots();

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         // Load booked slots from localStorage
//         const storedBookings = localStorage.getItem("bookedSlots");
//         if (storedBookings) {
//           const parsedBookings = JSON.parse(storedBookings);
//           if (Array.isArray(parsedBookings)) {
//             setBookedSlots(parsedBookings);
//           }
//         }

//         if (!token) throw new Error("Please log in to book a session.");
//         if (isNaN(therapistIdNum) || therapistIdNum <= 0) throw new Error("Invalid therapist ID.");
//         if (isNaN(userIdNum) || userIdNum <= 0) throw new Error("Invalid user ID. Please log in again.");

//         setIsFetching(true);
//         const response = await fetch("http://localhost:8000/api/therapists", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch therapists. Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setTherapists(data);
//         localStorage.setItem("therapists", JSON.stringify(data));
//       } catch (err) {
//         console.error("Initialization error:", err);
//         setError(err instanceof Error ? err.message : "Initialization failed");
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     loadInitialData();
//   }, [token, therapistIdNum, userIdNum]);

//   const isSlotBooked = (date: string, timeSlot: string): boolean => {
//     return bookedSlots.some(
//       slot => 
//         slot.therapistId === therapistIdNum && 
//         slot.date === date && 
//         slot.timeSlot === timeSlot
//     );
//   };

//   const handleConfirmBooking = async () => {
//     try {
//       if (!selectedTimeSlot) throw new Error("Please select a time slot");
      
//       if (isSlotBooked(selectedDate, selectedTimeSlot)) {
//         throw new Error("This time slot is already booked");
//       }

//       // Additional check to prevent booking passed slots
//       if (!availableTimeSlots.includes(selectedTimeSlot)) {
//         throw new Error("Cannot book a time slot that has already passed");
//       }

//       setLoading(true);
//       setError(null);

//       const [startTime] = selectedTimeSlot.split('-');
//       const bookingData = {
//         user_id: userIdNum,
//         therapist_id: therapistIdNum,
//         session_date: `${selectedDate} ${startTime}:00`,
//         booking_status: "Booked",
//         session_notes: sessionNotes,
//       };

//       const response = await fetch("http://localhost:8000/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(bookingData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to book session.");
//       }

//       // Update local storage with new booking
//       const newBooking: BookingSlot = {
//         therapistId: therapistIdNum,
//         date: selectedDate,
//         timeSlot: selectedTimeSlot,
//         userId: userIdNum,
//         bookedAt: currentTime.toISOString()
//       };

//       const updatedBookings = [...bookedSlots, newBooking];
//       setBookedSlots(updatedBookings);
//       localStorage.setItem("bookedSlots", JSON.stringify(updatedBookings));

//       // Navigate to payment
//       navigate("/book-payment", {
//         state: {
//           doctor: therapist,
//           date: selectedDate,
//           time: selectedTimeSlot,
//           sessionFee: 1500,
//           bookingData: await response.json()
//         }
//       });

//     } catch (err) {
//       console.error("Booking error:", err);
//       setError(err instanceof Error ? err.message : "Booking failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Error and loading states
//   if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
//   if (isFetching) return <div className="text-center mt-10">Loading therapists...</div>;

//   // Find selected therapist
//   const therapist = therapists.find((doc) => doc.id === therapistIdNum);
//   if (!therapist) return <div className="text-center mt-10 text-red-500">Therapist not found.</div>;

//   return (
//     <div className="max-w-lg mx-auto p-5 mt-10 border rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-center mb-4">Confirm Booking</h2>

//       {error && <div className="text-red-500 text-center mb-4">{error}</div>}

//       <div className="p-4 bg-gray-100 rounded-lg">
//         <p><strong>Doctor:</strong> {therapist.full_name}</p>
//         <p><strong>Specialization:</strong> {therapist.specialization}</p>
//         <p><strong>Experience:</strong> {therapist.experience_years} years</p>
//         <p><strong>Contact:</strong> {therapist.contact_phone}</p>
//         <p><strong>Availability:</strong> Available ✅</p>
//       </div>

//       <div className="mt-4">
//         <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-700 mb-1">
//           Session Date
//         </label>
//         <input
//           id="sessionDate"
//           type="date"
//           min={dayjs().format("YYYY-MM-DD")}
//           value={selectedDate}
//           onChange={(e) => {
//             setSelectedDate(e.target.value);
//             setSelectedTimeSlot("");
//           }}
//           className="w-full p-2 border rounded text-sm"
//           aria-label="Select session date"
//         />
//       </div>

//       <div className="mt-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Available Time Slots
//         </label>
//         <div className="grid grid-cols-2 gap-2">
//           {availableTimeSlots.map((slot) => {
//             const isBooked = isSlotBooked(selectedDate, slot);
            
//             return (
//               <button
//                 key={slot}
//                 type="button"
//                 onClick={() => !isBooked && setSelectedTimeSlot(slot)}
//                 className={`p-2 border rounded text-sm ${
//                   selectedTimeSlot === slot
//                     ? 'bg-green-500 text-white'
//                     : isBooked
//                     ? 'bg-red-200 text-red-800 cursor-not-allowed'
//                     : 'hover:bg-gray-100'
//                 }`}
//                 disabled={isBooked}
//                 aria-label={`Time slot ${slot}${isBooked ? ' (Booked)' : ''}`}
//               >
//                 {slot} 
//                 {isBooked && ' (Booked)'}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="mt-4">
//         <label htmlFor="sessionNotes" className="block text-sm font-medium text-gray-700 mb-1">
//           Session Notes (Optional)
//         </label>
//         <textarea
//           id="sessionNotes"
//           className="w-full p-2 border rounded text-sm"
//           placeholder="Enter any notes about your session"
//           value={sessionNotes}
//           onChange={(e) => setSessionNotes(e.target.value)}
//           aria-label="Session notes"
//         />
//       </div>

//       <button
//         className={`w-full mt-4 py-2 rounded transition-colors ${
//           loading
//             ? 'bg-gray-400 cursor-not-allowed'
//             : selectedTimeSlot
//             ? 'bg-green-500 hover:bg-green-600 text-white'
//             : 'bg-gray-300 cursor-not-allowed text-gray-500'
//         }`}
//         onClick={handleConfirmBooking}
//         disabled={loading || !selectedTimeSlot}
//         aria-label={loading ? "Processing booking" : "Continue to payment"}
//       >
//         {loading ? "Processing..." : "Continue to Payment"}
//       </button>
//     </div>
//   );
// };

// export default BookSession;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useSearchParams } from "react-router-dom";
// import dayjs from "dayjs";

// interface Therapist {
//   id: number;
//   full_name: string;
//   specialization: string;
//   experience_years: number;
//   contact_phone: string;
//   availability: boolean;
// }

// interface BookingSlot {
//   therapistId: number;
//   date: string;
//   timeSlot: string;
//   userId: number;
//   bookedAt: string;
// }

// const BookSession: React.FC = () => {
//   const { therapistId: paramTherapistId } = useParams<{ therapistId: string }>();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // State declarations
//   const [therapists, setTherapists] = useState<Therapist[]>([]);
//   const [sessionNotes, setSessionNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isFetching, setIsFetching] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
//   const [bookedSlots, setBookedSlots] = useState<BookingSlot[]>([]);
//   const [currentTime, setCurrentTime] = useState(dayjs());

//   // All possible time slots
//   const allTimeSlots = ["09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00"];

//   // Update current time every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(dayjs());
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   // Get user data from localStorage
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser).user : null;
//   const token = localStorage.getItem("token");

//   // Get therapist ID from URL params
//   const therapistId = paramTherapistId || searchParams.get("therapistId");
//   const therapistIdNum = therapistId ? Number(therapistId) : NaN;
//   const userIdNum = user ? Number(user.id) : NaN;

//   // Check if selected date is today
//   const isToday = selectedDate === currentTime.format("YYYY-MM-DD");

//   // Filter time slots based on current time for today, or show all for future dates
//   const getAvailableTimeSlots = () => {
//     if (!isToday) return allTimeSlots;

//     const currentTotalMinutes = currentTime.hour() * 60 + currentTime.minute();

//     return allTimeSlots.filter(slot => {
//       const [startTime] = slot.split('-');
//       const [startHour, startMinute] = startTime.split(':').map(Number);
//       const slotStartMinutes = startHour * 60 + startMinute;
      
//       // Only show slots that start in the future for today
//       return currentTotalMinutes < slotStartMinutes;
//     });
//   };

//   const availableTimeSlots = getAvailableTimeSlots();

//   // Check if a slot is booked
//   const isSlotBooked = (date: string, timeSlot: string) => {
//     return bookedSlots.some(
//       slot => 
//         slot.therapistId === therapistIdNum && 
//         slot.date === date && 
//         slot.timeSlot === timeSlot
//     );
//   };

//   // Load initial data
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         // Load booked slots from localStorage
//         const storedBookings = localStorage.getItem("bookedSlots");
//         if (storedBookings) {
//           const parsedBookings = JSON.parse(storedBookings);
//           if (Array.isArray(parsedBookings)) {
//             setBookedSlots(parsedBookings);
//           }
//         }

//         if (!token) throw new Error("Please log in to book a session.");
//         if (isNaN(therapistIdNum)) throw new Error("Invalid therapist ID.");
//         if (isNaN(userIdNum)) throw new Error("Invalid user ID.");

//         setIsFetching(true);
//         const response = await fetch("http://localhost:8000/api/therapists", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!response.ok) throw new Error("Failed to fetch therapists.");
//         const data = await response.json();
//         setTherapists(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Initialization failed");
//       } finally {
//         setIsFetching(false);
//       }
//     };

//     loadInitialData();
//   }, [token, therapistIdNum, userIdNum]);

//   // Handle booking confirmation
//   const handleConfirmBooking = async () => {
//     try {
//       if (!selectedTimeSlot) throw new Error("Please select a time slot");
//       if (isSlotBooked(selectedDate, selectedTimeSlot)) {
//         throw new Error("This time slot is already booked");
//       }

//       setLoading(true);
//       setError(null);

//       const [startTime] = selectedTimeSlot.split('-');
//       const bookingData = {
//         user_id: userIdNum,
//         therapist_id: therapistIdNum,
//         session_date: `${selectedDate} ${startTime}:00`,
//         booking_status: "Booked",
//         session_notes: sessionNotes,
//       };

//       const response = await fetch("http://localhost:8000/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(bookingData),
//       });

//       if (!response.ok) throw new Error("Failed to book session.");

//       // Update local storage
//       const newBooking: BookingSlot = {
//         therapistId: therapistIdNum,
//         date: selectedDate,
//         timeSlot: selectedTimeSlot,
//         userId: userIdNum,
//         bookedAt: currentTime.toISOString()
//       };

//       const updatedBookings = [...bookedSlots, newBooking];
//       setBookedSlots(updatedBookings);
//       localStorage.setItem("bookedSlots", JSON.stringify(updatedBookings));

//       navigate("/book-payment", {
//         state: {
//           doctor: therapists.find(doc => doc.id === therapistIdNum),
//           date: selectedDate,
//           time: selectedTimeSlot,
//           sessionFee: 1500,
//           bookingData: await response.json()
//         }
//       });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Booking failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
//   if (isFetching) return <div className="text-center mt-10">Loading...</div>;

//   const therapist = therapists.find((doc) => doc.id === therapistIdNum);
//   if (!therapist) return <div className="text-center mt-10 text-red-500">Therapist not found.</div>;

//   return (
//     <div className="max-w-lg mx-auto p-5 mt-10 border rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-center mb-4">Book Session</h2>

//       {error && <div className="text-red-500 text-center mb-4">{error}</div>}

//       <div className="p-4 bg-gray-100 rounded-lg mb-4">
//         <p><strong>Therapist:</strong> {therapist.full_name}</p>
//         <p><strong>Specialization:</strong> {therapist.specialization}</p>
//         <p><strong>Experience:</strong> {therapist.experience_years} years</p>
//         <p><strong>Current Time:</strong> {currentTime.format('YYYY-MM-DD HH:mm')}</p>
//       </div>

//       <div className="mb-4">
//         <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-700 mb-1">
//           Session Date
//         </label>
//         <input
//           id="sessionDate"
//           type="date"
//           min={dayjs().format("YYYY-MM-DD")}
//           value={selectedDate}
//           onChange={(e) => {
//             setSelectedDate(e.target.value);
//             setSelectedTimeSlot("");
//           }}
//           className="w-full p-2 border rounded"
//         />
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Available Time Slots
//         </label>
//         <div className="grid grid-cols-2 gap-2">
//           {availableTimeSlots.map((slot) => {
//             const isBooked = isSlotBooked(selectedDate, slot);
            
//             return (
//               <button
//                 key={slot}
//                 type="button"
//                 onClick={() => !isBooked && setSelectedTimeSlot(slot)}
//                 className={`p-2 border rounded text-sm ${
//                   selectedTimeSlot === slot
//                     ? 'bg-green-500 text-white'
//                     : isBooked
//                     ? 'bg-red-200 text-red-800 cursor-not-allowed'
//                     : 'hover:bg-gray-100'
//                 }`}
//                 disabled={isBooked}
//                 aria-label={`Time slot ${slot}${isBooked ? ' (Booked)' : ''}`}
//               >
//                 {slot} {isBooked && '(Booked)'}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="mb-4">
//         <label htmlFor="sessionNotes" className="block text-sm font-medium text-gray-700 mb-1">
//           Session Notes (Optional)
//         </label>
//         <textarea
//           id="sessionNotes"
//           className="w-full p-2 border rounded"
//           placeholder="Any special requests or notes"
//           value={sessionNotes}
//           onChange={(e) => setSessionNotes(e.target.value)}
//         />
//       </div>

//       <button
//         onClick={handleConfirmBooking}
//         disabled={loading || !selectedTimeSlot}
//         className={`w-full py-2 rounded text-white ${
//           loading || !selectedTimeSlot
//             ? 'bg-gray-400 cursor-not-allowed'
//             : 'bg-blue-600 hover:bg-blue-700'
//         }`}
//       >
//         {loading ? 'Processing...' : 'Confirm Booking'}
//       </button>
//     </div>
//   );
// };

// export default BookSession;




import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  experience_years: number;
  contact_phone: string;
  created_at: string;
  updated_at: string;
  session_fee?: number;
  image_url?: string;
  bio?: string;
}

interface Booking {
  id: number;
  user_id: number;
  therapist_id: number;
  session_date: string;
  booking_status: string;
  session_notes: string;
}

const BookSession: React.FC = () => {
  const { therapistId: paramTherapistId } = useParams<{ therapistId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessionNotes, setSessionNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(dayjs());

  const allTimeSlots = ["09:00", "11:00", "13:00", "15:00"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser).user : null;
  const token = localStorage.getItem("token");

  const therapistId = paramTherapistId || searchParams.get("therapistId");
  const therapistIdNum = therapistId ? Number(therapistId) : NaN;
  const userIdNum = user ? Number(user.id) : NaN;

  const isToday = selectedDate === currentTime.format("YYYY-MM-DD");

  const timeSlotToTimestamp = (date: string, time: string) => {
    return dayjs(`${date} ${time}`).toISOString();
  };

  const isTherapistBooked = (therapistId: number, date: string, timeSlot: string) => {
    const slotStart = timeSlotToTimestamp(date, timeSlot);
    const slotEnd = dayjs(`${date} ${timeSlot}`).add(2, 'hour').toISOString();

    return bookings.some(booking => {
      const bookingTime = dayjs(booking.session_date);
      return (
        booking.therapist_id === therapistId &&
        booking.booking_status === "Booked" &&
        bookingTime.isAfter(slotStart) &&
        bookingTime.isBefore(slotEnd)
      );
    });
  };

  const getAvailableTimeSlots = () => {
    let slots = [...allTimeSlots];

    if (isToday) {
      const currentHour = currentTime.hour();
      const currentMinute = currentTime.minute();
      
      slots = slots.filter(slot => {
        const [hour, minute] = slot.split(':').map(Number);
        return hour > currentHour || (hour === currentHour && minute > currentMinute);
      });
    }

    return slots.filter(slot => 
      !isTherapistBooked(therapistIdNum, selectedDate, slot)
    );
  };

  const availableTimeSlots = getAvailableTimeSlots();

  const formatTherapistName = (name: string) => {
    if (!name.startsWith("Dr ") && !name.startsWith("Dr. ")) {
      return `Dr. ${name}`;
    }
    return name;
  };

  // Assign appropriate session fees and bios based on specialization
  const getTherapistDetails = (therapist: Therapist) => {
    const specialties: Record<string, { fee: number; bio: string }> = {
      "Physiotherapist": {
        fee: 3500,
        bio: "Specializes in physical rehabilitation and pain management"
      },
      // Add more specializations as needed
    };

    const defaultDetails = {
      fee: 3000,
      bio: `Certified ${therapist.specialization} with ${therapist.experience_years} years of experience`
    };

    return specialties[therapist.specialization] || defaultDetails;
  };

  const getTherapistImage = (id: number) => {
    const images = [
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/68.jpg",
      "https://randomuser.me/api/portraits/men/75.jpg",
    ];
    return images[id % images.length];
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!token) throw new Error("Please log in to book a session.");
        if (isNaN(therapistIdNum)) throw new Error("Invalid therapist ID.");
        if (isNaN(userIdNum)) throw new Error("Invalid user ID.");

        setIsFetching(true);
        
        const therapistsResponse = await fetch("http://localhost:8000/api/therapists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!therapistsResponse.ok) throw new Error("Failed to fetch therapists.");
        
        const bookingsResponse = await fetch("http://localhost:8000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings.");

        const [therapistsData, bookingsData] = await Promise.all([
          therapistsResponse.json(),
          bookingsResponse.json()
        ]);

        const processedTherapists = therapistsData.map((therapist: Therapist) => {
          const details = getTherapistDetails(therapist);
          return {
            ...therapist,
            session_fee: details.fee,
            bio: details.bio,
            full_name: formatTherapistName(therapist.full_name),
            image_url: getTherapistImage(therapist.id)
          };
        });

        setTherapists(processedTherapists);
        setBookings(bookingsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Initialization failed");
      } finally {
        setIsFetching(false);
      }
    };

    loadInitialData();
  }, [token, therapistIdNum, userIdNum]);

  const handleConfirmBooking = async () => {
    try {
      if (!selectedTimeSlot) {
        throw new Error("Please select a time slot");
      }
      if (isTherapistBooked(therapistIdNum, selectedDate, selectedTimeSlot)) {
        throw new Error("This time slot is already booked");
      }

      setLoading(true);
      setError(null);

      const therapist = therapists.find(t => t.id === therapistIdNum);
      const bookingData = {
        user_id: userIdNum,
        therapist_id: therapistIdNum,
        session_date: timeSlotToTimestamp(selectedDate, selectedTimeSlot),
        booking_status: "Booked",
        session_notes: sessionNotes,
        session_fee: therapist?.session_fee || 3500
      };

      const response = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error("Failed to book session.");

      const newBooking = await response.json();
      setBookings([...bookings, newBooking]);

      navigate("/book-payment", {
        state: {
          doctor: therapists.find(doc => doc.id === therapistIdNum),
          date: selectedDate,
          time: selectedTimeSlot,
          sessionFee: therapist?.session_fee || 3500,
          bookingData: newBooking
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (isFetching) return <div className="text-center mt-10">Loading...</div>;

  const therapist = therapists.find((doc) => doc.id === therapistIdNum);
  if (!therapist) return <div className="text-center mt-10 text-red-500">Therapist not found.</div>;

  return (
    <div className="max-w-lg mx-auto p-5 mt-10 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Book Session</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="flex items-start mb-6">
        <img 
          src={therapist.image_url} 
          alt={therapist.full_name}
          className="w-20 h-20 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="text-lg font-semibold">{therapist.full_name}</h3>
          <p className="text-gray-600">{therapist.specialization}</p>
          <p className="text-sm text-gray-500">{therapist.experience_years} years experience</p>
          <p className="text-sm font-semibold text-green-600 mt-1">
            KES {therapist.session_fee} / session
          </p>
          <p className="text-sm mt-1">{therapist.bio}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg mb-4">
        <p><strong>Current Time:</strong> {currentTime.format('YYYY-MM-DD HH:mm')}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="sessionDate" className="block text-sm font-medium text-gray-700 mb-1">
          Session Date
        </label>
        <input
          id="sessionDate"
          type="date"
          min={dayjs().format("YYYY-MM-DD")}
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTimeSlot("");
          }}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Available Time Slots
        </label>
        <div className="grid grid-cols-2 gap-2">
          {allTimeSlots.map((slot) => {
            const isAvailable = availableTimeSlots.includes(slot);
            const isBooked = !isAvailable;
            
            return (
              <button
                key={slot}
                type="button"
                onClick={() => isAvailable && setSelectedTimeSlot(slot)}
                className={`p-2 border rounded text-sm ${
                  selectedTimeSlot === slot
                    ? 'bg-green-500 text-white'
                    : isBooked
                    ? 'bg-red-200 text-red-800 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                disabled={isBooked}
                aria-label={`Time slot ${slot}${isBooked ? ' (Booked)' : ''}`}
              >
                {slot}-{dayjs(`${selectedDate} ${slot}`).add(2, 'hour').format('HH:mm')} 
                {isBooked && ' (Booked)'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="sessionNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Session Notes (Optional)
        </label>
        <textarea
          id="sessionNotes"
          className="w-full p-2 border rounded"
          placeholder="Any special requests or notes"
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
        />
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={loading || !selectedTimeSlot}
        className={`w-full py-2 rounded text-white ${
          loading || !selectedTimeSlot
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </div>
  );
};

export default BookSession;