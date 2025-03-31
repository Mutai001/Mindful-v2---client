import { useState, useEffect } from "react";

interface Patient {
  id: number;
  name: string;
  state: string;
  messages: { sender: string; text: string }[];
  full_name?: string;
  email?: string;
  contact_phone?: string;
  address?: string;
}

interface Session {
  id: number;
  user_id: number;
  therapist_id: number;
  book_id: number;
  session_date: string;
  session_notes: string;
  created_at: string;
}

const PatientDashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [reply, setReply] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<"messages" | "sessions">("messages");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New session form state
  const [sessionDate, setSessionDate] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Fetch patients and sessions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch patients
        const patientsResponse = await fetch("http://localhost:8000/api/bookings");
        if (!patientsResponse.ok) throw new Error("Failed to fetch patients");
        const patientsData = await patientsResponse.json();
        
        // Filter patients by role
        const filteredPatients = patientsData.data
          .filter((booking: { patient?: { role: string } }) => booking.patient && booking.patient.role === "patient")
          .map((booking: { patient: { id: number; full_name?: string; email?: string; contact_phone?: string; address?: string; role: string } }) => ({
            id: booking.patient.id,
            name: booking.patient.full_name || "Unknown",
            state: "Active",
            messages: [{ sender: booking.patient.full_name, text: "Hello, I'd like to schedule a session." }],
            full_name: booking.patient.full_name,
            email: booking.patient.email,
            contact_phone: booking.patient.contact_phone,
            address: booking.patient.address
          }));
        
        setPatients(filteredPatients);
        
        // Fetch sessions
        const sessionsResponse = await fetch("http://localhost:8000/api/sessions");
        if (!sessionsResponse.ok) throw new Error("Failed to fetch sessions");
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData.data || []);
        
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab("messages");
  };

  const handleSendReply = () => {
    if (selectedPatient && reply.trim() !== "") {
      const updatedPatients = patients.map(p => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            messages: [...p.messages, { sender: "Therapist", text: reply }]
          };
        }
        return p;
      });
      
      setPatients(updatedPatients);
      setSelectedPatient({
        ...selectedPatient,
        messages: [...selectedPatient.messages, { sender: "Therapist", text: reply }]
      });
      setReply("");
    }
  };

  const handleCreateSession = async () => {
    if (!selectedPatient) return;
    
    try {
      const payload = {
        user_id: selectedPatient.id,
        therapist_id: 16, // Assuming fixed therapist ID for demo
        book_id: 2, // Assuming fixed book ID for demo
        session_date: new Date(sessionDate).toISOString(),
        session_notes: sessionNotes
      };
      
      const response = await fetch("http://localhost:8000/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error("Failed to create session");
      
      const result = await response.json();
      setSessions([...sessions, result.data]);
      setSessionDate("");
      setSessionNotes("");
      setFormVisible(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleUpdateSession = async () => {
    if (!editingSession) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/sessions/${editingSession.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session_notes: sessionNotes
        })
      });
      
      if (!response.ok) throw new Error("Failed to update session");
      
      const updatedSessions = sessions.map(session => 
        session.id === editingSession.id ? { ...session, session_notes: sessionNotes } : session
      );
      
      setSessions(updatedSessions);
      setSessionNotes("");
      setEditingSession(null);
      setFormVisible(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/sessions/${sessionId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete session");
      
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const editSession = (session: Session) => {
    setEditingSession(session);
    setSessionNotes(session.session_notes);
    setFormVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getPatientSessions = () => {
    if (!selectedPatient) return [];
    return sessions.filter(session => session.user_id === selectedPatient.id);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-teal-500 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        </div>
        <p className="text-center mt-4 text-lg font-medium text-gray-700">Loading patient data...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-xl border-l-4 border-red-500">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Column - Patient List */}
          <div className="lg:w-1/4 bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Patients
            </h2>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr 
                      key={patient.id} 
                      onClick={() => handlePatientSelect(patient)}
                      className={`cursor-pointer border-b border-gray-200 hover:bg-teal-50 transition duration-150 ${
                        selectedPatient?.id === patient.id ? "bg-teal-100" : ""
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">{patient.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {patient.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Patient Details & Interaction */}
          <div className="lg:w-3/4 p-6">
            {selectedPatient ? (
              <>
                {/* Patient Info Card */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-6 mb-6 text-white shadow-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-teal-600 text-2xl font-bold mr-4">
                        {selectedPatient.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPatient.full_name || selectedPatient.name}</h2>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{selectedPatient.email || "No email available"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-teal-100 text-sm">Phone</p>
                        <p className="font-medium">{selectedPatient.contact_phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-teal-100 text-sm">Address</p>
                        <p className="font-medium">{selectedPatient.address || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab("messages")}
                      className={`py-2 px-4 font-medium ${
                        activeTab === "messages"
                          ? "border-b-2 border-teal-500 text-teal-600"
                          : "text-gray-500 hover:text-teal-500"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Messages
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("sessions")}
                      className={`py-2 px-4 font-medium ${
                        activeTab === "sessions"
                          ? "border-b-2 border-teal-500 text-teal-600"
                          : "text-gray-500 hover:text-teal-500"
                      }`}
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Sessions
                      </div>
                    </button>
                  </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === "messages" && (
                  <div className="bg-white rounded-xl shadow-md">
                    <div className="p-4">
                      <div className="overflow-y-auto h-64 p-4 mb-4 bg-gray-50 rounded-lg">
                        {selectedPatient.messages.map((message, index) => (
                          <div
                            key={index}
                            className={`mb-3 p-3 rounded-lg ${
                              message.sender === "Therapist"
                                ? "bg-teal-100 text-teal-800 ml-12"
                                : "bg-gray-200 text-gray-800 mr-12"
                            }`}
                          >
                            <div className="font-medium mb-1">{message.sender}</div>
                            <div>{message.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Type your response..."
                        />
                        <button
                          onClick={handleSendReply}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 rounded-r-lg transition duration-200"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "sessions" && (
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Therapy Sessions</h3>
                      {!formVisible && (
                        <button
                          onClick={() => {
                            setFormVisible(true);
                            setEditingSession(null);
                            setSessionDate("");
                            setSessionNotes("");
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white flex items-center px-4 py-2 rounded-lg transition duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          New Session
                        </button>
                      )}
                    </div>

                    {formVisible && (
                      <div className="mb-6 p-4 border border-teal-200 rounded-lg bg-teal-50">
                        <h4 className="text-lg font-medium text-teal-800 mb-3">
                          {editingSession ? "Update Session" : "Schedule New Session"}
                        </h4>
                        <div className="mb-4">
                          {!editingSession && (
                            <>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Session Date</label>
                              <input
                                type="datetime-local"
                                value={sessionDate}
                                onChange={(e) => setSessionDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Select session date and time"
                              />
                            </>
                          )}
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Session Notes</label>
                          <textarea
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded h-24 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Enter session notes here..."
                          ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {
                              setFormVisible(false);
                              setEditingSession(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={editingSession ? handleUpdateSession : handleCreateSession}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
                          >
                            {editingSession ? "Update" : "Create"}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getPatientSessions().length === 0 ? (
                            <tr>
                              <td colSpan={3} className="py-4 px-6 text-center text-gray-500">
                                No sessions found for this patient
                              </td>
                            </tr>
                          ) : (
                            getPatientSessions().map((session) => (
                              <tr key={session.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">{formatDate(session.session_date)}</td>
                                <td className="py-3 px-4">
                                  <div className="line-clamp-2">{session.session_notes}</div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={() => editSession(session)}
                                      className="p-1 text-blue-600 hover:text-blue-800"
                                      title="Edit Session"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSession(session.id)}
                                      className="p-1 text-red-600 hover:text-red-800"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <svg className="w-16 h-16 mb-4 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-xl font-medium">Select a patient to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;