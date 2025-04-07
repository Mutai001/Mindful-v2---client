/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from 'react';

// Enums for message status
enum MessageStatusEnum {
  Sent = "Sent",
  Delivered = "Delivered",
  Read = "Read",
}

// Message interface for the component
interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  status: MessageStatusEnum;
  is_read: boolean;
  created_at: string;
  booking_id?: number;
}

// Updated User interface to match API response
interface User {
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
}

// Rating interface
interface TherapistRating {
  therapistId: number;
  rating: number;
  feedback: string;
  timestamp: string;
}

const UserMessage = () => {
  // State for therapists
  const [therapists, setTherapists] = useState<User[]>([]);
  const [isLoadingTherapists, setIsLoadingTherapists] = useState<boolean>(true);
  const [therapistError, setTherapistError] = useState<string | null>(null);
  
  // Set a default user ID instead of requiring authentication
  const [currentUserId] = useState<number>(1);
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // State for displaying therapist details
  const [showTherapistDetails, setShowTherapistDetails] = useState<boolean>(false);
  
  // Rating and feedback state
  const [ratings, setRatings] = useState<Record<number, TherapistRating>>({});
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get the selected therapist object
  const selectedTherapist = selectedTherapistId 
    ? therapists.find(t => t.id === selectedTherapistId) 
    : null;

  // Generate avatar from therapist name
  const getInitialAvatar = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Fetch therapists from API
  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoadingTherapists(true);
      setTherapistError(null);
      
      try {
        // Attempt to fetch from API
        const response = await fetch('https://mindful-app-r8ur.onrender.com/api/users?role=therapist');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Users');
        }
        
        const data = await response.json();
        setTherapists(data);
      } catch (error) {
        console.error('Error fetching Users:', error);
        setTherapistError('Failed to load Users. Using mock data instead.');
        
        // Fallback to mock data in case the API is not available - using updated interface structure
        setTherapists([
          { 
            id: 1, 
            full_name: 'Dr. Mark Okwena', 
            email: 'markokwena@gmail.com',
            contact_phone: '0712345678',
            address: '123 Main St',
            role: 'therapist', 
            specialization: 'Psychiatry', 
            experience_years: 8,
            profile_picture: null,
            created_at: '2025-03-27T05:48:48.734Z',
            updated_at: '2025-03-27T05:48:48.734Z'
          },
          { 
            id: 2, 
            full_name: 'Dr. Celestina Kweyu', 
            email: 'celestinakweyu@gmail.com',
            contact_phone: '0723456789',
            address: '456 Oak St',
            role: 'therapist', 
            specialization: 'Psychology', 
            experience_years: 6,
            profile_picture: null,
            created_at: '2025-03-27T05:48:48.734Z',
            updated_at: '2025-03-27T05:48:48.734Z'
          },
          { 
            id: 7, 
            full_name: 'DR Christine Therapist', 
            email: 'christinetherapist@gmail.com',
            contact_phone: '0789654321',
            address: '1950 Main St',
            role: 'therapist', 
            specialization: 'Cognitive Behavioral Therapy', 
            experience_years: 5,
            profile_picture: null,
            created_at: '2025-03-27T05:48:48.734Z',
            updated_at: '2025-03-27T05:48:48.734Z'
          }
        ]);
      } finally {
        setIsLoadingTherapists(false);
      }
    };
    
    fetchTherapists();
  }, []);
  
  // Load ratings from localStorage on component mount
  useEffect(() => {
    const savedRatings = localStorage.getItem('therapistRatings');
    if (savedRatings) {
      setRatings(JSON.parse(savedRatings));
    }
  }, []);

  // Mock messages data for demo use
  const mockMessages: Record<number, Message[]> = {
    1: [
      {
        id: 1,
        sender_id: 1,
        receiver_id: 1,
        content: "Hello Dr. Mark, I've been feeling anxious lately.",
        status: MessageStatusEnum.Read,
        is_read: true,
        created_at: "2025-03-30T10:30:00Z"
      },
      {
        id: 2,
        sender_id: 1,
        receiver_id: 1,
        content: "Can you recommend some relaxation techniques?",
        status: MessageStatusEnum.Read,
        is_read: true,
        created_at: "2025-03-30T10:31:00Z"
      },
      {
        id: 3,
        sender_id: 1,
        receiver_id: 1,
        content: "I'd be happy to help with relaxation techniques. Have you tried deep breathing exercises?",
        status: MessageStatusEnum.Delivered,
        is_read: false,
        created_at: "2025-03-30T10:32:00Z"
      }
    ],
    2: [
      {
        id: 4,
        sender_id: 1,
        receiver_id: 2,
        content: "Hi Dr. Celestina, I've completed the exercises you recommended.",
        status: MessageStatusEnum.Read,
        is_read: true,
        created_at: "2025-03-29T14:20:00Z"
      },
      {
        id: 5,
        sender_id: 2,
        receiver_id: 1,
        content: "That's great progress! How did you feel after completing them?",
        status: MessageStatusEnum.Delivered,
        is_read: false,
        created_at: "2025-03-29T14:25:00Z"
      }
    ],
    7: [
      {
        id: 6,
        sender_id: 1,
        receiver_id: 7,
        content: "Hello Dr. Christine, I'm interested in CBT for my anxiety.",
        status: MessageStatusEnum.Read,
        is_read: true,
        created_at: "2025-03-30T09:15:00Z"
      },
      {
        id: 7,
        sender_id: 7,
        receiver_id: 1,
        content: "CBT is an excellent choice for anxiety management. Let's discuss your specific concerns.",
        status: MessageStatusEnum.Delivered,
        is_read: false,
        created_at: "2025-03-30T09:20:00Z"
      }
    ]
  };

  // Mock function to mark messages as read (in a real app this would call an API)
  const markMessagesAsRead = useCallback((messageIds: number[]) => {
    setMessages(prev => 
      prev.map(msg => 
        messageIds.includes(msg.id) 
          ? { ...msg, is_read: true, status: MessageStatusEnum.Read } 
          : msg
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - messageIds.length));
  }, []);

  // Mock function to fetch messages (instead of API call)
  const fetchMessages = useCallback(() => {
    if (!selectedTherapistId) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const therapistMessages = mockMessages[selectedTherapistId] || [];
      setMessages(therapistMessages);
      
      // Mark received messages as read
      const unreadMessages = therapistMessages
        .filter(msg => msg.receiver_id === currentUserId && !msg.is_read)
        .map(msg => msg.id);
      
      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages);
      }
      
      setIsLoading(false);
    }, 500);
  }, [selectedTherapistId, currentUserId, markMessagesAsRead]);

  // Mock function to send a message (instead of API call)
  const sendMessage = () => {
    if (!selectedTherapistId || !messageInput.trim()) return;
    
    const newMessage: Message = {
      id: Math.floor(Math.random() * 10000), // Generate random ID
      sender_id: currentUserId,
      receiver_id: selectedTherapistId,
      content: messageInput,
      status: MessageStatusEnum.Sent,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Simulate therapist response
    setTimeout(() => {
      const responseMessage: Message = {
        id: Math.floor(Math.random() * 10000),
        sender_id: selectedTherapistId,
        receiver_id: currentUserId,
        content: `Thank you for your message. This is an automated response from ${selectedTherapist?.full_name}.`,
        status: MessageStatusEnum.Delivered,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setUnreadCount(prev => prev + 1);
    }, 1500);
  };

  // Handle therapist selection
  const handleTherapistSelect = (therapistId: number) => {
    setSelectedTherapistId(therapistId);
    setMessages([]); // Clear previous messages when switching therapists
    setError(null);
    setShowTherapistDetails(false); // Reset details view when selecting new therapist
  };

  // Toggle therapist details
  const toggleTherapistDetails = () => {
    setShowTherapistDetails(!showTherapistDetails);
  };

  // Load messages when therapist is selected
  useEffect(() => {
    if (selectedTherapistId) {
      fetchMessages();
    }
  }, [selectedTherapistId, fetchMessages]);

  // Initialize unread count
  useEffect(() => {
    // Simply count all unread messages from mock data
    let count = 0;
    Object.values(mockMessages).forEach(messages => {
      count += messages.filter(msg => msg.receiver_id === currentUserId && !msg.is_read).length;
    });
    setUnreadCount(count);
  }, [currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Handle rating submission
  const submitRating = () => {
    if (!selectedTherapistId) return;
    
    const newRating: TherapistRating = {
      therapistId: selectedTherapistId,
      rating: currentRating,
      feedback: feedbackText,
      timestamp: new Date().toISOString()
    };
    
    // Update the ratings state
    const updatedRatings = {
      ...ratings,
      [selectedTherapistId]: newRating
    };
    
    setRatings(updatedRatings);
    
    // Save to localStorage
    localStorage.setItem('therapistRatings', JSON.stringify(updatedRatings));
    
    // Reset and close modal
    setShowRatingModal(false);
    setCurrentRating(0);
    setFeedbackText('');
  };
  
  // Rating stars component
  const RatingStars = ({ 
    currentRating, 
    editable = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange = (_rating: number) => {} 
  }: { 
    currentRating: number, 
    editable?: boolean,
    onChange?: (rating: number) => void 
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => editable && onChange(star)}
            className={`text-2xl ${editable ? 'cursor-pointer' : ''} ${
              star <= currentRating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            disabled={!editable}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto p-4 md:p-8 bg-green-100 rounded-lg shadow-md">
      {/* Therapist selection sidebar */}
      <div className="w-full md:w-1/3 p-4 bg-green-200 rounded-lg mb-4 md:mb-0 md:mr-4">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Choose a User</h2>
        
        {isLoadingTherapists ? (
          <div className="text-center p-4">
            <p>Loading Users...</p>
          </div>
        ) : therapistError ? (
          <div className="bg-yellow-100 text-yellow-800 p-2 mb-2 rounded">
            {therapistError}
          </div>
        ) : (
          <ul className="space-y-2">
            {therapists.map((therapist) => {
              const therapistRating = ratings[therapist.id];
              return (
                <li
                  key={therapist.id}
                  onClick={() => handleTherapistSelect(therapist.id)}
                  className={`p-2 cursor-pointer rounded-lg text-green-900 hover:bg-green-400 transition ${
                    selectedTherapistId === therapist.id ? 'bg-green-600 text-white' : 'bg-green-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center mr-2">
                        {getInitialAvatar(therapist.full_name)}
                      </div>
                      <div>
                        <div>{therapist.full_name}</div>
                        <div className="text-xs">{therapist.specialization}</div>
                      </div>
                    </div>
                    {therapistRating && (
                      <div className="text-xs">
                        <RatingStars currentRating={therapistRating.rating} />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        
        {unreadCount > 0 && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-lg">
            <p>You have {unreadCount} unread message(s)</p>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="w-full md:w-2/3 p-4">
        {selectedTherapist ? (
          <>
            {/* Chat header with rating */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center mr-3 cursor-pointer"
                  onClick={toggleTherapistDetails}
                >
                  {getInitialAvatar(selectedTherapist.full_name)}
                </div>
                <div>
                  <h2 
                    className="text-2xl font-semibold text-green-800 cursor-pointer hover:underline"
                    onClick={toggleTherapistDetails}
                  >
                    {selectedTherapist.full_name}
                  </h2>
                  <p className="text-sm text-green-600">{selectedTherapist.specialization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedTherapistId !== null && ratings[selectedTherapistId] && (
                  <div className="text-sm">
                    <RatingStars currentRating={ratings[selectedTherapistId].rating} />
                  </div>
                )}
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  {selectedTherapistId !== null && ratings[selectedTherapistId] ? 'Update Rating' : 'Rate Therapist'}
                </button>
              </div>
            </div>
            
            {/* Therapist Details Card - shown when clicked on therapist name or avatar */}
            {showTherapistDetails && selectedTherapist && (
              <div className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-green-600">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold mb-2 text-green-800">Therapist Details</h3>
                  <button 
                    onClick={toggleTherapistDetails}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Full Name:</div>
                  <div>{selectedTherapist.full_name}</div>
                  
                  <div className="font-medium">Specialization:</div>
                  <div>{selectedTherapist.specialization}</div>
                  
                  <div className="font-medium">Experience:</div>
                  <div>{selectedTherapist.experience_years} years</div>
                  
                  <div className="font-medium">Email:</div>
                  <div>{selectedTherapist.email}</div>
                  
                  <div className="font-medium">Phone:</div>
                  <div>{selectedTherapist.contact_phone}</div>
                  
                  <div className="font-medium">Address:</div>
                  <div>{selectedTherapist.address}</div>
                  
                  <div className="font-medium">Joined:</div>
                  <div>{formatDate(selectedTherapist.created_at)}</div>
                </div>
              </div>
            )}
            
            {/* Messages */}
            <div className="overflow-y-auto h-64 p-4 mb-4 bg-gray-100 rounded-lg shadow-inner">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-green-700">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg: Message) => (
                    <div key={msg.id} className="mb-3">
                      <p className={`${
                        msg.sender_id === currentUserId ? 'text-gray-800' : 'text-green-700 font-semibold'
                      }`}>
                        <strong>
                          {msg.sender_id === currentUserId 
                            ? 'You' 
                            : selectedTherapist.full_name}:
                        </strong> {msg.content}
                      </p>
                      <div className={`text-xs mt-1 ${
                        msg.sender_id === currentUserId 
                          ? 'text-right' 
                          : 'text-left'
                      } text-gray-500`}>
                        {formatTime(msg.created_at)}
                        {msg.sender_id === currentUserId && (
                          <span className="ml-2">
                            {msg.status === MessageStatusEnum.Read 
                              ? '✓✓' 
                              : msg.status === MessageStatusEnum.Delivered 
                                ? '✓✓' 
                                : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-2 mb-2 rounded">
                {error}
              </div>
            )}
            
            {/* Message input */}
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border border-green-500 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!messageInput.trim() || isLoading}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </>
        ) : (
          <p className="text-green-700 font-semibold">Select a user to send a message</p>
        )}
      </div>
      
      {/* Rating Modal */}
      {showRatingModal && selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Rate {selectedTherapist.full_name}</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Rating</label>
              <RatingStars 
                currentRating={currentRating} 
                editable={true} 
                onChange={setCurrentRating} 
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Feedback (Optional)</label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                placeholder="Share your experience with this therapist..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={currentRating === 0}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMessage;