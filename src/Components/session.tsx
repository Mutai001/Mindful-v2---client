/* eslint-disable react-hooks/exhaustive-deps */
// // import React, { useState, useEffect, useCallback } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { FaCalendarAlt, FaClock, FaPlus, FaCheck } from "react-icons/fa";
// // import { toast } from "react-toastify";
// // import { BeatLoader } from "react-spinners";
// // import defaultDoctorImg from "../assets/images/Doc 1.webp";

// // interface Therapist {
// //   id: number;
// //   full_name: string;
// //   specialization: string;
// //   experience_years: number;
// //   contact_phone: string;
// //   role: string;
// //   session_fee?: number;
// //   image_url?: string;
// //   bio?: string;
// // }

// // interface TimeSlot {
// //   id?: number;
// //   therapist_id: number;
// //   date: string;
// //   start_time: string;
// //   end_time: string;
// //   is_booked: boolean;
// // }

// // interface WeekDay {
// //   date: string;
// //   displayDate: string;
// //   dayName: string;
// //   isToday: boolean;
// // }

// // const DEFAULT_TIME_SLOTS = [
// //   { start: "08:00", end: "10:00" },
// //   { start: "10:00", end: "12:00" },
// //   { start: "12:00", end: "14:00" },
// //   { start: "14:00", end: "16:00" },
// //   { start: "16:00", end: "18:00" }
// // ];

// // const SessionBooking: React.FC = () => {
// //   const navigate = useNavigate();
// //   const [therapists, setTherapists] = useState<Therapist[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
// //   const [showBookingModal, setShowBookingModal] = useState(false);
// //   const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
// //   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [creatingSlot, setCreatingSlot] = useState(false);
// //   const [newlyCreatedSlots, setNewlyCreatedSlots] = useState<number[]>([]);
// //   const [processingSlotId, setProcessingSlotId] = useState<string | null>(null);
// //   const [currentWeek, setCurrentWeek] = useState<WeekDay[]>([]);
// //   const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
// //   const [isLoadingSlots, setIsLoadingSlots] = useState(false);

// //   const getDefaultBio = (specialization: string, experience: number): string => {
// //     return `Specializes in ${specialization} with ${experience} years of experience`;
// //   };

// //   // Generate the current week days
// //   const generateWeekDays = useCallback((): WeekDay[] => {
// //     const today = new Date();
// //     const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
// //     // Calculate the date of the previous Sunday (start of week)
// //     const startOfWeek = new Date(today);
// //     startOfWeek.setDate(today.getDate() - currentDay);
    
// //     const weekDays: WeekDay[] = [];
    
// //     // Generate 7 days starting from Sunday
// //     for (let i = 0; i < 7; i++) {
// //       const date = new Date(startOfWeek);
// //       date.setDate(startOfWeek.getDate() + i);
      
// //       const isToday = date.toDateString() === today.toDateString();
// //       const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      
// //       weekDays.push({
// //         date: date.toISOString().split('T')[0], // YYYY-MM-DD format
// //         displayDate: date.getDate().toString(),
// //         dayName: dayNames[date.getDay()],
// //         isToday: isToday
// //       });
// //     }
    
// //     return weekDays;
// //   }, []);

// //   const handleSelectTherapist = async (therapist: Therapist): Promise<void> => {
// //     const user = JSON.parse(localStorage.getItem("user") || "{}");
// //     if (!user.id) {
// //       toast.error("Please login to book a session");
// //       navigate("/login");
// //       return;
// //     }
    
// //     setSelectedTherapist(therapist);
// //     setShowBookingModal(true);
// //     setAvailableSlots([]);
// //     setSelectedSlot(null);
// //     setNewlyCreatedSlots([]);
    
// //     // Generate the current week
// //     const weekDays = generateWeekDays();
// //     setCurrentWeek(weekDays);
    
// //     // Select today by default or the first day of the week if today is not in the week
// //     const today = weekDays.find(day => day.isToday) || weekDays[0];
// //     setSelectedDay(today);
    
// //     // Fetch all available slots for this therapist
// //     await fetchAllSlotsForTherapist(therapist.id);
// //   };

// //   const fetchTherapists = useCallback(async (): Promise<void> => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         throw new Error("Authentication required");
// //       }

// //       const response = await fetch("http://localhost:8000/api/users?role=therapist", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch therapists");
// //       }

// //       const data = await response.json();
      
// //       if (!Array.isArray(data)) {
// //         throw new Error("Invalid data format received from server");
// //       }

// //       const therapistUsers = data.filter((user: Therapist) => user.role === "therapist");
      
// //       const formattedTherapists = therapistUsers.map((therapist: Therapist) => ({
// //         ...therapist,
// //         full_name: therapist.full_name.startsWith("Dr. ") ? therapist.full_name : `Dr. ${therapist.full_name}`,
// //         session_fee: therapist.session_fee ?? 5000,
// //         bio: therapist.bio || getDefaultBio(therapist.specialization, therapist.experience_years),
// //         image_url: therapist.image_url || defaultDoctorImg
// //       }));

// //       setTherapists(formattedTherapists);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : "An unknown error occurred");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const fetchAllSlotsForTherapist = useCallback(async (therapistId: number): Promise<void> => {
// //     try {
// //       setIsLoadingSlots(true);
      
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         throw new Error("Authentication required");
// //       }

// //       // Get Sunday and Saturday dates of the current week
// //       const weekDays = generateWeekDays();
// //       const startDate = weekDays[0].date; // Sunday
// //       const endDate = weekDays[6].date;   // Saturday

// //       const response = await fetch(
// //         `http://localhost:8000/api/time-slots?therapist_id=${therapistId}&start_date=${startDate}&end_date=${endDate}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch available slots");
// //       }

// //       const data = await response.json();
// //       const slots: TimeSlot[] = Array.isArray(data) ? data : [];
// //       setAvailableSlots(slots);
      
// //     } catch (err) {
// //       toast.error(err instanceof Error ? err.message : "Failed to load available slots");
// //       setAvailableSlots([]);
// //     } finally {
// //       setIsLoadingSlots(false);
// //     }
// //   }, [generateWeekDays]);

// //   const handleDaySelection = (day: WeekDay): void => {
// //     setSelectedDay(day);
// //     setSelectedSlot(null);
// //   };

// //   const createTimeSlot = async (slot: TimeSlot): Promise<TimeSlot> => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       throw new Error("Authentication required");
// //     }

// //     const response = await fetch("http://localhost:8000/api/time-slots", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         ...slot,
// //         is_booked: false
// //       }),
// //     });

// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || "Failed to create time slot");
// //     }

// //     const createdSlot = await response.json();
// //     setNewlyCreatedSlots(prev => [...prev, createdSlot.id]);
// //     return createdSlot;
// //   };

// //   const bookTimeSlot = async (slotId: number): Promise<void> => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       throw new Error("Authentication required");
// //     }

// //     const response = await fetch(`http://localhost:8000/api/time-slots/${slotId}`, {
// //       method: "PATCH",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         is_booked: true
// //       }),
// //     });

// //     if (!response.ok) {
// //       throw new Error("Failed to book time slot");
// //     }
// //   };

// //   const isSlotInPast = (slotDate: string, slotTime: string): boolean => {
// //     const now = new Date();
// //     const slotDateTime = new Date(`${slotDate}T${slotTime}`);
// //     return slotDateTime < now;
// //   };

// //   const handleSlotSelection = async (slot: TimeSlot): Promise<void> => {
// //     if (!selectedTherapist?.id || !selectedDay) return;

// //     // If the slot already has an ID and is not in processing, just select it
// //     if (slot.id) {
// //       setSelectedSlot(slot);
// //       return;
// //     }

// //     // For default slots without an ID, we need to create them
// //     const slotKey = `${slot.start_time}-${slot.end_time}`;
// //     setProcessingSlotId(slotKey);
    
// //     try {
// //       setCreatingSlot(true);
      
// //       // Create new slot (this was a default generated slot)
// //       const newSlot = {
// //         therapist_id: selectedTherapist.id,
// //         date: selectedDay.date,
// //         start_time: slot.start_time,
// //         end_time: slot.end_time,
// //         is_booked: false
// //       };
      
// //       const createdSlot = await createTimeSlot(newSlot);
// //       setSelectedSlot(createdSlot);
// //       toast.success("New time slot created successfully");
      
// //       // Refresh the slots list to include the newly created slot
// //       await fetchAllSlotsForTherapist(selectedTherapist.id);
// //     } catch (error) {
// //       console.error("Error creating slot:", error);
// //       toast.error(error instanceof Error ? error.message : "Failed to create time slot");
// //     } finally {
// //       setCreatingSlot(false);
// //       setProcessingSlotId(null);
// //     }
// //   };

// //   const handleBookingSubmit = async (): Promise<void> => {
// //     if (!selectedTherapist || !selectedSlot || !selectedSlot.id) {
// //       toast.error("Please select a valid time slot");
// //       return;
// //     }

