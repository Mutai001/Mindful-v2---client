import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Chatbot: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-4 bg-gray-100">
      {/* Back button positioned at top-left */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 flex items-center gap-2 p-2 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-colors z-10"
        aria-label="Go back"
      >
        <FaArrowLeft className="text-gray-700" />
        <span className="hidden sm:inline text-gray-700">Back</span>
      </button>

      {/* Chatbot container with responsive sizing */}
      <div className="w-full max-w-6xl h-[calc(100vh-120px)] mt-16 bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden">
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/LlL4TiFs541QRazwQjuMB"
          title="Mental Health AI Chatbot"
          className="w-full h-full border-none"
          allow="microphone;"
        />
      </div>

      {/* Responsive footer text */}
      <div className="mt-4 text-sm text-gray-500 text-center px-4">
        <p className="max-w-2xl mx-auto">
          Note: This chatbot is for informational purposes only and not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default Chatbot;