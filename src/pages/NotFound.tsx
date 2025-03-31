import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);
  const [showMessages, setShowMessages] = useState(false);
  const [showSearching, setShowSearching] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  // Animation sequence
  useEffect(() => {
    // First animation - show messages
    setTimeout(() => setShowMessages(true), 500);
    
    // Second animation - show searching
    setTimeout(() => setShowSearching(true), 1500);
    
    // Third animation - show not found
    setTimeout(() => setShowNotFound(true), 2500);
    
    // Countdown to redirect
    const interval = setInterval(() => {
      setCounter(prevCounter => {
        if (prevCounter <= 1) {
          clearInterval(interval);
          // Navigate to home page when counter reaches 0
          setTimeout(() => navigate('/'), 1000);
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden relative">
        {/* Header */}
        <div className="bg-green-700 p-6 text-white">
          <h1 className="text-3xl font-bold text-center">Page Not Found</h1>
        </div>
        
        {/* Animation Container */}
        <div className="p-8 bg-green-100 flex flex-col items-center">
          {/* Message Bubbles Animation */}
          <div className="flex flex-col w-full mb-8">
            <div 
              className={`self-end bg-green-200 p-3 rounded-lg rounded-tr-none mb-3 max-w-xs transform transition-all duration-500 ${
                showMessages ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
              }`}
            >
              <p className="text-green-900">Hello? Is anyone there?</p>
            </div>
            
            <div 
              className={`self-start bg-green-600 p-3 rounded-lg rounded-tl-none mb-3 max-w-xs text-white transform transition-all duration-500 ${
                showMessages ? 'translate-x-0 opacity-100 delay-300' : '-translate-x-20 opacity-0'
              }`}
            >
              <p>I'm looking for the page you requested...</p>
            </div>
            
            {/* Searching Animation */}
            <div 
              className={`self-center bg-green-300 p-4 rounded-full mb-3 transform transition-all duration-700 ${
                showSearching ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="inline-block w-3 h-3 bg-green-700 rounded-full animate-bounce"></span>
                <span className="inline-block w-3 h-3 bg-green-700 rounded-full animate-bounce delay-200"></span>
                <span className="inline-block w-3 h-3 bg-green-700 rounded-full animate-bounce delay-400"></span>
                <span className="ml-2 text-green-800 font-medium">Searching...</span>
              </div>
            </div>
            
            {/* Not Found Message */}
            <div 
              className={`self-start bg-red-100 p-3 rounded-lg text-red-700 mb-3 border border-red-300 transform transition-all duration-500 ${
                showNotFound ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
              }`}
            >
              <p className="font-medium">Sorry, I couldn't find the page you're looking for.</p>
            </div>
          </div>
          
          {/* 404 Display */}
          <div className={`text-9xl font-bold text-green-700 opacity-30 transition-all duration-1000 ${
            showNotFound ? 'scale-100 opacity-30' : 'scale-50 opacity-0'
          }`}>
            404
          </div>
          
          {/* Redirect Message */}
          <div className={`mt-6 text-center transition-all duration-500 ${
            showNotFound ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-green-800 mb-4">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-green-600">
              Redirecting to homepage in <span className="font-bold">{counter}</span> seconds...
            </p>
          </div>
          
          {/* Action Button */}
          <button 
            onClick={() => navigate('/')}
            className={`mt-6 bg-green-700 text-white py-2 px-6 rounded-lg hover:bg-green-800 transition transform duration-500 ${
              showNotFound ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Return to Home
          </button>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 bg-green-400 rounded-full opacity-20 animate-float float-delay-2s"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-green-500 rounded-full opacity-20 animate-float float-delay-1s"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-green-600 rounded-full opacity-20 animate-float float-delay-3s"></div>
      </div>
      
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;