// //     const user = JSON.parse(localStorage.getItem("user") || "{}");
// //     if (!user.id) {
// //       toast.error("Please login to book a session");
// //       navigate("/login");
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       // First mark the slot as booked
// //       await bookTimeSlot(selectedSlot.id);

// //       const bookingData = {
// //         user_id: user.id,
// //         therapist_id: selectedTherapist.id,
// //         slot_id: selectedSlot.id,
// //         booking_status: "Pending"
// //       };

// //       const response = await fetch("http://localhost:8000/api/bookings", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //         body: JSON.stringify(bookingData),
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || "Booking failed. Please try again.");
// //       }

// //       const result = await response.json();
      
// //       // Update the local state to mark the slot as booked
// //       setAvailableSlots(prev => 
// //         prev.map(slot => 
// //           slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
// //         )
// //       );
      
// //       toast.success("Booking created successfully!");
// //       navigate('/book-payment', {
// //         state: {
// //           therapist: selectedTherapist,
// //           sessionFee: selectedTherapist.session_fee || 5000,
// //           bookingId: result.id,
// //           slotDetails: selectedSlot
// //         }
// //       });
// //     } catch (error) {
// //       console.error("Booking error:", error);
// //       toast.error(error instanceof Error ? error.message : "Booking failed. Please try again.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const generateDefaultSlots = (): TimeSlot[] => {
// //     if (!selectedTherapist?.id || !selectedDay) return [];
    
// //     // Get slots for the selected day
// //     const existingSlots = availableSlots.filter(slot => slot.date === selectedDay.date);
    
// //     // Generate default slots but filter out any that exist in availableSlots
// //     const existingStartTimes = existingSlots.map(slot => slot.start_time);
    
// //     return DEFAULT_TIME_SLOTS
// //       .filter(slot => !existingStartTimes.includes(slot.start))
// //       .map(slot => ({
// //         therapist_id: selectedTherapist.id,
// //         date: selectedDay.date,
// //         start_time: slot.start,
// //         end_time: slot.end,
// //         is_booked: false
// //       }))
// //       .filter(slot => !isSlotInPast(selectedDay.date, slot.start_time));
// //   };

// //   useEffect(() => {
// //     fetchTherapists();
// //   }, [fetchTherapists]);

// //   if (loading) {
// //     return (
// //       <div className="max-w-6xl mx-auto p-5 flex justify-center items-center h-64">
// //         <BeatLoader color="#2E7D32" size={15} />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="max-w-6xl mx-auto p-5 text-center text-red-500">
// //         {error}
// //       </div>
// //     );
// //   }

// //   // Get slots for the selected day
// //   const slotsForSelectedDay = selectedDay
// //     ? availableSlots.filter(slot => slot.date === selectedDay.date)
// //     : [];
  
// //   // Generate default slots that don't conflict with existing ones
// //   const defaultSlots = generateDefaultSlots();
  
// //   // Combine available slots from the API and default slots
// //   const allSlots = [...slotsForSelectedDay];
  
// //   // Only add default slots if they don't overlap with existing ones
// //   if (defaultSlots.length > 0) {
// //     allSlots.push(...defaultSlots);
// //   }
  
// //   // Sort slots by start time
// //   const slotsToDisplay = allSlots.sort((a, b) => 
// //     a.start_time.localeCompare(b.start_time)
// //   );

// //   return (
// //     <div className="max-w-6xl mx-auto p-5">
// //       <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Book a Therapy Session</h2>
      
