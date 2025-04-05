/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: {
        duration: 2,
      },
    });
  }, []);

  const handleBookAppointment = () => {
    navigate("/login");
  };

  return (
    <section className="w-full h-screen relative overflow-hidden bg-gradient-to-b from-green-900 to-blue-900">
      {/* Animated Brain Wave Background */}
      <div className="absolute inset-0 z-0">
        {/* Frequency Waves - Alpha waves (8-12 Hz) - associated with relaxation */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`alpha-${i}`}
            className="absolute h-1 bg-green-400/30 rounded-full left-0 right-0"
            style={{ top: `${10 + i * 10}%`, height: '2px' }}
            animate={{
              x: ["-100%", "100%"],
              scaleY: [1, 2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 8 + i,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Frequency Waves - Theta waves (4-8 Hz) - associated with meditation */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`theta-${i}`}
            className="absolute h-1 bg-teal-400/30 rounded-full left-0 right-0"
            style={{ top: `${15 + i * 12}%`, height: '3px' }}
            animate={{
              x: ["100%", "-100%"],
              scaleY: [1, 3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 10 + i,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Frequency Waves - Beta waves (12-30 Hz) - associated with alertness */}
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={`beta-${i}`}
            className="absolute h-1 bg-blue-400/20 rounded-full left-0 right-0"
            style={{ top: `${20 + i * 8}%`, height: '1px' }}
            animate={{
              x: ["-100%", "100%"],
              scaleY: [1, 4, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + i * 0.5,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Neural Connection Points */}
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 4 + 2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Neural Connections - Synapses */}
        {[...Array(20)].map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = x1 + (Math.random() * 30 - 15);
          const y2 = y1 + (Math.random() * 30 - 15);
          
          return (
            <motion.div
              key={`synapse-${i}`}
              className="absolute"
              style={{
                left: `${x1}%`,
                top: `${y1}%`,
                width: '1px',
                height: '1px',
              }}
            >
              <motion.svg
                width={Math.abs(x2 - x1)}
                height={Math.abs(y2 - y1)}
                style={{
                  position: 'absolute',
                  transform: `translate(${x2 < x1 ? '100%' : '0'}, ${y2 < y1 ? '100%' : '0'})`,
                }}
              >
                <motion.line
                  x1={x2 < x1 ? Math.abs(x2 - x1) : 0}
                  y1={y2 < y1 ? Math.abs(y2 - y1) : 0}
                  x2={x2 < x1 ? 0 : Math.abs(x2 - x1)}
                  y2={y2 < y1 ? 0 : Math.abs(y2 - y1)}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.random() * 5 + 5,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }}
                />
              </motion.svg>
            </motion.div>
          );
        })}
      </div>

      {/* Animated Resonance Circles - represents different mental states */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-green-500/10 blur-xl"
          animate={{
            x: ['-10%', '60%', '30%', '-10%'],
            y: ['15%', '30%', '60%', '15%'],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.2, 0.3, 0.2, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-xl"
          animate={{
            x: ['70%', '20%', '50%', '70%'],
            y: ['60%', '20%', '30%', '60%'],
            scale: [1.1, 0.9, 1.2, 1.1],
            opacity: [0.2, 0.4, 0.2, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-teal-400/10 blur-xl"
          animate={{
            x: ['30%', '60%', '10%', '30%'],
            y: ['30%', '60%', '10%', '30%'],
            scale: [0.9, 1.1, 0.8, 0.9],
            opacity: [0.3, 0.2, 0.4, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 35, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-purple-400/10 blur-xl"
          animate={{
            x: ['10%', '40%', '70%', '10%'],
            y: ['40%', '70%', '20%', '40%'],
            scale: [1, 1.3, 0.7, 1],
            opacity: [0.1, 0.3, 0.1, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 40, ease: "easeInOut" }}
        />
      </div>
      
      {/* Calming Pulse Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-blue-900/40 z-5"
        animate={{ 
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center relative z-20">
        {/* Mindfulness symbol with rotation animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.svg 
            width="80" 
            height="80" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              filter: ["drop-shadow(0 0 2px rgba(255,255,255,0.5))", "drop-shadow(0 0 8px rgba(255,255,255,0.8))", "drop-shadow(0 0 2px rgba(255,255,255,0.5))"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.circle 
              cx="50" 
              cy="50" 
              r="45" 
              stroke="white" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path 
              d="M50 10C50 10 65 30 65 50C65 70 50 90 50 90" 
              stroke="white" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
            <motion.path 
              d="M50 10C50 10 35 30 35 50C35 70 50 90 50 90" 
              stroke="white" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
            <motion.path 
              d="M10 50H90" 
              stroke="white" 
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            />
          </motion.svg>
        </motion.div>
        
        {/* Heading with animation */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Embrace Your{" "}
          <motion.span 
            className="text-green-300"
            animate={{ 
              color: ["rgb(134, 239, 172)", "rgb(167, 243, 208)", "rgb(134, 239, 172)"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            Mental Health
          </motion.span>
        </motion.h1>
        
        {/* Animated text reveal with typing effect */}
        <div className="h-14 mt-4 overflow-hidden">
          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We understand your challenges. We are here to help you find peace.
          </motion.p>
        </div>
        
        {/* Mindfulness tagline with staggered animation */}
        <motion.div
          className="flex flex-wrap justify-center items-center mt-6 space-x-2 sm:space-x-6 text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {[
            { color: "bg-green-400", text: "Mindfulness" },
            { color: "bg-blue-400", text: "Balance" },
            { color: "bg-teal-400", text: "Growth" },
            { color: "bg-purple-400", text: "Clarity" }
          ].map((item, index) => (
            <motion.span 
              key={item.text} 
              className="flex items-center my-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + (index * 0.2) }}
            >
              <motion.span 
                className={`w-2 h-2 ${item.color} rounded-full mr-2`}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              />
              <span>{item.text}</span>
            </motion.span>
          ))}
        </motion.div>
        
        {/* Call-to-Action Button with enhanced pulse effect */}
        <motion.button
          onClick={handleBookAppointment}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 mt-8 rounded-lg relative overflow-hidden group"
          aria-label="Book an Appointment"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.span 
            className="absolute inset-0 w-full h-full bg-green-400 opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
            }}
          />
          <span className="relative z-10 font-medium tracking-wide text-lg">
            Begin Your Journey
          </span>
          <span className="absolute inset-0 w-full h-full bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out opacity-30" />
        </motion.button>
        
        {/* EEG Wave Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <svg width="100%" height="30" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M0 15 Q 10 15, 15 5 Q 20 -5, 25 15 Q 30 35, 35 15 Q 40 -5, 45 15 Q 50 35, 55 15 Q 60 -5, 65 15 Q 70 35, 75 15 Q 80 -5, 85 15 Q 90 35, 95 15 Q 100 -5, 100 15" 
              stroke="white" 
              strokeWidth="1"
              strokeOpacity="0.6"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </svg>
          <motion.div
            className="text-gray-300 text-xs text-center mt-1"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;