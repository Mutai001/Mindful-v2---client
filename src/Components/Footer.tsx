import React, { useState } from "react";
import { 
  FaInstagram, 
  FaTwitter, 
  FaTiktok, 
  FaYoutube, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt
} from "react-icons/fa";
import { Home, User, BookOpen, ClipboardList, Phone, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/mindful logo.png";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("https://formspree.io/f/mwplordg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email,
          _replyto: email,
          _subject: "New Newsletter Subscription"
        }),
      });
      
      if (response.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation items from Header
  const navItems = [
    { path: "/", name: "Home", icon: <Home size={16} className="text-green-400" /> },
    { path: "/specialists", name: "Doctors", icon: <User size={16} className="text-green-400" /> },
    { path: "/login", name: "Login", icon: <LogIn size={16} className="text-green-400" /> },
    { path: "/booktraining", name: "Training", icon: <BookOpen size={16} className="text-green-400" /> },
    { path: "/case", name: "Case Studies", icon: <ClipboardList size={16} className="text-green-400" /> },
    { path: "/contact", name: "Contact Us", icon: <Phone size={16} className="text-green-400" /> }
  ];

  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white relative mt-20">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-full">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-24"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-green-800"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo and About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6 transform transition-transform hover:scale-105 duration-300">
              <img
                src={logo}
                alt="Mindful Logo"
                className="h-16"
              />
            </div>
            <p className="text-green-100 mb-6 text-sm md:text-left">
              Mindful is dedicated to promoting sustainable living and environmental 
              awareness through educational resources and community engagement.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {[
                { icon: <FaInstagram size={20} />, url: "https://instagram.com" },
                { icon: <FaTwitter size={20} />, url: "https://twitter.com" },
                { icon: <FaTiktok size={20} />, url: "https://tiktok.com" },
                { icon: <FaYoutube size={20} />, url: "https://youtube.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-300 transition-all duration-300 transform hover:scale-125 bg-green-700 p-2 rounded-full"
                  aria-label={`Visit our ${social.url.split(".com")[0].split("//")[1]} page`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links - styled like header navigation */}
          <div className="md:text-left">
            <h3 className="text-xl font-bold mb-4 text-green-300 border-b border-green-600 pb-2 inline-block">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navItems.slice(0, 4).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center text-green-100 hover:text-green-300 transition-colors duration-200 ${
                      location.pathname === item.path ? 'text-green-300 font-medium' : ''
                    }`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 2.5: Additional Navigation Links */}
          <div className="md:text-left">
            <h3 className="text-xl font-bold mb-4 text-green-300 border-b border-green-600 pb-2 inline-block">
              Resources
            </h3>
            <ul className="space-y-3">
              {navItems.slice(4).map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center text-green-100 hover:text-green-300 transition-colors duration-200 ${
                      location.pathname === item.path ? 'text-green-300 font-medium' : ''
                    }`}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/privacy-policy"
                  className="flex items-center text-green-100 hover:text-green-300 transition-colors duration-200"
                >
                  <span className="w-4 h-4 inline-block mr-2 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="flex items-center text-green-100 hover:text-green-300 transition-colors duration-200"
                >
                  <span className="w-4 h-4 inline-block mr-2 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div className="md:text-left">
            <h3 className="text-xl font-bold mb-4 text-green-300 border-b border-green-600 pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center">
                <FaPhone className="text-green-400 mr-3" />
                <span>+254722 227 154</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-green-400 mr-3" />
                <a 
                  href="mailto:kimtaicyrus@gmail.com"
                  className="hover:text-green-300 transition-colors duration-200"
                >
                  info@mindful.com
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-green-400 mr-3 mt-1" />
                <span>123 Eco Street, Green Building<br />Nairobi, Kenya</span>
              </li>
            </ul>
            
            {/* Newsletter Subscription */}
            <h3 className="text-lg font-bold mb-2 text-green-300">
              Subscribe to Newsletter
            </h3>
            {subscribed ? (
              <div className="bg-green-700 p-3 rounded-lg text-center">
                <p className="text-green-200 text-sm">Thank you for subscribing!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="p-2 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none border-0 w-full text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-green-500 hover:bg-green-600 text-white font-medium p-2 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none transition-colors duration-300 text-sm ${
                      loading ? "opacity-70 cursor-wait" : ""
                    }`}
                  >
                    {loading ? "..." : "Join"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Section with Copyright */}
        <div className="mt-12 pt-6 border-t border-green-700 text-center md:flex md:justify-between md:items-center">
          <p className="text-sm text-green-200">
            © {new Date().getFullYear()} Mindful. All Rights Reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex justify-center md:justify-end space-x-6 text-xs text-green-300">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-white transition-colors duration-200">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;