// //       {therapists.length === 0 ? (
// //         <div className="text-center py-10 text-gray-500">
// //           No therapists available at the moment
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {therapists.map((therapist) => (
// //             <div key={`therapist-${therapist.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
// //               <div className="p-6">
// //                 <div className="flex items-center mb-4">
// //                   <img 
// //                     src={therapist.image_url || defaultDoctorImg}
// //                     alt={therapist.full_name} 
// //                     className="w-20 h-20 rounded-full object-cover mr-4 border-2 border-green-200"
// //                     onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
// //                       const target = e.target as HTMLImageElement;
// //                       target.src = defaultDoctorImg;
// //                     }}
// //                   />
// //                   <div>
// //                     <h3 className="text-xl font-semibold text-gray-800">{therapist.full_name}</h3>
// //                     <p className="text-green-600 font-medium">{therapist.specialization}</p>
// //                     <p className="text-gray-500 text-sm mt-1">KES {(therapist.session_fee || 5000).toLocaleString()} / session</p>
// //                   </div>
// //                 </div>
// //                 <p className="text-gray-600 mb-5 text-sm">{therapist.bio}</p>
// //                 <button
// //                   onClick={() => handleSelectTherapist(therapist)}
// //                   className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
// //                 >
// //                   <FaCalendarAlt className="mr-2" /> View Availability
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {showBookingModal && selectedTherapist && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 animate-fade-in">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-xl font-bold text-gray-800">
// //                 Book with {selectedTherapist.full_name}
// //               </h3>
// //               <button 
// //                 onClick={() => setShowBookingModal(false)}
// //                 className="text-gray-500 hover:text-gray-700"
// //                 aria-label="Close booking modal"
// //               >
// //                 ✕
// //               </button>
// //             </div>
            
// //             {/* Weekly Calendar */}
// //             <div className="mb-6">
// //               <h4 className="text-md font-medium text-gray-700 mb-2">Select Date</h4>
              
// //               {isLoadingSlots ? (
// //                 <div className="flex justify-center py-4">
// //                   <BeatLoader color="#2E7D32" size={10} />
// //                 </div>
// //               ) : (
// //                 <div className="grid grid-cols-7 gap-2">
// //                   {currentWeek.map((day) => (
// //                     <button
// //                       key={day.date}
// //                       type="button"
// //                       onClick={() => handleDaySelection(day)}
// //                       className={`py-2 px-1 rounded-lg text-center transition-colors ${
// //                         selectedDay?.date === day.date
// //                           ? 'bg-green-600 text-white'
// //                           : day.isToday
// //                           ? 'bg-green-100 border border-green-300 text-green-700'
// //                           : 'bg-gray-100 hover:bg-green-50 text-gray-700'
// //                       }`}
// //                     >
// //                       <div className="text-xs font-medium mb-1">
// //                         {day.dayName.substring(0, 3)}
// //                       </div>
// //                       <div className={`text-lg ${day.isToday ? 'font-bold' : ''}`}>
// //                         {day.displayDate}
// //                       </div>
// //                     </button>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {selectedDay && (
// //               <div className="mb-6">
// //                 <div className="flex justify-between items-center mb-2">
// //                   <h4 className="text-md font-medium text-gray-700">
// //                     Available Time Slots
// //                   </h4>
// //                   <span className="text-sm text-green-600 font-medium">
// //                     {new Date(selectedDay.date).toLocaleDateString('en-US', { 
// //                       weekday: 'long', 
// //                       year: 'numeric', 
// //                       month: 'long', 
// //                       day: 'numeric' 
// //                     })}
// //                   </span>
// //                 </div>
                
// //                 {isLoadingSlots ? (
// //                   <div className="text-center py-4">
// //                     <BeatLoader color="#2E7D32" size={10} />
// //                   </div>
// //                 ) : slotsToDisplay.length === 0 ? (
// //                   <div className="text-center py-4 text-gray-500">
// //                     No available slots for this date
// //                   </div>
// //                 ) : (
// //                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
// //                     {slotsToDisplay.map((slot) => {
// //                       const slotKey = slot.id ? `slot-${slot.id}` : `default-slot-${slot.start_time}-${slot.end_time}`;
// //                       const isNewlyCreated = slot.id ? newlyCreatedSlots.includes(slot.id) : false;
// //                       const isSelected = selectedSlot?.id === slot.id || 
// //                                         (!slot.id && selectedSlot?.start_time === slot.start_time);
// //                       const isBooked = slot.is_booked;
// //                       const isPast = isSlotInPast(selectedDay.date, slot.start_time);
// //                       const isProcessing = processingSlotId === `${slot.start_time}-${slot.end_time}`;
                      
// //                       return (
// //                         <button
// //                           key={slotKey}
// //                           type="button"
// //                           onClick={() => handleSlotSelection(slot)}
// //                           disabled={isBooked || creatingSlot || isPast || isProcessing}
// //                           className={`py-3 px-2 border rounded-lg transition-colors flex items-center justify-between ${
// //                             isSelected
// //                               ? 'bg-green-100 border-green-500 text-green-700'
// //                               : isBooked || isPast
// //                                 ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
// //                                 : 'border-gray-200 hover:bg-green-50'
// //                           }`}
// //                         >
// //                           <div className="flex items-center">
// //                             {isProcessing ? (
// //                               <BeatLoader color="#3B82F6" size={8} className="mr-1" />
// //                             ) : slot.id ? (
// //                               isNewlyCreated ? (
// //                                 <FaCheck className="mr-1 text-green-500" />
// //                               ) : (
// //                                 <FaClock className="mr-1" />
// //                               )
// //                             ) : (
// //                               <FaPlus className="mr-1" />
// //                             )}
// //                             <span className="text-sm">
// //                               {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
// //                             </span>
// //                           </div>
// //                           {isSelected ? (
// //                             <span className="text-green-600">✓</span>
// //                           ) : isBooked ? (
// //                             <span className="text-xs text-gray-500">Booked</span>
// //                           ) : isPast ? (
// //                             <span className="text-xs text-gray-500">Passed</span>
// //                           ) : null}
// //                         </button>
// //                       );
// //                     })}
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             <button
// //               onClick={handleBookingSubmit}
// //               disabled={isSubmitting || !selectedSlot}
// //               className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
// //                 isSubmitting || !selectedSlot
// //                   ? 'bg-green-400 cursor-not-allowed'
// //                   : 'bg-green-600 hover:bg-green-700'
// //               }`}
// //             >
// //               {isSubmitting ? (
// //                 <BeatLoader color="#ffffff" size={8} />
// //               ) : (
// //                 "Continue to Payment"
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SessionBooking;






// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCalendarAlt, FaClock, FaPhone, FaUserMd, FaMoneyBillWave } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { BeatLoader } from "react-spinners";
// import defaultDoctorImg from "../assets/images/Doc 1.webp";

// interface Therapist {
//   id: number;
//   full_name: string;
//   email: string;
//   contact_phone: string;
//   address: string;
//   role: string;
//   specialization: string;
//   experience_years: number;
//   profile_picture: string | null;
//   created_at: string;
//   updated_at: string;
//   session_fee?: number;
//   bio?: string;
// }

// interface TimeSlot {
//   id: number;
//   therapist_id: number;
//   date: string;
//   start_time: string;
//   end_time: string;
//   is_booked: boolean;
//   therapist: Therapist;
// }

// interface TimeSlotResponse {
//   message: string;
//   data: TimeSlot[];
// }

// interface WeekDay {
//   date: string;
//   displayDate: string;
//   dayName: string;
//   isToday: boolean;
// }

// interface TherapistWithSlots extends Therapist {
//   availableSlots: TimeSlot[];
//   image_url?: string;
// }

// interface BookingResponse {
//   success: boolean;
//   message: string;
//   data: {
//     id: number;
//     user_id: number;
//     therapist_id: number;
//     slot_id: number;
//     booking_status: string;
//   };
// }

// interface ErrorResponse {
//   error: string;
//   details?: string;
// }

// const SessionBooking: React.FC = () => {
//   const navigate = useNavigate();
//   const [therapists, setTherapists] = useState<TherapistWithSlots[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedTherapist, setSelectedTherapist] = useState<TherapistWithSlots | null>(null);
//   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentWeek, setCurrentWeek] = useState<WeekDay[]>([]);
//   const [selectedDay, setSelectedDay] = useState<WeekDay | null>(null);
//   const [expandedTherapistId, setExpandedTherapistId] = useState<number | null>(null);
//   const [loadingSlots, setLoadingSlots] = useState(false);

//   const getDefaultBio = (specialization: string, experience: number): string => {
//     return `Specializes in ${specialization} with ${experience} years of experience. Provides professional therapy sessions tailored to individual needs.`;
//   };

//   const generateWeekDays = useCallback((): WeekDay[] => {
//     const today = new Date();
//     const currentDay = today.getDay();
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - currentDay);
    
//     const weekDays: WeekDay[] = [];
    
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);
      
//       const isToday = date.toDateString() === today.toDateString();
//       const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      
//       weekDays.push({
//         date: date.toISOString().split('T')[0],
//         displayDate: date.getDate().toString(),
//         dayName: dayNames[date.getDay()],
//         isToday: isToday
//       });
//     }
    
//     return weekDays;
//   }, []);

//   const fetchTimeSlots = useCallback(async () => {
//     try {
//       setLoading(true);
//       setLoadingSlots(true);
//       setError(null);
      
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required");
//       }

//       const weekDays = generateWeekDays();
//       const startDate = weekDays[0].date;
//       const endDate = weekDays[6].date;

//       const response = await fetch(
//         `http://localhost:8000/api/time-slots?start_date=${startDate}&end_date=${endDate}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch time slots");
//       }

//       const responseData: TimeSlotResponse = await response.json();
//       const slots = responseData.data || [];

//       const formattedSlots = slots.map(slot => ({
//         ...slot,
//         start_time: slot.start_time.substring(0, 5),
//         end_time: slot.end_time.substring(0, 5)
//       }));

//       const uniqueTherapists: {[key: number]: TherapistWithSlots} = {};
      
//       formattedSlots.forEach(slot => {
//         const therapistId = slot.therapist.id;
        
//         if (!uniqueTherapists[therapistId]) {
//           const fullName = slot.therapist.full_name.startsWith("Dr.") || 
//                           slot.therapist.full_name.startsWith("DR") ? 
//                           slot.therapist.full_name : 
//                           `Dr. ${slot.therapist.full_name}`;
          
//           uniqueTherapists[therapistId] = {
//             ...slot.therapist,
//             full_name: fullName,
//             session_fee: 5000,
//             bio: getDefaultBio(slot.therapist.specialization, slot.therapist.experience_years),
//             image_url: slot.therapist.profile_picture || defaultDoctorImg,
//             availableSlots: []
//           };
//         }
        
//         uniqueTherapists[therapistId].availableSlots.push(slot);
//       });
      
//       setTherapists(Object.values(uniqueTherapists));
//       setCurrentWeek(weekDays);
//       setSelectedDay(weekDays.find(day => day.isToday) || weekDays[0]);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An unknown error occurred");
//       console.error("Error fetching time slots:", err);
//     } finally {
//       setLoading(false);
//       setLoadingSlots(false);
//     }
//   }, [generateWeekDays]);

//   const handleExpandTherapist = (therapist: TherapistWithSlots) => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!user.id) {
//       toast.error("Please login to book a session");
//       navigate("/login");
//       return;
//     }
    
//     if (expandedTherapistId === therapist.id) {
//       setExpandedTherapistId(null);
//       setSelectedTherapist(null);
//       setSelectedSlot(null);
//     } else {
//       setExpandedTherapistId(therapist.id);
//       setSelectedTherapist(therapist);
//       setSelectedSlot(null);
//     }
//   };

//   const handleDaySelection = (day: WeekDay): void => {
//     setSelectedDay(day);
//     setSelectedSlot(null);
//   };

//   const isSlotInPast = (slotDate: string, slotTime: string): boolean => {
//     const now = new Date();
//     const slotDateTime = new Date(`${slotDate}T${slotTime}`);
//     return slotDateTime < now;
//   };

//   const handleSlotSelection = (therapist: TherapistWithSlots, slot: TimeSlot): void => {
//     if (!slot.is_booked && !isSlotInPast(slot.date, slot.start_time)) {
//       setSelectedTherapist(therapist);
//       setSelectedSlot(slot);
//     }
//   };

//   const handleBookingSubmit = async () => {
//     if (!selectedTherapist || !selectedSlot) {
//       toast.error("Please select a time slot");
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!user.id) {
//       toast.error("Please login to book a session");
//       navigate("/login");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required");
//       }

//       // Create the booking
//       const bookingData = {
//         user_id: user.id,
//         therapist_id: selectedTherapist.id,
//         slot_id: selectedSlot.id,
//         booking_status: "Pending"
//       };

//       const bookingResponse = await fetch("http://localhost:8000/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(bookingData),
//       });

//       if (!bookingResponse.ok) {
//         const errorData: ErrorResponse = await bookingResponse.json();
//         if (bookingResponse.status === 409) {
//           // Slot is already booked, update local state
//           setTherapists(prevTherapists => 
//             prevTherapists.map(therapist => {
//               if (therapist.id === selectedTherapist.id) {
//                 return {
//                   ...therapist,
//                   availableSlots: therapist.availableSlots.map(slot => 
//                     slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
//                   )
//                 };
//               }
//               return therapist;
//             })
//           );
//           throw new Error(errorData.details || "This slot has already been booked");
//         }
//         throw new Error(errorData.error || "Failed to create booking");
//       }

//       const bookingResult: BookingResponse = await bookingResponse.json();
      
//       // Check if we have the booking data in the response
//       if (!bookingResult.success || !bookingResult.data?.id) {
//         console.error("Invalid booking response:", bookingResult);
//         throw new Error("Booking was created but no ID was returned. Please check your bookings.");
//       }
      
//       // Update local state to reflect the booking
//       setTherapists(prevTherapists => 
//         prevTherapists.map(therapist => {
//           if (therapist.id === selectedTherapist.id) {
//             return {
//               ...therapist,
//               availableSlots: therapist.availableSlots.map(slot => 
//                 slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
//               )
//             };
//           }
//           return therapist;
//         })
//       );
      
//       toast.success("Booking created successfully!");
      
//       // Create a simplified therapist object to pass to the payment component
//       const therapistData = {
//         id: selectedTherapist.id,
//         full_name: selectedTherapist.full_name,
//         specialization: selectedTherapist.specialization,
//         profile_picture: selectedTherapist.profile_picture,
//         image_url: selectedTherapist.image_url
//       };
      
//       // Create a simplified slot object to pass to the payment component
//       const slotData = {
//         id: selectedSlot.id,
//         date: selectedSlot.date,
//         start_time: selectedSlot.start_time,
//         end_time: selectedSlot.end_time
//       };
      
//       // Navigate to payment page with all necessary data including the booking ID
//       navigate('/book-payment', {
//         state: {
//           therapist: therapistData,
//           sessionFee: selectedTherapist.session_fee || 5000,
//           bookingId: bookingResult.data.id, // Use the correct path to the booking ID
//           slotDetails: slotData
//         }
//       });
      
//     } catch (error) {
//       console.error("Booking error:", error);
//       toast.error(error instanceof Error ? error.message : "Booking failed. Please try again.");
//       // Refresh slots to get latest status
//       fetchTimeSlots();
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const refreshSlots = () => {
//     fetchTimeSlots();
//   };

//   useEffect(() => {
//     fetchTimeSlots();
//   }, [fetchTimeSlots]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//         <BeatLoader color="#10B981" size={15} />
//         <p className="mt-4 text-green-600">Loading available therapists...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//         <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
//           <p className="text-gray-700 mb-6">{error}</p>
//           <button 
//             onClick={refreshSlots}
//             className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 md:p-6">
//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 border-b">
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//             <FaCalendarAlt className="mr-2 text-green-600" />
//             Book a Therapy Session
//           </h1>
//         </div>
      
//         {/* Date selector */}
//         <div className="p-6 bg-green-50 border-b">
//           <div className="mb-3">
//             <h2 className="text-lg font-medium text-gray-700 flex items-center">
//               <FaCalendarAlt className="mr-2 text-green-600" />
//               Select Date for Availability
//             </h2>
//           </div>

//           <div className="grid grid-cols-7 gap-2">
//             {currentWeek.map((day) => (
//               <button
//                 key={day.date}
//                 onClick={() => handleDaySelection(day)}
//                 className={`py-3 px-1 rounded-lg text-center transition-colors ${
//                   selectedDay?.date === day.date
//                     ? 'bg-green-600 text-white shadow-md'
//                     : day.isToday
//                     ? 'bg-green-100 border border-green-300 text-green-700'
//                     : 'bg-green-50 border border-green-200 hover:bg-green-100'
//                 }`}
//               >
//                 <div className="text-xs font-medium">
//                   {day.dayName.substring(0, 3)}
//                 </div>
//                 <div className="text-lg font-bold">
//                   {day.displayDate}
//                 </div>
//               </button>
//             ))}
//           </div>

//           {selectedDay && (
//             <div className="mt-4 flex justify-between items-center">
//               <p className="text-sm text-gray-600">
//                 Showing availability for: <span className="font-semibold text-green-700">
//                   {new Date(selectedDay.date).toLocaleDateString('en-US', { 
//                     weekday: 'long', 
//                     month: 'long', 
//                     day: 'numeric',
//                     year: 'numeric' 
//                   })}</span>
//               </p>
//               <button 
//                 onClick={refreshSlots}
//                 className="text-green-600 text-sm hover:text-green-700 flex items-center"
//               >
//                 <FaCalendarAlt className="mr-1" /> Refresh
//               </button>
//             </div>
//           )}
//         </div>
      
//         {/* Therapist listing */}
//         {therapists.length === 0 ? (
//           <div className="p-8 text-center">
//             <div className="mb-4 text-gray-600">
//               <p className="text-xl mb-4">No therapists available at the moment</p>
//             </div>
//             <button 
//               onClick={refreshSlots}
//               className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Refresh Availability
//             </button>
//           </div>
//         ) : (
//           <div className="p-4 space-y-4">
//             {therapists.map((therapist) => {
//               const slotsForSelectedDay = selectedDay
//                 ? therapist.availableSlots
//                     .filter(slot => slot.date === selectedDay.date)
//                     .sort((a, b) => a.start_time.localeCompare(b.start_time))
//                 : [];
              
//               const isExpanded = expandedTherapistId === therapist.id;
              
//               return (
//                 <div key={therapist.id} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
//                   {/* Therapist basic info */}
//                   <div 
//                     className="p-4 flex flex-col md:flex-row md:items-center cursor-pointer"
//                     onClick={() => handleExpandTherapist(therapist)}>
//                     <div className="md:w-1/5 flex justify-center mb-4 md:mb-0">
//                       <img 
//                         src={therapist.image_url} 
//                         alt={therapist.full_name} 
//                         className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-100"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.src = defaultDoctorImg;
//                         }}
//                       />
//                     </div>

//                     <div className="md:w-4/5 md:pl-6">
//                       <div className="flex justify-between items-center mb-2">
//                         <h2 className="text-xl font-bold text-gray-800">
//                           {therapist.full_name}
//                         </h2>
//                         <button className="text-sm text-green-600 hover:text-green-700">
//                           {isExpanded ? 'Hide Details' : 'View Details'}
//                         </button>
//                       </div>

//                       <p className="text-green-700 font-medium mb-3">{therapist.specialization}</p>

//                       <div className="flex flex-wrap gap-3 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <FaUserMd className="mr-1 text-green-500" />
//                           {therapist.experience_years} years exp.
//                         </div>

//                         <div className="flex items-center">
//                           <FaPhone className="mr-1 text-green-500" />
//                           {therapist.contact_phone}
//                         </div>

//                         <div className="flex items-center">
//                           <FaMoneyBillWave className="mr-1 text-green-500" />
//                           KES {(therapist.session_fee || 5000).toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expanded details section */}
//                   {isExpanded && (
//                     <div className="border-t px-4 py-5">
//                       <div className="mb-6 bg-green-50 p-4 rounded-lg">
//                         <h3 className="text-lg font-bold text-gray-800 mb-2">
//                           <FaUserMd className="inline-block mr-2 text-green-600" />
//                           About {therapist.full_name}
//                         </h3>
//                         <p className="text-gray-600">{therapist.bio}</p>
//                       </div>
                      
//                       <div className="mb-4">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                           <FaClock className="mr-2 text-green-600" />
//                           Available Slots for {selectedDay?.dayName || 'Today'}
//                         </h3>
//                       </div>
                      
//                       {loadingSlots ? (
//                         <div className="text-center py-4">
//                           <BeatLoader color="#10B981" size={10} />
//                         </div>
//                       ) : slotsForSelectedDay.length === 0 ? (
//                         <div className="text-center py-4 bg-gray-50 rounded-lg">
//                           <p className="text-gray-500 mb-2">No available slots for this date</p>
//                           <button 
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               refreshSlots();
//                             }}
//                             className="text-green-600 underline text-sm hover:text-green-700"
//                           >
//                             Refresh availability
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
//                           {slotsForSelectedDay.map((slot) => {
//                             const isSlotSelected = selectedSlot?.id === slot.id;
//                             const isBooked = slot.is_booked;
//                             const isPast = isSlotInPast(slot.date, slot.start_time);
                            
//                             return (
//                               <button
//                                 key={slot.id}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   if (!isBooked && !isPast) {
//                                     handleSlotSelection(therapist, slot);
//                                   }
//                                 }}
//                                 disabled={isBooked || isPast}
//                                 className={`py-3 px-2 border rounded-lg transition-colors flex flex-col items-center justify-center ${
//                                   isSlotSelected
//                                     ? 'bg-green-100 border-green-500 text-green-700 shadow-md'
//                                     : isBooked
//                                       ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
//                                       : isPast
//                                       ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
//                                       : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
//                                 }`}
//                               >
//                                 <div className="font-semibold flex items-center">
//                                   <FaClock className="mr-1 text-xs" />
//                                   <span>
//                                     {slot.start_time}
//                                   </span>
//                                 </div>

//                                 <div className="text-xs">to {slot.end_time}</div>

//                                 {isSlotSelected && (
//                                   <div className="text-xs font-medium text-green-700 mt-1">
//                                     Selected
//                                   </div>
//                                 )}
//                                 {isBooked && !isSlotSelected && (
//                                   <div className="text-xs font-medium text-gray-500 mt-1">
//                                     Booked
//                                   </div>
//                                 )}
//                                 {isPast && !isBooked && !isSlotSelected && (
//                                   <div className="text-xs font-medium text-red-500 mt-1">
//                                     Passed
//                                   </div>
//                                 )}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       )}
                      
//                       {/* Booking action */}
//                       {selectedSlot && selectedTherapist?.id === therapist.id && (
//                         <div className="border-t pt-4">
//                           <div className="bg-green-50 rounded-lg p-4 mb-6">
//                             <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                               <FaCalendarAlt className="mr-2 text-green-600" />
//                               Appointment Summary
//                             </h4>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaUserMd className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Therapist</p>
//                                     <p className="font-semibold">{therapist.full_name}</p>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaCalendarAlt className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Date</p>
//                                     <p className="font-semibold">
//                                       {new Date(selectedSlot.date).toLocaleDateString('en-US', { 
//                                         weekday: 'short', 
//                                         month: 'short', 
//                                         day: 'numeric' 
//                                       })}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaClock className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Time</p>
//                                     <p className="font-semibold">{selectedSlot.start_time} - {selectedSlot.end_time}</p>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaMoneyBillWave className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Session Fee</p>
//                                     <p className="font-semibold">KES {(therapist.session_fee || 5000).toLocaleString()}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleBookingSubmit();
//                             }}
//                             disabled={isSubmitting}
//                             className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
//                               isSubmitting
//                                 ? 'bg-green-400 cursor-not-allowed'
//                                 : 'bg-green-600 hover:bg-green-700'
//                             }`}
//                           >
//                             {isSubmitting ? (
//                               <BeatLoader color="#ffffff" size={10} />
//                             ) : (
//                               "Confirm Booking"
//                             )}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SessionBooking;













// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCalendarAlt, FaClock, FaPhone, FaUserMd, FaMoneyBillWave, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { BeatLoader } from "react-spinners";
// import defaultDoctorImg from "../assets/images/Doc 1.webp";

// interface Therapist {
//   id: number;
//   full_name: string;
//   email: string;
//   contact_phone: string;
//   address: string;
//   role: string;
//   specialization: string;
//   experience_years: number;
//   profile_picture: string | null;
//   created_at: string;
//   updated_at: string;
//   session_fee?: number;
//   bio?: string;
// }

// interface TimeSlot {
//   id: number;
//   therapist_id: number;
//   date: string;
//   start_time: string;
//   end_time: string;
//   is_booked: boolean;
//   therapist: Therapist;
// }

// interface TimeSlotResponse {
//   message: string;
//   data: TimeSlot[];
// }

// interface CalendarDay {
//   date: string;
//   displayDate: string;
//   isCurrentMonth: boolean;
//   isToday: boolean;
//   isSelected: boolean;
// }

// interface TherapistWithSlots extends Therapist {
//   availableSlots: TimeSlot[];
//   image_url?: string;
// }

// interface BookingResponse {
//   success: boolean;
//   message: string;
//   data: {
//     id: number;
//     user_id: number;
//     therapist_id: number;
//     slot_id: number;
//     booking_status: string;
//   };
// }

// interface ErrorResponse {
//   error: string;
//   details?: string;
// }

// const SessionBooking: React.FC = () => {
//   const navigate = useNavigate();
//   const [therapists, setTherapists] = useState<TherapistWithSlots[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedTherapist, setSelectedTherapist] = useState<TherapistWithSlots | null>(null);
//   const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [expandedTherapistId, setExpandedTherapistId] = useState<number | null>(null);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
//   const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
//   const [selectedDate, setSelectedDate] = useState<string>(
//     new Date().toISOString().split('T')[0]
//   );

//   const getDefaultBio = (specialization: string, experience: number): string => {
//     return `Specializes in ${specialization} with ${experience} years of experience. Provides professional therapy sessions tailored to individual needs.`;
//   };

//   const generateCalendarDays = useCallback((month: Date): CalendarDay[] => {
//     const year = month.getFullYear();
//     const monthIndex = month.getMonth();
//     const today = new Date();
//     const todayString = today.toISOString().split('T')[0];
    
//     // Get first day of month
//     const firstDay = new Date(year, monthIndex, 1);
//     // Get last day of month
//     const lastDay = new Date(year, monthIndex + 1, 0);
    
//     // Get days from previous month to show
//     const prevMonthDays = firstDay.getDay(); // 0 = Sunday
    
//     // Get days from next month to show
//     const nextMonthDays = 6 - lastDay.getDay(); // 6 = Saturday
    
//     const days: CalendarDay[] = [];
    
//     // Previous month days
//     for (let i = prevMonthDays - 1; i >= 0; i--) {
//       const date = new Date(year, monthIndex, -i);
//       days.push({
//         date: date.toISOString().split('T')[0],
//         displayDate: date.getDate().toString(),
//         isCurrentMonth: false,
//         isToday: date.toISOString().split('T')[0] === todayString,
//         isSelected: date.toISOString().split('T')[0] === selectedDate
//       });
//     }
    
//     // Current month days
//     for (let i = 1; i <= lastDay.getDate(); i++) {
//       const date = new Date(year, monthIndex, i);
//       days.push({
//         date: date.toISOString().split('T')[0],
//         displayDate: i.toString(),
//         isCurrentMonth: true,
//         isToday: date.toISOString().split('T')[0] === todayString,
//         isSelected: date.toISOString().split('T')[0] === selectedDate
//       });
//     }
    
//     // Next month days
//     for (let i = 1; i <= nextMonthDays; i++) {
//       const date = new Date(year, monthIndex + 1, i);
//       days.push({
//         date: date.toISOString().split('T')[0],
//         displayDate: date.getDate().toString(),
//         isCurrentMonth: false,
//         isToday: date.toISOString().split('T')[0] === todayString,
//         isSelected: date.toISOString().split('T')[0] === selectedDate
//       });
//     }
    
//     return days;
//   }, [selectedDate]);

//   const fetchTimeSlots = useCallback(async () => {
//     try {
//       setLoading(true);
//       setLoadingSlots(true);
//       setError(null);
      
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required");
//       }

//       // Get first and last day of current month view
//       const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//       const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

//       const response = await fetch(
//         `http://localhost:8000/api/time-slots?start_date=${firstDay.toISOString().split('T')[0]}&end_date=${lastDay.toISOString().split('T')[0]}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch time slots");
//       }

//       const responseData: TimeSlotResponse = await response.json();
//       const slots = responseData.data || [];

//       const formattedSlots = slots.map(slot => ({
//         ...slot,
//         start_time: slot.start_time.substring(0, 5),
//         end_time: slot.end_time.substring(0, 5)
//       }));

//       const uniqueTherapists: {[key: number]: TherapistWithSlots} = {};
      
//       formattedSlots.forEach(slot => {
//         const therapistId = slot.therapist.id;
        
//         if (!uniqueTherapists[therapistId]) {
//           const fullName = slot.therapist.full_name.startsWith("Dr.") || 
//                           slot.therapist.full_name.startsWith("DR") ? 
//                           slot.therapist.full_name : 
//                           `Dr. ${slot.therapist.full_name}`;
          
//           uniqueTherapists[therapistId] = {
//             ...slot.therapist,
//             full_name: fullName,
//             session_fee: 5000,
//             bio: getDefaultBio(slot.therapist.specialization, slot.therapist.experience_years),
//             image_url: slot.therapist.profile_picture || defaultDoctorImg,
//             availableSlots: []
//           };
//         }
        
//         uniqueTherapists[therapistId].availableSlots.push(slot);
//       });
      
//       setTherapists(Object.values(uniqueTherapists));
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An unknown error occurred");
//       console.error("Error fetching time slots:", err);
//     } finally {
//       setLoading(false);
//       setLoadingSlots(false);
//     }
//   }, [currentMonth]);

//   const handleExpandTherapist = (therapist: TherapistWithSlots) => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!user.id) {
//       toast.error("Please login to book a session");
//       navigate("/login");
//       return;
//     }
    
//     if (expandedTherapistId === therapist.id) {
//       setExpandedTherapistId(null);
//       setSelectedTherapist(null);
//       setSelectedSlot(null);
//     } else {
//       setExpandedTherapistId(therapist.id);
//       setSelectedTherapist(therapist);
//       setSelectedSlot(null);
//     }
//   };

//   const handleDateSelection = (date: string): void => {
//     setSelectedDate(date);
//     setSelectedSlot(null);
//   };

//   const isSlotInPast = (slotDate: string, slotTime: string): boolean => {
//     const now = new Date();
//     const slotDateTime = new Date(`${slotDate}T${slotTime}`);
//     return slotDateTime < now;
//   };

//   const handleSlotSelection = (therapist: TherapistWithSlots, slot: TimeSlot): void => {
//     if (!slot.is_booked && !isSlotInPast(slot.date, slot.start_time)) {
//       setSelectedTherapist(therapist);
//       setSelectedSlot(slot);
//     }
//   };

//   const handleBookingSubmit = async () => {
//     if (!selectedTherapist || !selectedSlot) {
//       toast.error("Please select a time slot");
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     if (!user.id) {
//       toast.error("Please login to book a session");
//       navigate("/login");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Authentication required");
//       }

//       const bookingData = {
//         user_id: user.id,
//         therapist_id: selectedTherapist.id,
//         slot_id: selectedSlot.id,
//         booking_status: "Pending"
//       };

//       const bookingResponse = await fetch("http://localhost:8000/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(bookingData),
//       });

//       if (!bookingResponse.ok) {
//         const errorData: ErrorResponse = await bookingResponse.json();
//         if (bookingResponse.status === 409) {
//           setTherapists(prevTherapists => 
//             prevTherapists.map(therapist => {
//               if (therapist.id === selectedTherapist.id) {
//                 return {
//                   ...therapist,
//                   availableSlots: therapist.availableSlots.map(slot => 
//                     slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
//                   )
//                 };
//               }
//               return therapist;
//             })
//           );
//           throw new Error(errorData.details || "This slot has already been booked");
//         }
//         throw new Error(errorData.error || "Failed to create booking");
//       }

//       const bookingResult: BookingResponse = await bookingResponse.json();
      
//       if (!bookingResult.success || !bookingResult.data?.id) {
//         console.error("Invalid booking response:", bookingResult);
//         throw new Error("Booking was created but no ID was returned. Please check your bookings.");
//       }
      
//       setTherapists(prevTherapists => 
//         prevTherapists.map(therapist => {
//           if (therapist.id === selectedTherapist.id) {
//             return {
//               ...therapist,
//               availableSlots: therapist.availableSlots.map(slot => 
//                 slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
//               )
//             };
//           }
//           return therapist;
//         })
//       );
      
//       toast.success("Booking created successfully!");
      
//       const therapistData = {
//         id: selectedTherapist.id,
//         full_name: selectedTherapist.full_name,
//         specialization: selectedTherapist.specialization,
//         profile_picture: selectedTherapist.profile_picture,
//         image_url: selectedTherapist.image_url
//       };
      
//       const slotData = {
//         id: selectedSlot.id,
//         date: selectedSlot.date,
//         start_time: selectedSlot.start_time,
//         end_time: selectedSlot.end_time
//       };
      
//       navigate('/book-payment', {
//         state: {
//           therapist: therapistData,
//           sessionFee: selectedTherapist.session_fee || 5000,
//           bookingId: bookingResult.data.id,
//           slotDetails: slotData
//         }
//       });
      
//     } catch (error) {
//       console.error("Booking error:", error);
//       toast.error(error instanceof Error ? error.message : "Booking failed. Please try again.");
//       fetchTimeSlots();
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const refreshSlots = () => {
//     fetchTimeSlots();
//   };

//   const changeMonth = (increment: number) => {
//     const newMonth = new Date(currentMonth);
//     newMonth.setMonth(newMonth.getMonth() + increment);
//     setCurrentMonth(newMonth);
//   };

//   useEffect(() => {
//     fetchTimeSlots();
//   }, [fetchTimeSlots]);

//   useEffect(() => {
//     setCalendarDays(generateCalendarDays(currentMonth));
//   }, [currentMonth, generateCalendarDays, selectedDate]);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//         <BeatLoader color="#10B981" size={15} />
//         <p className="mt-4 text-green-600">Loading available therapists...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//         <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
//           <p className="text-gray-700 mb-6">{error}</p>
//           <button 
//             onClick={refreshSlots}
//             className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 md:p-6">
//       <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 border-b">
//           <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//             <FaCalendarAlt className="mr-2 text-green-600" />
//             Book a Therapy Session
//           </h1>
//         </div>
      
//         {/* Monthly Calendar */}
//         <div className="p-6 bg-green-50 border-b">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-medium text-gray-700 flex items-center">
//               <FaCalendarAlt className="mr-2 text-green-600" />
//               Select Date for Availability
//             </h2>
//             <div className="flex items-center space-x-2">
//               <button 
//                 onClick={() => changeMonth(-1)}
//                 className="p-2 rounded-full hover:bg-green-100 transition-colors"
//               >
//                 <FaChevronLeft className="text-green-600" />
//               </button>
//               <span className="font-medium">
//                 {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//               </span>
//               <button 
//                 onClick={() => changeMonth(1)}
//                 className="p-2 rounded-full hover:bg-green-100 transition-colors"
//               >
//                 <FaChevronRight className="text-green-600" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-7 gap-1 mb-2">
//             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//               <div key={day} className="text-center font-medium text-sm text-gray-600 py-1">
//                 {day}
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 gap-1">
//             {calendarDays.map((day) => (
//               <button
//                 key={day.date}
//                 onClick={() => day.isCurrentMonth && handleDateSelection(day.date)}
//                 disabled={!day.isCurrentMonth}
//                 className={`py-2 rounded-lg text-center transition-colors text-sm ${
//                   day.isSelected 
//                     ? 'bg-green-600 text-white shadow-md'
//                     : day.isToday
//                       ? 'border border-green-400 bg-green-100 text-green-700'
//                       : day.isCurrentMonth
//                         ? 'bg-white hover:bg-green-100 text-gray-700'
//                         : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 {day.displayDate}
//               </button>
//             ))}
//           </div>

//           <div className="mt-4 flex justify-between items-center">
//             <p className="text-sm text-gray-600">
//               Showing availability for: <span className="font-semibold text-green-700">
//                 {new Date(selectedDate).toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   month: 'long', 
//                   day: 'numeric',
//                   year: 'numeric' 
//                 })}
//               </span>
//             </p>
//             <button 
//               onClick={refreshSlots}
//               className="text-green-600 text-sm hover:text-green-700 flex items-center"
//             >
//               <FaCalendarAlt className="mr-1" /> Refresh
//             </button>
//           </div>
//         </div>
      
//         {/* Therapist listing */}
//         {therapists.length === 0 ? (
//           <div className="p-8 text-center">
//             <div className="mb-4 text-gray-600">
//               <p className="text-xl mb-4">No therapists available at the moment</p>
//             </div>
//             <button 
//               onClick={refreshSlots}
//               className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Refresh Availability
//             </button>
//           </div>
//         ) : (
//           <div className="p-4 space-y-4">
//             {therapists.map((therapist) => {
//               const slotsForSelectedDate = therapist.availableSlots
//                 .filter(slot => slot.date === selectedDate)
//                 .sort((a, b) => a.start_time.localeCompare(b.start_time));
              
//               const isExpanded = expandedTherapistId === therapist.id;
              
//               return (
//                 <div key={therapist.id} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
//                   {/* Therapist basic info */}
//                   <div 
//                     className="p-4 flex flex-col md:flex-row md:items-center cursor-pointer"
//                     onClick={() => handleExpandTherapist(therapist)}
//                   >
//                     <div className="md:w-1/5 flex justify-center mb-4 md:mb-0">
//                       <img 
//                         src={therapist.image_url} 
//                         alt={therapist.full_name} 
//                         className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-100"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.src = defaultDoctorImg;
//                         }}
//                       />
//                     </div>

//                     <div className="md:w-4/5 md:pl-6">
//                       <div className="flex justify-between items-center mb-2">
//                         <h2 className="text-xl font-bold text-gray-800">
//                           {therapist.full_name}
//                         </h2>
//                         <button className="text-sm text-green-600 hover:text-green-700">
//                           {isExpanded ? 'Hide Details' : 'View Details'}
//                         </button>
//                       </div>

//                       <p className="text-green-700 font-medium mb-3">{therapist.specialization}</p>

//                       <div className="flex flex-wrap gap-3 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <FaUserMd className="mr-1 text-green-500" />
//                           {therapist.experience_years} years exp.
//                         </div>

//                         <div className="flex items-center">
//                           <FaPhone className="mr-1 text-green-500" />
//                           {therapist.contact_phone}
//                         </div>

//                         <div className="flex items-center">
//                           <FaMoneyBillWave className="mr-1 text-green-500" />
//                           KES {(therapist.session_fee || 5000).toLocaleString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expanded details section */}
//                   {isExpanded && (
//                     <div className="border-t px-4 py-5">
//                       <div className="mb-6 bg-green-50 p-4 rounded-lg">
//                         <h3 className="text-lg font-bold text-gray-800 mb-2">
//                           <FaUserMd className="inline-block mr-2 text-green-600" />
//                           About {therapist.full_name}
//                         </h3>
//                         <p className="text-gray-600">{therapist.bio}</p>
//                       </div>
                      
//                       <div className="mb-4">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                           <FaClock className="mr-2 text-green-600" />
//                           Available Slots for {new Date(selectedDate).toLocaleDateString('en-US', { 
//                             weekday: 'long', 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </h3>
//                       </div>
                      
//                       {loadingSlots ? (
//                         <div className="text-center py-4">
//                           <BeatLoader color="#10B981" size={10} />
//                         </div>
//                       ) : slotsForSelectedDate.length === 0 ? (
//                         <div className="text-center py-4 bg-gray-50 rounded-lg">
//                           <p className="text-gray-500 mb-2">No available slots for this date</p>
//                           <button 
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               refreshSlots();
//                             }}
//                             className="text-green-600 underline text-sm hover:text-green-700"
//                           >
//                             Refresh availability
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
//                           {slotsForSelectedDate.map((slot) => {
//                             const isSlotSelected = selectedSlot?.id === slot.id;
//                             const isBooked = slot.is_booked;
//                             const isPast = isSlotInPast(slot.date, slot.start_time);
                            
//                             return (
//                               <button
//                                 key={slot.id}
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   if (!isBooked && !isPast) {
//                                     handleSlotSelection(therapist, slot);
//                                   }
//                                 }}
//                                 disabled={isBooked || isPast}
//                                 className={`py-3 px-2 border rounded-lg transition-colors flex flex-col items-center justify-center ${
//                                   isSlotSelected
//                                     ? 'bg-green-100 border-green-500 text-green-700 shadow-md'
//                                     : isBooked
//                                       ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
//                                       : isPast
//                                       ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
//                                       : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
//                                 }`}
//                               >
//                                 <div className="font-semibold flex items-center">
//                                   <FaClock className="mr-1 text-xs" />
//                                   <span>
//                                     {slot.start_time}
//                                   </span>
//                                 </div>

//                                 <div className="text-xs">to {slot.end_time}</div>

//                                 {isSlotSelected && (
//                                   <div className="text-xs font-medium text-green-700 mt-1">
//                                     Selected
//                                   </div>
//                                 )}
//                                 {isBooked && !isSlotSelected && (
//                                   <div className="text-xs font-medium text-gray-500 mt-1">
//                                     Booked
//                                   </div>
//                                 )}
//                                 {isPast && !isBooked && !isSlotSelected && (
//                                   <div className="text-xs font-medium text-red-500 mt-1">
//                                     Passed
//                                   </div>
//                                 )}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       )}
                      
//                       {/* Booking action */}
//                       {selectedSlot && selectedTherapist?.id === therapist.id && (
//                         <div className="border-t pt-4">
//                           <div className="bg-green-50 rounded-lg p-4 mb-6">
//                             <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                               <FaCalendarAlt className="mr-2 text-green-600" />
//                               Appointment Summary
//                             </h4>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaUserMd className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Therapist</p>
//                                     <p className="font-semibold">{therapist.full_name}</p>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaCalendarAlt className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Date</p>
//                                     <p className="font-semibold">
//                                       {new Date(selectedSlot.date).toLocaleDateString('en-US', { 
//                                         weekday: 'short', 
//                                         month: 'short', 
//                                         day: 'numeric' 
//                                       })}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaClock className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Time</p>
//                                     <p className="font-semibold">{selectedSlot.start_time} - {selectedSlot.end_time}</p>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="bg-white p-3 rounded border border-green-100">
//                                 <div className="flex items-start mb-1">
//                                   <FaMoneyBillWave className="text-green-600 mt-1 mr-2" />
//                                   <div>
//                                     <p className="text-sm text-gray-500">Session Fee</p>
//                                     <p className="font-semibold">KES {(therapist.session_fee || 5000).toLocaleString()}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleBookingSubmit();
//                             }}
//                             disabled={isSubmitting}
//                             className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
//                               isSubmitting
//                                 ? 'bg-green-400 cursor-not-allowed'
//                                 : 'bg-green-600 hover:bg-green-700'
//                             }`}
//                           >
//                             {isSubmitting ? (
//                               <BeatLoader color="#ffffff" size={10} />
//                             ) : (
//                               "Confirm Booking"
//                             )}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SessionBooking;





























import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaPhone, FaUserMd, FaMoneyBillWave, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import defaultDoctorImg from "../assets/images/Doc 1.webp";

interface Therapist {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
  address: string;
  role: string;
  specialization: string;
  experience_years: number;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
  session_fee?: number;
  bio?: string;
}

interface TimeSlot {
  id: number;
  therapist_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  therapist: Therapist;
}

interface TimeSlotResponse {
  message: string;
  data: TimeSlot[];
}

interface CalendarDay {
  date: string;
  displayDate: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface TherapistWithSlots extends Therapist {
  availableSlots: TimeSlot[];
  image_url?: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    therapist_id: number;
    slot_id: number;
    booking_status: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const SessionBooking: React.FC = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState<TherapistWithSlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistWithSlots | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedTherapistId, setExpandedTherapistId] = useState<number | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const getDefaultBio = (specialization: string, experience: number): string => {
    return `Specializes in ${specialization} with ${experience} years of experience. Provides professional therapy sessions tailored to individual needs.`;
  };

  const generateCalendarDays = useCallback((month: Date, selected: string): CalendarDay[] => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Get first day of month
    const firstDay = new Date(year, monthIndex, 1);
    // Get last day of month
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    // Get days from previous month to show
    const prevMonthDays = firstDay.getDay(); // 0 = Sunday
    
    // Get days from next month to show
    const nextMonthDays = 6 - lastDay.getDay(); // 6 = Saturday
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, monthIndex, -i);
      days.push({
        date: date.toISOString().split('T')[0],
        displayDate: date.getDate().toString(),
        isCurrentMonth: false,
        isToday: date.toISOString().split('T')[0] === todayString,
        isSelected: date.toISOString().split('T')[0] === selected
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, monthIndex, i);
      days.push({
        date: date.toISOString().split('T')[0],
        displayDate: i.toString(),
        isCurrentMonth: true,
        isToday: date.toISOString().split('T')[0] === todayString,
        isSelected: date.toISOString().split('T')[0] === selected
      });
    }
    
    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, monthIndex + 1, i);
      days.push({
        date: date.toISOString().split('T')[0],
        displayDate: date.getDate().toString(),
        isCurrentMonth: false,
        isToday: date.toISOString().split('T')[0] === todayString,
        isSelected: date.toISOString().split('T')[0] === selected
      });
    }
    
    return days;
  }, []);

  const fetchTimeSlots = useCallback(async (month: Date) => {
    try {
      setLoading(true);
      setLoadingSlots(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Get first and last day of current month view
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const response = await fetch(
        `http://localhost:8000/api/time-slots?start_date=${firstDay.toISOString().split('T')[0]}&end_date=${lastDay.toISOString().split('T')[0]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const responseData: TimeSlotResponse = await response.json();
      const slots = responseData.data || [];

      const formattedSlots = slots.map(slot => ({
        ...slot,
        start_time: slot.start_time.substring(0, 5),
        end_time: slot.end_time.substring(0, 5)
      }));

      const uniqueTherapists: {[key: number]: TherapistWithSlots} = {};
      
      formattedSlots.forEach(slot => {
        const therapistId = slot.therapist.id;
        
        if (!uniqueTherapists[therapistId]) {
          const fullName = slot.therapist.full_name.startsWith("Dr.") || 
                          slot.therapist.full_name.startsWith("DR") ? 
                          slot.therapist.full_name : 
                          `Dr. ${slot.therapist.full_name}`;
          
          uniqueTherapists[therapistId] = {
            ...slot.therapist,
            full_name: fullName,
            session_fee: 5000,
            bio: getDefaultBio(slot.therapist.specialization, slot.therapist.experience_years),
            image_url: slot.therapist.profile_picture || defaultDoctorImg,
            availableSlots: []
          };
        }
        
        uniqueTherapists[therapistId].availableSlots.push(slot);
      });
      
      setTherapists(Object.values(uniqueTherapists));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching time slots:", err);
    } finally {
      setLoading(false);
      setLoadingSlots(false);
    }
  }, []);

  const handleExpandTherapist = (therapist: TherapistWithSlots) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      toast.error("Please login to book a session");
      navigate("/login");
      return;
    }
    
    if (expandedTherapistId === therapist.id) {
      setExpandedTherapistId(null);
      setSelectedTherapist(null);
      setSelectedSlot(null);
    } else {
      setExpandedTherapistId(therapist.id);
      setSelectedTherapist(therapist);
      setSelectedSlot(null);
    }
  };

  const handleDateSelection = (date: string): void => {
    if (selectedDate !== date) {
      setSelectedDate(date);
      setSelectedSlot(null);
      // Clear any selected therapist to force re-fetch of slots
      setSelectedTherapist(null);
      setExpandedTherapistId(null);
    }
  };

  const isSlotInPast = (slotDate: string, slotTime: string): boolean => {
    const now = new Date();
    const slotDateTime = new Date(`${slotDate}T${slotTime}`);
    return slotDateTime < now;
  };

  const handleSlotSelection = (therapist: TherapistWithSlots, slot: TimeSlot): void => {
    if (!slot.is_booked && !isSlotInPast(slot.date, slot.start_time)) {
      setSelectedTherapist(therapist);
      setSelectedSlot(slot);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedTherapist || !selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      toast.error("Please login to book a session");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const bookingData = {
        user_id: user.id,
        therapist_id: selectedTherapist.id,
        slot_id: selectedSlot.id,
        booking_status: "Pending"
      };

      const bookingResponse = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        const errorData: ErrorResponse = await bookingResponse.json();
        if (bookingResponse.status === 409) {
          setTherapists(prevTherapists => 
            prevTherapists.map(therapist => {
              if (therapist.id === selectedTherapist.id) {
                return {
                  ...therapist,
                  availableSlots: therapist.availableSlots.map(slot => 
                    slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
                  )
                };
              }
              return therapist;
            })
          );
          throw new Error(errorData.details || "This slot has already been booked");
        }
        throw new Error(errorData.error || "Failed to create booking");
      }

      const bookingResult: BookingResponse = await bookingResponse.json();
      
      if (!bookingResult.success || !bookingResult.data?.id) {
        console.error("Invalid booking response:", bookingResult);
        throw new Error("Booking was created but no ID was returned. Please check your bookings.");
      }
      
      setTherapists(prevTherapists => 
        prevTherapists.map(therapist => {
          if (therapist.id === selectedTherapist.id) {
            return {
              ...therapist,
              availableSlots: therapist.availableSlots.map(slot => 
                slot.id === selectedSlot.id ? { ...slot, is_booked: true } : slot
              )
            };
          }
          return therapist;
        })
      );
      
      toast.success("Booking created successfully!");
      
      const therapistData = {
        id: selectedTherapist.id,
        full_name: selectedTherapist.full_name,
        specialization: selectedTherapist.specialization,
        profile_picture: selectedTherapist.profile_picture,
        image_url: selectedTherapist.image_url
      };
      
      const slotData = {
        id: selectedSlot.id,
        date: selectedSlot.date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time
      };
      
      navigate('/book-payment', {
        state: {
          therapist: therapistData,
          sessionFee: selectedTherapist.session_fee || 5000,
          bookingId: bookingResult.data.id,
          slotDetails: slotData
        }
      });
      
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error instanceof Error ? error.message : "Booking failed. Please try again.");
      fetchTimeSlots(currentMonth);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshSlots = () => {
    fetchTimeSlots(currentMonth);
  };

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
    fetchTimeSlots(newMonth);
  };

  useEffect(() => {
    fetchTimeSlots(currentMonth);
  }, []);

  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentMonth, selectedDate));
  }, [currentMonth, selectedDate, generateCalendarDays]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <BeatLoader color="#10B981" size={15} />
        <p className="mt-4 text-green-600">Loading available therapists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={refreshSlots}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            Book a Therapy Session
          </h1>
        </div>
      
        {/* Monthly Calendar */}
        <div className="p-6 bg-green-50 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700 flex items-center">
              <FaCalendarAlt className="mr-2 text-green-600" />
              Select Date for Availability
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-full hover:bg-green-100 transition-colors"
              >
                <FaChevronLeft className="text-green-600" />
              </button>
              <span className="font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button 
                onClick={() => changeMonth(1)}
                className="p-2 rounded-full hover:bg-green-100 transition-colors"
              >
                <FaChevronRight className="text-green-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-sm text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => (
              <button
                key={day.date}
                onClick={() => day.isCurrentMonth && handleDateSelection(day.date)}
                disabled={!day.isCurrentMonth}
                className={`py-2 rounded-lg text-center transition-colors text-sm ${
                  day.isSelected 
                    ? 'bg-green-600 text-white shadow-md'
                    : day.isToday
                      ? 'border border-green-400 bg-green-100 text-green-700'
                      : day.isCurrentMonth
                        ? 'bg-white hover:bg-green-100 text-gray-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {day.displayDate}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing availability for: <span className="font-semibold text-green-700">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </span>
            </p>
            <button 
              onClick={refreshSlots}
              className="text-green-600 text-sm hover:text-green-700 flex items-center"
            >
              <FaCalendarAlt className="mr-1" /> Refresh
            </button>
          </div>
        </div>
      
        {/* Therapist listing */}
        {therapists.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4 text-gray-600">
              <p className="text-xl mb-4">No therapists available at the moment</p>
            </div>
            <button 
              onClick={refreshSlots}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Refresh Availability
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {therapists.map((therapist) => {
              const slotsForSelectedDate = therapist.availableSlots
                .filter(slot => slot.date === selectedDate)
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
              
              const isExpanded = expandedTherapistId === therapist.id;
              
              return (
                <div key={therapist.id} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* Therapist basic info */}
                  <div 
                    className="p-4 flex flex-col md:flex-row md:items-center cursor-pointer"
                    onClick={() => handleExpandTherapist(therapist)}
                  >
                    <div className="md:w-1/5 flex justify-center mb-4 md:mb-0">
                      <img 
                        src={therapist.image_url} 
                        alt={therapist.full_name} 
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = defaultDoctorImg;
                        }}
                      />
                    </div>

                    <div className="md:w-4/5 md:pl-6">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-gray-800">
                          {therapist.full_name}
                        </h2>
                        <button className="text-sm text-green-600 hover:text-green-700">
                          {isExpanded ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>

                      <p className="text-green-700 font-medium mb-3">{therapist.specialization}</p>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaUserMd className="mr-1 text-green-500" />
                          {therapist.experience_years} years exp.
                        </div>

                        <div className="flex items-center">
                          <FaPhone className="mr-1 text-green-500" />
                          {therapist.contact_phone}
                        </div>

                        <div className="flex items-center">
                          <FaMoneyBillWave className="mr-1 text-green-500" />
                          KES {(therapist.session_fee || 5000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details section */}
                  {isExpanded && (
                    <div className="border-t px-4 py-5">
                      <div className="mb-6 bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          <FaUserMd className="inline-block mr-2 text-green-600" />
                          About {therapist.full_name}
                        </h3>
                        <p className="text-gray-600">{therapist.bio}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FaClock className="mr-2 text-green-600" />
                          Available Slots for {new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </h3>
                      </div>
                      
                      {loadingSlots ? (
                        <div className="text-center py-4">
                          <BeatLoader color="#10B981" size={10} />
                        </div>
                      ) : slotsForSelectedDate.length === 0 ? (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-500 mb-2">No available slots for this date</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              refreshSlots();
                            }}
                            className="text-green-600 underline text-sm hover:text-green-700"
                          >
                            Refresh availability
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                          {slotsForSelectedDate.map((slot) => {
                            const isSlotSelected = selectedSlot?.id === slot.id;
                            const isBooked = slot.is_booked;
                            const isPast = isSlotInPast(slot.date, slot.start_time);
                            
                            return (
                              <button
                                key={slot.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isBooked && !isPast) {
                                    handleSlotSelection(therapist, slot);
                                  }
                                }}
                                disabled={isBooked || isPast}
                                className={`py-3 px-2 border rounded-lg transition-colors flex flex-col items-center justify-center ${
                                  isSlotSelected
                                    ? 'bg-green-100 border-green-500 text-green-700 shadow-md'
                                    : isBooked
                                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                      : isPast
                                      ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                                      : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
                                }`}
                              >
                                <div className="font-semibold flex items-center">
                                  <FaClock className="mr-1 text-xs" />
                                  <span>
                                    {slot.start_time}
                                  </span>
                                </div>

                                <div className="text-xs">to {slot.end_time}</div>

                                {isSlotSelected && (
                                  <div className="text-xs font-medium text-green-700 mt-1">
                                    Selected
                                  </div>
                                )}
                                {isBooked && !isSlotSelected && (
                                  <div className="text-xs font-medium text-gray-500 mt-1">
                                    Booked
                                  </div>
                                )}
                                {isPast && !isBooked && !isSlotSelected && (
                                  <div className="text-xs font-medium text-red-500 mt-1">
                                    Passed
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Booking action */}
                      {selectedSlot && selectedTherapist?.id === therapist.id && (
                        <div className="border-t pt-4">
                          <div className="bg-green-50 rounded-lg p-4 mb-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <FaCalendarAlt className="mr-2 text-green-600" />
                              Appointment Summary
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded border border-green-100">
                                <div className="flex items-start mb-1">
                                  <FaUserMd className="text-green-600 mt-1 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Therapist</p>
                                    <p className="font-semibold">{therapist.full_name}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded border border-green-100">
                                <div className="flex items-start mb-1">
                                  <FaCalendarAlt className="text-green-600 mt-1 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="font-semibold">
                                      {new Date(selectedSlot.date).toLocaleDateString('en-US', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded border border-green-100">
                                <div className="flex items-start mb-1">
                                  <FaClock className="text-green-600 mt-1 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Time</p>
                                    <p className="font-semibold">{selectedSlot.start_time} - {selectedSlot.end_time}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-3 rounded border border-green-100">
                                <div className="flex items-start mb-1">
                                  <FaMoneyBillWave className="text-green-600 mt-1 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Session Fee</p>
                                    <p className="font-semibold">KES {(therapist.session_fee || 5000).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookingSubmit();
                            }}
                            disabled={isSubmitting}
                            className={`w-full py-3 text-white rounded-lg transition-colors flex items-center justify-center ${
                              isSubmitting
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {isSubmitting ? (
                              <BeatLoader color="#ffffff" size={10} />
                            ) : (
                              "Confirm Booking"
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionBooking;