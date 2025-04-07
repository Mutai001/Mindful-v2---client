import { useState, useEffect } from "react";
import { FaCalendarAlt, FaRegComment, FaChartLine, FaVideo, FaBars, FaTimes, FaUserMd, FaRobot, FaSignOutAlt, FaSearch, FaBookMedical, FaHeartbeat, FaChevronRight } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "chart.js/auto";

// Import images
import Doctor1 from "../assets/images/Doc 1.webp";
import Doctor2 from "../assets/images/Doc 2.webp";
import Doctor3 from "../assets/images/Doc 3.jpg";

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [activeTab, setActiveTab] = useState("services"); // 'services' or 'doctors'
  const navigate = useNavigate();
  const location = useLocation();

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

  // Check if the current path matches a navigation item
  const isActive = (path: string) => {
    return location.pathname === path;
  };

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

  // Time-based greeting
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-gradient-to-b from-green-800 to-green-600 text-white w-72 transition-all duration-300 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed h-full z-40 md:relative md:translate-x-0 overflow-hidden`}
      >
        {/* Sidebar Header with Brand */}
        <div className="p-6 border-b border-green-700 border-opacity-50">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <FaHeartbeat className="text-2xl text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wider">Vitality Connect</h2>
              <p className="text-green-200 text-xs">Your Health Companion</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 right-4 md:hidden">
            <FaTimes size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-4 border-b border-green-700 border-opacity-50 bg-green-700 bg-opacity-30">
          <p className="text-sm text-green-200 mb-1">{greeting}</p>
          <p className="font-medium text-lg">Sarah Johnson</p>
        </div>

        {/* Navigation Menu - Wrapped in flex-grow div to push logout to bottom */}
        <div className="flex-grow overflow-y-auto">
          <nav className="p-4">
            <p className="text-xs uppercase text-green-300 font-semibold tracking-wider px-2 mb-4">Main Navigation</p>
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/user-bookings" 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive("/user-bookings") 
                      ? "bg-white text-green-700 shadow-md" 
                      : "text-white hover:bg-green-700"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    isActive("/user-bookings") 
                      ? "bg-green-100 text-green-600" 
                      : "bg-green-600 group-hover:bg-green-500"
                  }`}>
                    <FaCalendarAlt className="text-sm" />
                  </div>
                  <span>My Appointments</span>
                  {isActive("/user-bookings") && <FaChevronRight className="ml-auto" size={12} />}
                </Link>
              </li>
              <li>
                <Link 
                  to="/doctor" 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive("/doctor") 
                      ? "bg-white text-green-700 shadow-md" 
                      : "text-white hover:bg-green-700"
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    isActive("/doctor") 
                      ? "bg-green-100 text-green-600" 
                      : "bg-green-600 group-hover:bg-green-500"
                  }`}>
                    <FaUserMd className="text-sm" />
                  </div>
                  <span>Find Doctors</span>
                  {isActive("/doctor") && <FaChevronRight className="ml-auto" size={12} />}
                </Link>
              </li>
              <li>
                <Link 
                  to="/sessions" 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive("/sessions") 
                      ? "bg-white text-green-700 shadow-md" 
                      : "text-white hover:bg-green-700"
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    isActive("/sessions") 
                      ? "bg-green-100 text-green-600" 
                      : "bg-green-600 group-hover:bg-green-500"
                  }`}>
                    <FaBookMedical className="text-sm" />
                  </div>
                  <span>Book Session</span>
                  {isActive("/sessions") && <FaChevronRight className="ml-auto" size={12} />}
                </Link>
              </li>
            </ul>

            <p className="text-xs uppercase text-green-300 font-semibold tracking-wider px-2 mt-6 mb-4">Communication</p>
            
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/user-message" 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive("/user-message") 
                      ? "bg-white text-green-700 shadow-md" 
                      : "text-white hover:bg-green-700"
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    isActive("/user-message") 
                      ? "bg-green-100 text-green-600" 
                      : "bg-green-600 group-hover:bg-green-500"
                  }`}>
                    <FaRegComment className="text-sm" />
                  </div>
                  <span>Messages</span>
                  <span className="ml-auto bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/chatbot" 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive("/chatbot") 
                      ? "bg-white text-green-700 shadow-md" 
                      : "text-white hover:bg-green-700"
                  }`}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    isActive("/chatbot") 
                      ? "bg-green-100 text-green-600" 
                      : "bg-green-600 group-hover:bg-green-500"
                  }`}>
                    <FaRobot className="text-sm" />
                  </div>
                  <span>Health AI Assistant</span>
                  {isActive("/chatbot") && <FaChevronRight className="ml-auto" size={12} />}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Section with Logout */}
        <div className="p-4 border-t border-green-700 border-opacity-50 bg-green-800 bg-opacity-40">
          <button 
            onClick={handleLogout} 
            className="flex items-center p-3 w-full rounded-lg text-white hover:bg-green-700 transition-all duration-200"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 mr-3">
              <FaSignOutAlt className="text-sm" />
            </div>
            <span>Logout</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 rounded-full opacity-10 -mr-8 -mt-8"></div>
        <div className="absolute bottom-32 left-0 w-16 h-16 bg-green-500 rounded-full opacity-10 -ml-8"></div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="mr-4 text-gray-600 md:hidden"
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{greeting}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              <FaRegComment className="text-gray-600" />
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
              SJ
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl p-6 mb-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full opacity-10 -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full opacity-10 -ml-10 -mb-10"></div>
            <h1 className="text-3xl font-bold z-10 relative">Welcome to Your Wellness Journey</h1>
            <p className="mt-2 max-w-lg opacity-90">Take control of your health with personalized care and guidance.</p>
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
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-green-500 group">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <FaBookMedical className="text-2xl text-green-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Book a Session</h2>
                <p className="text-gray-600 mb-4">Schedule an appointment with our specialists.</p>
                <Link to="/sessions" className="px-4 py-2 bg-green-600 text-white rounded-md inline-block hover:bg-green-700 transition-colors">
                  Book Now
                </Link>
              </div>

              {/* Ask Health AI */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-green-500 group">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                  <FaRobot className="text-2xl text-green-600 group-hover:text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Ask Health AI</h2>
                <p className="text-gray-600 mb-4">Get instant answers to your health questions.</p>
                <Link to="/chatbot" className="px-4 py-2 bg-green-600 text-white rounded-md inline-block hover:bg-green-700 transition-colors">
                  Chat Now
                </Link>
              </div>

              {/* Symptom Checker */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-green-500">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <FaChartLine className="text-2xl text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Symptom Checker</h2>
                <input
                  type="text"
                  placeholder="Describe your symptoms..."
                  className="p-3 border border-gray-300 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <button 
                  onClick={handleCheckCondition} 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg w-full hover:bg-green-700 transition-colors"
                >
                  Check Symptoms
                </button>
                {feedback && <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-100 rounded-lg">{feedback}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search doctors by specialty, name..."
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-4 top-4 text-gray-400" />
              </div>

              {/* Doctors List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="h-2 bg-green-500 group-hover:h-3 transition-all duration-300"></div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="relative">
                          <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-green-200 group-hover:border-green-500 transition-all duration-300" />
                          <div className="absolute bottom-0 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
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
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                        >
                          Book Now
                        </Link>
                        <Link 
                          to="/sessions" 
                          className="flex-1 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-center"
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
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h2 className="text-xl font-semibold mb-4">Your Upcoming Appointment</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="relative mb-4 md:mb-0">
                <img src={Doctor2} alt="Doctor" className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-green-200" />
                <div className="absolute bottom-0 right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 md:ml-4">
                <h3 className="font-semibold text-lg">Dr. Mark Okwena</h3>
                <p className="text-green-600">Neurology Consultation</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <FaCalendarAlt className="mr-2" />
                  <span>Tomorrow, 14 Mar 2025 at 9:00 AM</span>
                </div>
              </div>
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 px-4 py-3 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 transition-colors"
              >
                <FaVideo className="mr-2" /> Join Call
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;