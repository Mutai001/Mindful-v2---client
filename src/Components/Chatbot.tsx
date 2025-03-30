// import React from "react";

// const Chatbot: React.FC = () => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "calc(100vh - 120px)", // Adjusting height for header and footer
//         margin: "60px 0", // Space for header and footer (assumed 60px each)
//         padding: "20px", // Padding for better spacing on small screens
//       }}
//     >
//       <div
//         style={{
//           width: "90vw",
//           height: "70vh",
//           backgroundColor: "#1a1a1a",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           borderRadius: "12px",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
//           maxWidth: "900px",  // Max width for larger screens
//           minWidth: "300px",  // Ensures usability on small screens
//           overflow: "hidden",
//         }}
//       >
//         <iframe
//           src="https://www.chatbase.co/chatbot-iframe/LlL4TiFs541QRazwQjuMB"
//           title="Mental Health AI Chatbot"
//           style={{
//             width: "100%",
//             height: "100%",
//             border: "none",
//           }}
//           allow="microphone;"
//         ></iframe>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;


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