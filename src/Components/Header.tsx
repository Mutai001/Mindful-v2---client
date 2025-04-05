import React, { useState, useEffect, useCallback } from "react";
import { Menu, X, User, BookOpen, ClipboardList, Phone, Home, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/mindful logo.png";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Throttle function for performance
  function throttle(func: () => void, limit: number) {
    let lastFunc: number;
    let lastRan: number;
    return (...args: Parameters<typeof func>) => {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = window.setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  const navItems = [
    { path: "/", name: "Home", icon: <Home size={18} className="mr-1" /> },
    { path: "/specialists", name: "Doctors", icon: <User size={18} className="mr-1" /> },
    { path: "/login", name: "Login", icon: <LogIn size={18} className="mr-1" /> },
    { path: "/booktraining", name: "Training", icon: <BookOpen size={18} className="mr-1" /> },
    { path: "/case", name: "Case Studies", icon: <ClipboardList size={18} className="mr-1" /> },
  ];

  // Check if device is touch capable
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className={`fixed w-full z-50 ${
        scrolled
          ? "bg-gradient-to-r from-green-900 to-green-700 shadow-xl"
          : "bg-gradient-to-r from-green-900/95 to-green-600/95"
      } text-white p-2 sm:p-4 flex justify-between items-center transition-all duration-300`}
      role="banner"
    >
      {/* Logo and Name */}
      <Link 
        to="/" 
        className="flex items-center space-x-2 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-white"
        aria-label="Mindful Home"
      >
        <motion.img
          src={logo}
          alt=""
          className="h-8 sm:h-10 w-auto"
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
          width="40"
          height="40"
          loading="eager"
        />
        <motion.span
          className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-white"
          whileHover={{ scale: 1.05 }}
        >
          Mindful
        </motion.span>
      </Link>

      {/* Desktop Navigation */}
      <nav 
        className="hidden md:flex space-x-2 lg:space-x-6 items-center" 
        aria-label="Main navigation"
      >
        <ul className="flex space-x-2 lg:space-x-6">
          {navItems.map((item, index) => (
            <li key={item.path}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: isTouchDevice() ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center hover:text-green-300 transition-colors duration-300 p-2 rounded-lg ${
                    location.pathname === item.path ? 'bg-green-700/50' : ''
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.icon}
                  <span className="text-sm lg:text-base">{item.name}</span>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

        {/* Contact Button */}
        <motion.div
          whileHover={{ scale: isTouchDevice() ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Link
            to="/contact"
            className="flex items-center bg-green-500 px-3 py-1 lg:px-4 lg:py-2 rounded-lg text-white hover:bg-green-600 transition-colors duration-300 shadow-lg text-sm lg:text-base"
            aria-label="Contact Us"
          >
            <Phone size={18} className="mr-1" />
            <span>Contact Us</span>
          </Link>
        </motion.div>
      </nav>

      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden focus:outline-none p-2 rounded-full focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: isTouchDevice() ? 1 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed md:hidden bottom-0 left-0 right-0 bg-green-800 text-white rounded-t-3xl shadow-2xl p-4 z-40"
              style={{ height: "80vh", maxHeight: "calc(100vh - 60px)" }}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-green-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="h-full flex flex-col justify-between overflow-y-auto">
                <ul className="space-y-3">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <motion.div
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center text-lg p-3 hover:bg-green-700 rounded-lg transition-all ${
                            location.pathname === item.path ? 'bg-green-700/50' : ''
                          }`}
                          onClick={() => setIsOpen(false)}
                          aria-current={location.pathname === item.path ? 'page' : undefined}
                        >
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      </motion.div>
                    </li>
                  ))}
                </ul>
                
                <motion.div
                  whileHover={{ scale: isTouchDevice() ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 mb-2"
                >
                  <Link
                    to="/contact"
                    className="flex items-center justify-center bg-green-500 px-4 py-3 rounded-xl text-white hover:bg-green-600 transition-colors duration-300 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                    aria-label="Contact Us"
                  >
                    <Phone size={18} className="mr-2" />
                    Contact Us
                  </Link>
                </motion.div>
              </nav>
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30 md:hidden"
              onClick={() => setIsOpen(false)}
              role="presentation"
            />
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default React.memo(Header);