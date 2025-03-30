import React from "react";
import { FaInstagram, FaTwitter, FaTiktok, FaYoutube, FaPhone } from "react-icons/fa";
import logo from "../assets/images/mindful logo.png"; // Import your logo

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white text-center p-10 relative">
      {/* Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-current text-green-900"
          ></path>
        </svg>
      </div>

      {/* Logo */}
      <div className="mb-6">
        <img
          src={logo} // Use the imported logo
          alt="Mindful Logo"
          className="mx-auto h-12"
        />
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center space-x-6 mb-6">
        {[
          { icon: <FaInstagram size={24} />, url: "https://instagram.com" },
          { icon: <FaTwitter size={24} />, url: "https://twitter.com" },
          { icon: <FaTiktok size={24} />, url: "https://tiktok.com" },
          { icon: <FaYoutube size={24} />, url: "https://youtube.com" },
        ].map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-green-300 transition-all duration-300 transform hover:scale-110"
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Subscription Form */}
      <div className="mb-6">
        <p className="text-lg mb-4">Subscribe to our newsletter for updates!</p>
        <form className="flex justify-center">
          <input
            type="email"
            placeholder="Your email address"
            className="p-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 text-black"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 rounded-r-full hover:bg-green-500 transition-colors duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="flex justify-center items-center space-x-2 text-sm mb-6">
        <FaPhone className="text-green-300" />
        <span>+254798 765 432</span>
      </div>

      {/* Copyright */}
      <p className="text-sm">© 2025 Mindful. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;