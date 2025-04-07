import React, { useState, useEffect, useCallback } from "react";
import { FaClock, FaPlus, FaCheck, FaChevronLeft, FaChevronRight, FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import defaultDoctorImg from "../assets/images/Doc 1.webp";

interface TimeSlot {
  id?: number;
  therapist_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface CalendarDate {
  date: string;        // YYYY-MM-DD format
  displayDate: string; // Day number (1-31)
  dayName: string;     // Full day name
  isToday: boolean;    // Whether this is today
}

const DEFAULT_TIME_SLOTS = [
  { start: "08:00", end: "10:00" },
  { start: "10:00", end: "12:00" },
  { start: "12:00", end: "14:00" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" }
];

interface SlotsProps {
  therapistId: number;
  therapistName: string;
  therapistSpecialization: string;
  therapistImage?: string;
}

const Slots: React.FC<SlotsProps> = ({ 
  therapistId, 
  therapistName, 
  therapistSpecialization, 
  therapistImage = defaultDoctorImg 
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [creatingSlot, setCreatingSlot] = useState(false);
  const [deletingSlot, setDeletingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState(false);
  const [newlyCreatedSlots, setNewlyCreatedSlots] = useState<number[]>([]);
  const [processingSlotId, setProcessingSlotId] = useState<string | null>(null);
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Generate calendar dates for a given month
  const generateCalendarDates = useCallback((month: Date): CalendarDate[] => {
    const dates: CalendarDate[] = [];
    const today = new Date();
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isCurrentDay = date.getDate() === today.getDate() && 
                          date.getMonth() === today.getMonth() && 
                          date.getFullYear() === today.getFullYear();
      
      dates.push({
        date: dateString,
        displayDate: day.toString(),
        dayName: dayNames[date.getDay()],
        isToday: isCurrentDay
      });
    }
    
    return dates;
  }, []);

  // Navigation functions
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
    const dates = generateCalendarDates(prevMonth);
    setCalendarDates(dates);
    if (!selectedDate || !dates.some(d => d.date === selectedDate.date)) {
      setSelectedDate(dates[0]);
    }
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
    const dates = generateCalendarDates(nextMonth);
    setCalendarDates(dates);
    if (!selectedDate || !dates.some(d => d.date === selectedDate.date)) {
      setSelectedDate(dates[0]);
    }
  };

  const goToCurrentMonth = () => {
    const today = new Date();
    setCurrentMonth(today);
    const dates = generateCalendarDates(today);
    setCalendarDates(dates);
    const todayDate = dates.find(date => date.isToday);
    setSelectedDate(todayDate || dates[0]);
  };

  // CRUD Operations
  const createTimeSlot = async (slot: TimeSlot): Promise<TimeSlot> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch("https://mindful-app-r8ur.onrender.com/api/time-slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        therapist_id: therapistId,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_booked: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create time slot");
    }

    return await response.json();
  };

  const updateTimeSlot = async (slot: TimeSlot): Promise<TimeSlot> => {
    if (!slot.id) throw new Error("Cannot update slot without ID");
    
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`https://mindful-app-r8ur.onrender.com/api/time-slots/${slot.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(slot),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update time slot");
    }

    return await response.json();
  };

  const deleteTimeSlot = async (slotId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`https://mindful-app-r8ur.onrender.com/api/time-slots/${slotId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete time slot");
    }
  };

  const handleSlotSelection = async (slot: TimeSlot): Promise<void> => {
    if (!selectedDate) return;

    if (slot.id) {
      setSelectedSlot(slot);
      return;
    }

    const slotKey = `${slot.start_time}-${slot.end_time}`;
    setProcessingSlotId(slotKey);
    
    try {
      setCreatingSlot(true);
      const newSlot = {
        therapist_id: therapistId,
        date: selectedDate.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_booked: false
      };
      
      const createdSlot = await createTimeSlot(newSlot);
      toast.success(`Slot created: ${formatTimeDisplay(slot.start_time)} - ${formatTimeDisplay(slot.end_time)}`);
      setAvailableSlots(prev => [...prev, createdSlot]);
      setNewlyCreatedSlots(prev => [...prev, createdSlot.id]);
      setSelectedSlot(createdSlot);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create slot");
    } finally {
      setCreatingSlot(false);
      setProcessingSlotId(null);
    }
  };

  const handleUpdateSlot = async (updatedSlot: TimeSlot) => {
    if (!selectedSlot?.id) return;

    try {
      setEditingSlot(true);
      const result = await updateTimeSlot(updatedSlot);
      toast.success("Slot updated successfully");
      setAvailableSlots(prev => 
        prev.map(slot => slot.id === result.id ? result : slot)
      );
      setSelectedSlot(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update slot");
    } finally {
      setEditingSlot(false);
    }
  };

  const handleDeleteSlot = async () => {
    if (!selectedSlot?.id) return;

    try {
      setDeletingSlot(true);
      await deleteTimeSlot(selectedSlot.id);
      toast.success("Slot deleted successfully");
      setAvailableSlots(prev => 
        prev.filter(slot => slot.id !== selectedSlot.id)
      );
      setSelectedSlot(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete slot");
    } finally {
      setDeletingSlot(false);
    }
  };

  const handleDateSelection = (date: CalendarDate): void => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const isSlotInPast = (slotDate: string, slotTime: string): boolean => {
    const now = new Date();
    const slotDateTime = new Date(`${slotDate}T${slotTime}`);
    return slotDateTime < now;
  };

  const generateDefaultSlots = (): TimeSlot[] => {
    if (!selectedDate) return [];
    
    const existingSlots = availableSlots.filter(slot => slot.date === selectedDate.date);
    const existingStartTimes = existingSlots.map(slot => slot.start_time);
    
    return DEFAULT_TIME_SLOTS
      .filter(slot => !existingStartTimes.includes(slot.start))
      .map(slot => ({
        therapist_id: therapistId,
        date: selectedDate.date,
        start_time: slot.start,
        end_time: slot.end,
        is_booked: false
      }))
      .filter(slot => !isSlotInPast(selectedDate.date, slot.start_time));
  };

  // Formatting helpers
  const formatDateDisplay = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeDisplay = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getMonthYearDisplay = (): string => {
    return currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Initialize calendar
  useEffect(() => {
    const today = new Date();
    setCurrentMonth(today);
    const dates = generateCalendarDates(today);
    setCalendarDates(dates);
    const todayDate = dates.find(date => date.isToday);
    setSelectedDate(todayDate || dates[0]);
  }, [generateCalendarDates]);

  // Get slots for display
  const slotsForSelectedDate = selectedDate
    ? availableSlots.filter(slot => slot.date === selectedDate.date)
    : [];
  
  const defaultSlots = generateDefaultSlots();
  const allSlots = [...slotsForSelectedDate, ...defaultSlots];
  const slotsToDisplay = allSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <img 
          src={therapistImage}
          alt={therapistName} 
          className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultDoctorImg;
          }}
        />
        <div>
          <h2 className="text-xl font-bold text-green-800">Manage Slots for {therapistName}</h2>
          <p className="text-gray-600 text-sm">{therapistSpecialization}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Month Navigation */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Previous month"
            >
              <FaChevronLeft />
            </button>
            <h4 className="text-md font-medium text-gray-800">
              {getMonthYearDisplay()}
            </h4>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Next month"
            >
              <FaChevronRight />
            </button>
          </div>
          <button 
            onClick={goToCurrentMonth}
            className="mt-1 text-xs text-green-600 hover:text-green-800"
          >
            Go to Current Month
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Select Date</h4>
          <div className="grid grid-cols-7 gap-1 mb-3">
            {["S", "M", "T", "W", "T", "F", "S"].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
            
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-8"></div>
            ))}
            
            {calendarDates.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => handleDateSelection(day)}
                className={`h-8 rounded text-center text-sm transition-colors ${
                  selectedDate?.date === day.date
                    ? 'bg-green-600 text-white'
                    : day.isToday
                    ? 'bg-green-100 border border-green-300 text-green-700'
                    : 'hover:bg-green-50 text-gray-700'
                }`}
              >
                {day.displayDate}
              </button>
            ))}
          </div>
        </div>

        {/* Slot Management */}
        {selectedDate && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                Time Slots for {formatDateDisplay(selectedDate.date)}
              </h4>
            </div>
            
            {slotsToDisplay.length === 0 ? (
              <div className="text-center py-3 text-gray-500 text-sm">
                No slots available for this date
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {slotsToDisplay.map((slot) => {
                  const slotKey = slot.id ? `slot-${slot.id}` : `default-slot-${slot.start_time}-${slot.end_time}`;
                  const isNewlyCreated = slot.id ? newlyCreatedSlots.includes(slot.id) : false;
                  const isSelected = selectedSlot?.id === slot.id;
                  const isBooked = slot.is_booked;
                  const isPast = isSlotInPast(selectedDate.date, slot.start_time);
                  const isProcessing = processingSlotId === `${slot.start_time}-${slot.end_time}`;
                  
                  return (
                    <button
                      key={slotKey}
                      type="button"
                      onClick={() => handleSlotSelection(slot)}
                      disabled={isBooked || creatingSlot || isPast || isProcessing}
                      className={`py-2 px-2 border rounded text-sm transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-green-100 border-green-500 text-green-700'
                          : isBooked || isPast
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {isProcessing ? (
                          <BeatLoader color="#3B82F6" size={6} className="mr-1" />
                        ) : slot.id ? (
                          isNewlyCreated ? (
                            <FaCheck className="mr-1 text-green-500 text-xs" />
                          ) : (
                            <FaClock className="mr-1 text-xs" />
                          )
                        ) : (
                          <FaPlus className="mr-1 text-xs" />
                        )}
                        <span>
                          {formatTimeDisplay(slot.start_time)} - {formatTimeDisplay(slot.end_time)}
                        </span>
                      </div>
                      {isBooked && <span className="text-xs text-gray-500">Booked</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Slot CRUD Actions */}
        {selectedSlot && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Selected Slot: {formatTimeDisplay(selectedSlot.start_time)} - {formatTimeDisplay(selectedSlot.end_time)}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newEndTime = prompt("Enter new end time (HH:MM):", selectedSlot.end_time);
                  if (newEndTime && newEndTime !== selectedSlot.end_time) {
                    handleUpdateSlot({ ...selectedSlot, end_time: newEndTime });
                  }
                }}
                disabled={editingSlot}
                className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                <FaEdit size={12} />
                {editingSlot ? "Updating..." : "Edit End Time"}
              </button>
              
              <button
                onClick={handleDeleteSlot}
                disabled={deletingSlot}
                className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
              >
                <FaTrash size={12} />
                {deletingSlot ? "Deleting..." : "Delete Slot"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slots;