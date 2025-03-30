import { useState } from "react";
import { FaCalendarAlt, FaRegComment, FaChartLine, FaVideo, FaBars, FaTimes, FaHome, FaUserMd, FaRobot, FaSignOutAlt, FaSearch, FaBookMedical } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "chart.js/auto";

// Import images
// import DashboardIllustration from "../assets/images/case3.avif";
import Doctor1 from "../assets/images/Doc 1.webp";
import Doctor2 from "../assets/images/Doc 2.webp";
import Doctor3 from "../assets/images/Doc 3.jpg";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("services"); // 'services' or 'doctors'
  const navigate = useNavigate();

  // Sample doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Celestina Kweyu",
      specialty: "Cardiologist",
      availability: "Mon, Wed, Fri",
      image: Doctor1,
      rating: 4.8
    },
    {
      id: 2,
      name: "Dr.Cyrus Kimutai",
      specialty: "Neurologist",
      availability: "Tue, Thu, Sat",
      image: Doctor2,
      rating: 4.9
    },
    {
      id: 3,
      name: "Dr. Riyan Moraa",
      specialty: "Pediatrician",
      availability: "Mon-Fri",
      image: Doctor3,
      rating: 4.7
    }
  ];

  // Handle Check Condition
  const handleCheckCondition = () => {
    if (!userInput) {
      setFeedback("Please enter your symptoms.");
      return;
    }

    if (userInput.toLowerCase().includes("fever") || userInput.toLowerCase().includes("cough")) {
      setFeedback("You might have flu. Please stay hydrated and rest.");
    } else {
      setFeedback("Your condition seems normal. Stay healthy!");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-green-700 text-white w-64 p-5 transition-all duration-300 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Health Portal</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden" title="Close Sidebar">
            <FaTimes size={20} />
          </button>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center p-2 hover:bg-green-600 rounded">
                <FaHome className="mr-3" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/user-bookings" className="flex items-center p-2 hover:bg-green-600 rounded">
                <FaCalendarAlt className="mr-3" /> My Appointments
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/doctor" className="flex items-center p-2 hover:bg-green-600 rounded">
                <FaUserMd className="mr-3" /> Find Doctors
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/sessions" className="flex items-center p-2 hover:bg-green-600 rounded">
                <FaBookMedical className="mr-3" /> Book Session
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/user-message" className="flex items-center p-2 hover:bg-green-600 rounded">
                <FaRegComment className="mr-3" /> Messages
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/chatbot" className="flex items-center p-2 hover:bg-green-600 rounded">
                <FaRobot className="mr-3" /> Health AI Assistant
              </Link>
            </li>
            <li className="mb-4">
              <button onClick={handleLogout} className="flex items-center p-2 w-full hover:bg-green-600 rounded">
                <FaSignOutAlt className="mr-3" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-green-50">
        {/* Top Section */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden" title="Open Sidebar">
            <FaBars size={24} />
          </button>
          <h1 className="text-3xl font-bold text-green-800">Welcome to Your Health Portal</h1>
          {/* <img src={DashboardIllustration} alt="Dashboard" className="w-32 h-auto" /> */}
        </div>

        {/* Services Navigation */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "services" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("services")}
          >
            Health Services
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "doctors" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("doctors")}
          >
            Available Doctors
          </button>
        </div>

        {activeTab === "services" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book a Session */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaBookMedical className="text-green-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Book a Session</h2>
              <p className="text-gray-600 mb-4">Schedule an appointment with our specialists.</p>
              <Link to="/sessions" className="px-4 py-2 bg-green-600 text-white rounded-md inline-block hover:bg-green-700 transition-colors">
                Book Now
              </Link>
            </div>

            {/* Ask Health AI */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaRobot className="text-green-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ask Health AI</h2>
              <p className="text-gray-600 mb-4">Get instant answers to your health questions.</p>
              <Link to="/chatbot" className="px-4 py-2 bg-green-600 text-white rounded-md inline-block hover:bg-green-700 transition-colors">
                Chat Now
              </Link>
            </div>

            {/* Symptom Checker */}
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Symptom Checker</h2>
              <input
                type="text"
                placeholder="Describe your symptoms..."
                className="p-2 border border-gray-300 rounded w-full mb-3"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button 
                onClick={handleCheckCondition} 
                className="px-4 py-2 bg-green-600 text-white rounded-md w-full hover:bg-green-700 transition-colors"
              >
                Check Symptoms
              </button>
              {feedback && <p className="text-sm text-gray-700 mt-3 p-2 bg-gray-100 rounded">{feedback}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors by specialty, name..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            {/* Doctors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-green-600">{doctor.specialty}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 text-sm">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600"><span className="font-medium">Availability:</span> {doctor.availability}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to="/sessions" 
                        className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-center"
                      >
                        Book Now
                      </Link>
                      <Link 
                        to="/sessions" 
                        className="flex-1 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors text-center"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Appointment (always visible) */}
        <div className="mt-8 bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Upcoming Appointment</h2>
          <div className="flex items-center">
            <img src={Doctor2} alt="Doctor" className="w-16 h-16 rounded-full object-cover mr-4" />
            <div className="flex-1">
              <h3 className="font-semibold">Dr. Mark Okwena</h3>
              <p className="text-gray-600">Neurology Consultation</p>
              <p className="text-sm text-gray-500">Tomorrow, 14 Mar 2025 at 9:00 AM</p>
            </div>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition-colors"
            >
              <FaVideo className="mr-2" /> Join Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;