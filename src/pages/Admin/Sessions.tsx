import { useEffect, useState } from "react";
import AdminLayout from "../../Components/Admin/AdminLayout";

interface Session {
  id: number;
  user_id: number;
  therapist_id: number;
  session_date: string;
  session_notes: string;
}

interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  experience_years: number;
  contact_phone: string;
}

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [newSession, setNewSession] = useState({
    user_id: "",
    therapist_id: "",
    session_date: "",
    session_notes: "",
  });

  useEffect(() => {
    fetchSessions();
    fetchTherapists();
  }, []);

  // Fetch Sessions from Backend
  const fetchSessions = async () => {
    const response = await fetch("http://localhost:8000/api/session");
    const data = await response.json();
    setSessions(data);
  };

  // Fetch Therapists from Backend
  const fetchTherapists = async () => {
    const response = await fetch("http://localhost:8000/api/session");
    const data = await response.json();
    setTherapists(data);
  };

  // Create a New Session
  const handleCreate = async () => {
    await fetch("http://localhost:8000/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession),
    });
    setNewSession({ user_id: "", therapist_id: "", session_date: "", session_notes: "" });
    fetchSessions();
  };

  // Delete a Session
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/session/${id}`, { method: "DELETE" });
    fetchSessions();
  };

  // Function to generate avatar initials
  const getAvatarInitials = (name: string) => {
    const names = name.split(" ");
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Therapy Sessions</h2>

      {/* Create Session Form */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mb-4">
        <input
          type="number"
          placeholder="User ID"
          className="border p-2 w-full sm:w-auto"
          value={newSession.user_id}
          onChange={(e) => setNewSession({ ...newSession, user_id: e.target.value })}
        />

        {/* Therapist Dropdown */}
        <label htmlFor="therapist-select" className="sr-only">Select Therapist</label>
        <select
          id="therapist-select"
          className="border p-2 w-full sm:w-auto"
          value={newSession.therapist_id}
          onChange={(e) => setNewSession({ ...newSession, therapist_id: e.target.value })}
        >
          <option value="">Select Therapist</option>
          {therapists.map((therapist) => (
            <option key={therapist.id} value={therapist.id}>
              {therapist.full_name} ({therapist.specialization})
            </option>
          ))}
        </select>

        <label htmlFor="session-date" className="sr-only">Session Date</label>
        <input
          id="session-date"
          type="date"
          className="border p-2 w-full sm:w-auto"
          value={newSession.session_date}
          onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })}
        />

        <input
          type="text"
          placeholder="Session Notes"
          className="border p-2 w-full sm:w-auto"
          value={newSession.session_notes}
          onChange={(e) => setNewSession({ ...newSession, session_notes: e.target.value })}
        />

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 w-full sm:w-auto"
        >
          Add Session
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="bg-green-600 text-white border-b border-gray-300">
              <th className="p-2 border-r">ID</th>
              <th className="p-2 border-r">User ID</th>
              <th className="p-2 border-r">Therapist</th>
              <th className="p-2 border-r">Session Date</th>
              <th className="p-2 border-r">Session Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const therapist = therapists.find((t) => t.id === session.therapist_id);
              return (
                <tr key={session.id} className="border-b border-gray-300 text-center">
                  <td className="p-2 border-r">{session.id}</td>
                  <td className="p-2 border-r">{session.user_id}</td>
                  <td className="p-2 border-r">
                    <div className="flex items-center justify-center gap-2">
                      {/* Therapist Avatar */}
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {therapist ? getAvatarInitials(therapist.full_name) : "N/A"}
                      </div>
                      {/* Therapist Details */}
                      <div className="text-left">
                        <p className="font-semibold">{therapist?.full_name || "N/A"}</p>
                        <p className="text-sm text-gray-600">{therapist?.specialization || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 border-r">{new Date(session.session_date).toLocaleDateString()}</td>
                  <td className="p-2 border-r">{session.session_notes}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="bg-red-600 text-white px-4 py-1 w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Sessions;