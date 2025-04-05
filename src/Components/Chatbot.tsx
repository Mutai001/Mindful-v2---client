import React from "react";

const Chatbot: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] my-[60px] p-5">
      <div className="w-[90vw] h-[70vh] bg-[#1a1a1a] flex justify-center items-center rounded-xl shadow-lg max-w-[900px] min-w-[300px] overflow-hidden">
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/LlL4TiFs541QRazwQjuMB"
          title="Mental Health AI Chatbot"
          className="w-full h-full border-none"
          allow="microphone;"
        ></iframe>
      </div>
    </div>
  );
};

export default Chatbot;