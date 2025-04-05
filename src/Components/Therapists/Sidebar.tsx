import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCalendar, FaHeadSideVirus, FaComments, FaCog, FaSignOutAlt } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Prevent link clicks from closing the sidebar
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  return (
    <div 
      className={`fixed left-0 top-16 bg-green-900 text-white p-5 flex flex-col z-50
      ${isOpen ? "w-64" : "w-20"} h-[calc(100vh-4rem)] transition-all duration-300 shadow-lg overflow-y-auto
      md:static md:z-0 md:h-screen`}
    >
      {/* Toggle Button - Only visible on mobile */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden text-xl mb-6 p-2 rounded bg-green-800 hover:bg-green-700 transition"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation */}
      <nav className="flex flex-col space-y-6 text-lg">
        <Link 
          to="/therapist-bookings" 
          onClick={handleLinkClick}
          className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition"
        >
          <FaCalendar size={24} /> 
          <span className={`${isOpen ? "inline" : "hidden"} transition-all md:inline`}>Sessions</span>
        </Link>
        <Link 
          to="/appointments-requests" 
          onClick={handleLinkClick}
          className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition"
        >
          <FaCalendar size={24} /> 
          <span className={`${isOpen ? "inline" : "hidden"} transition-all md:inline`}>Appointments</span>
        </Link>
        <Link 
          to="/patient-overview" 
          onClick={handleLinkClick}
          className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition"
        >
          <FaHeadSideVirus size={24} /> 
          <span className={`${isOpen ? "inline" : "hidden"} transition-all md:inline`}>Patients</span>
        </Link>
        <Link 
          to="/chatbot" 
          onClick={handleLinkClick}
          className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition"
        >
          <FaComments size={24} /> 
          <span className={`${isOpen ? "inline" : "hidden"} transition-all md:inline`}>Chatbot</span>
        </Link>
        <Link 
          to="/settings" 
          onClick={handleLinkClick}
          className="flex items-center gap-3 p-2 rounded hover:bg-green-700 transition"
        >
          <FaCog size={24} /> 
          <span className={`${isOpen ? "inline" : "hidden"} transition-all md:inline`}>Settings</span>
        </Link>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 p-2 text-red-400 hover:bg-red-700 hover:text-white rounded transition"
        >
          <FaSignOutAlt size={24} /> 
          <span className={`${isOpen ? "inline" : "hidden"} transition-all md:inline`}>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;