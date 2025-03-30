import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Hero: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle button click
  const handleBookAppointment = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <section className="w-full bg-green-800 text-white text-center py-12 md:py-20 lg:py-24 relative">
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          Embrace Your Mental Health
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-gray-200">
          We understand your challenges. We are here to help.
        </p>

        {/* Call-to-Action Button */}
        <button
          onClick={handleBookAppointment} // Redirect on click
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 mt-6 rounded-lg transition-colors duration-300"
          aria-label="Book an Appointment" // Accessibility improvement
        >
          Book an Appointment
        </button>
      </div>
    </section>
  );
};

export default Hero;