import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for the mobile menu
import { Link } from "react-router-dom";
import logo from "../assets/images/mindful logo.png"; // Import your logo

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-900 to-green-600 text-white p-4 flex justify-between items-center shadow-lg">
      {/* Logo and Name */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src={logo} // Use the imported logo
          alt="Mindful Logo"
          className="h-10" // Adjust height as needed
        />
        <span className="text-2xl font-bold">Mindful</span> {/* Name */}
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 items-center">
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/specialists"
              className="hover:text-green-300 transition-colors duration-300"
            >
              Doctors
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-green-300 transition-colors duration-300"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="hover:text-green-300 transition-colors duration-300"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/booktraining"
              className="hover:text-green-300 transition-colors duration-300"
            >
              Book Training
            </Link>
          </li>
          <li>
            <Link
              to="/case"
              className="hover:text-green-300 transition-colors duration-300"
            >
              Case Studies
            </Link>
          </li>
        </ul>

        {/* Contact Button (Desktop) */}
        <Link
          to="/contact"
          className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition-colors duration-300"
        >
          Contact Us
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-green-900 text-white flex flex-col items-center space-y-4 py-6 md:hidden shadow-lg">
          <Link
            to="/doctor"
            className="hover:text-green-300 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Doctors
          </Link>
          <Link
            to="/login"
            className="hover:text-green-300 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:text-green-300 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
          <Link
            to="/booktraining"
            className="hover:text-green-300 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Book Training
          </Link>
          <Link
            to="/case"
            className="hover:text-green-300 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Case Studies
          </Link>
          <Link
            to="/contact"
            className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;