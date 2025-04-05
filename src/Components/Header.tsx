import React, { useState, useEffect } from "react";
import { Menu, X, User, BookOpen, ClipboardList, Phone, Home, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/images/mindful logo.png";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", name: "Home", icon: <Home size={18} className="mr-1" /> },
    { path: "/specialists", name: "Doctors", icon: <User size={18} className="mr-1" /> },
    { path: "/login", name: "Login", icon: <LogIn size={18} className="mr-1" /> },
    { path: "/booktraining", name: "Training", icon: <BookOpen size={18} className="mr-1" /> },
    { path: "/case", name: "Case Studies", icon: <ClipboardList size={18} className="mr-1" /> },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`fixed w-full z-50 ${
        scrolled
          ? "bg-gradient-to-r from-green-900 to-green-700 shadow-xl"
          : "bg-gradient-to-r from-green-900/95 to-green-600/95"
      } text-white p-4 flex justify-between items-center transition-all duration-300`}
    >
      {/* Logo and Name with animation */}
      <Link to="/" className="flex items-center space-x-2">
        <motion.img
          src={logo}
          alt="Mindful Logo"
          className="h-10"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <motion.span
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-white"
          whileHover={{ scale: 1.05 }}
        >
          Mindful
        </motion.span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 items-center">
        <ul className="flex space-x-6">
          {navItems.map((item, index) => (
            <li key={item.path}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center hover:text-green-300 transition-colors duration-300"
                >
                  {item.icon}
                  {item.name}
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

        {/* Contact Button with pulse animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Link
            to="/contact"
            className="flex items-center bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition-colors duration-300 shadow-lg"
          >
            <Phone size={18} className="mr-1" />
            Contact Us
          </Link>
        </motion.div>
      </nav>

      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>

      {/* Mobile Menu Dropdown with animation from bottom */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed md:hidden bottom-0 left-0 right-0 bg-green-800 text-white rounded-t-3xl shadow-2xl p-6 z-40"
            style={{ height: "70vh" }}
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-green-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="h-full flex flex-col justify-between">
              <ul className="space-y-6">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <motion.div
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center text-xl p-3 hover:bg-green-700 rounded-lg transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-auto"
              >
                <Link
                  to="/contact"
                  className="flex items-center justify-center bg-green-500 px-6 py-3 rounded-xl text-white hover:bg-green-600 transition-colors duration-300 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Phone size={20} className="mr-2" />
                  Contact Us
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when mobile menu is open */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;