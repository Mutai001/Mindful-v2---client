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

// User interface
interface User {
  id: number;
  name: string;
  specialty?: string;
  avatar_url?: string;
}

const UserMessage = () => {
  const [therapists] = useState<User[]>([
    { id: 1, name: 'Dr. Mark Okwena', specialty: 'Psychiatrist', avatar_url: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Dr. Celestina Kweyu', specialty: 'Psychologist', avatar_url: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Dr. Faith Ndungwa', specialty: 'Therapist', avatar_url: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Dr. Cyrus Kimutai', specialty: 'Licensed Counselor', avatar_url: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Dr. Riyan Moraa', specialty: 'Neuropsychiatrist', avatar_url: 'https://via.placeholder.com/40' },
    { id: 6, name: 'Dr. Christine Monyancha', specialty: 'Clinical Social Worker', avatar_url: 'https://via.placeholder.com/40' }
  ]);
  
  // Get current user ID from authentication
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get the selected therapist object
  const selectedTherapist = selectedTherapistId 
    ? therapists.find(t => t.id === selectedTherapistId) 
    : null;

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (messageIds: number[]) => {
    if (!authToken) return;
    
    try {
      await fetch('http://localhost:8000/api/messages/read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          messageIds
        })
      });
      
      // Update local message state to reflect read status
      setMessages(prev => 
        prev.map(msg => 
          messageIds.includes(msg.id) 
            ? { ...msg, is_read: true, status: MessageStatusEnum.Read } 
            : msg
        )
      );
      
      // Refresh unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [authToken]);

  // Get authentication token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setAuthToken(token);
      
      // Decode token to get user ID or fetch user profile
      // This is a simplified approach - in reality, you might need to decode JWT or fetch user profile
      try {
        // For demo purposes, assuming we can get user ID from token
        // In a real app, you'd likely decode the JWT or make an API call to get the current user
        const userId = 1; // Replace with actual user ID from token
        setCurrentUserId(userId);
      } catch (error) {
        console.error('Error getting user from token:', error);
        setError('Authentication error. Please log in again.');
      }
    } else {
      setError('You need to log in to access messages');
    }
  }, []);

  // Fetch unread message count
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUserId || !authToken) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/users/${currentUserId}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch unread count');
      
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [currentUserId, authToken]);

  // Fetch conversation messages
  const fetchMessages = useCallback(async () => {
    if (!currentUserId || !selectedTherapistId || !authToken) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/messages/conversations/${currentUserId}/${selectedTherapistId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data);
      
      // Mark received messages as read
      const unreadMessages = data
        .filter((msg: Message) => msg.receiver_id === currentUserId && !msg.is_read)
        .map((msg: Message) => msg.id);
      
      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages);
      }
    } catch (error) {
      setError('Failed to load messages');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, selectedTherapistId, authToken, markMessagesAsRead]);

  // Send a new message
  const sendMessage = async () => {
    if (!currentUserId || !selectedTherapistId || !messageInput.trim() || !authToken) return;
    
    try {
      const messageData = {
        sender_id: currentUserId,
        receiver_id: selectedTherapistId,
        content: messageInput,
        booking_id: 29, // Optional, could be dynamic based on context
      };
      
      const response = await fetch('http://localhost:8000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(messageData)
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      
      // Refresh messages to get any response from the therapist
      setTimeout(() => {
        fetchMessages();
      }, 1000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send message');
      console.error(error);
    }
  };

  // Handle therapist selection
  const handleTherapistSelect = (therapistId: number) => {
    setSelectedTherapistId(therapistId);
    setMessages([]); // Clear previous messages when switching therapists
    setError(null);
  };

  // Load messages when therapist is selected
  useEffect(() => {
    if (currentUserId && selectedTherapistId) {
      fetchMessages();
    }
  }, [currentUserId, selectedTherapistId, fetchMessages]);

  // Fetch unread count periodically
  useEffect(() => {
    fetchUnreadCount();
    
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle authentication error
  if (!authToken || !currentUserId) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-100 text-red-700 p-4 rounded-lg">
        <p>{error || 'Please log in to access messages'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto p-4 md:p-8 bg-green-100 rounded-lg shadow-md">
      {/* Therapist selection sidebar */}
      <div className="w-full md:w-1/3 p-4 bg-green-200 rounded-lg mb-4 md:mb-0 md:mr-4">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Choose a Therapist</h2>
        <ul className="space-y-2">
          {therapists.map((therapist) => (
            <li
              key={therapist.id}
              onClick={() => handleTherapistSelect(therapist.id)}
              className={`p-2 cursor-pointer rounded-lg text-green-900 hover:bg-green-400 transition ${
                selectedTherapistId === therapist.id ? 'bg-green-600 text-white' : 'bg-green-300'
              }`}
            >
              {therapist.name} - {therapist.specialty}
            </li>
          ))}
        </ul>
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
            {/* Chat header */}
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              Chat with {selectedTherapist.name}
            </h2>
            
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
                            : selectedTherapist.name}:
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
          <p className="text-green-700 font-semibold">Select a therapist to send a message</p>
        )}
      </div>
    </div>
  );
};

export default UserMessage;