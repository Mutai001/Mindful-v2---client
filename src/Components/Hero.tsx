/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import heros1 from '../assets/images/heros1.jpg';
import heros2 from '../assets/images/heros2.jpg';
import heros3 from '../assets/images/heros3.jpg';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  
  // Images for background rotation - using the imported images
  const backgroundImages = [heros1, heros2, heros3];
  
  // Animation for background image transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 8000); // Change image every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleBookAppointment = () => {
    navigate("/login");
  };

  return (
    <section className="w-full h-screen relative overflow-hidden bg-green-900">
      {/* Animated Background Images with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${backgroundImages[currentImage]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      </AnimatePresence>
      
      {/* Overlay gradient with animated opacity */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-800/90 z-10"
        animate={{ 
          opacity: [0.7, 0.8, 0.7],
          background: [
            "linear-gradient(to bottom, rgba(6, 78, 59, 0.7), rgba(6, 95, 70, 0.9))",
            "linear-gradient(to bottom, rgba(6, 78, 59, 0.8), rgba(6, 95, 70, 0.9))",
            "linear-gradient(to bottom, rgba(6, 78, 59, 0.7), rgba(6, 95, 70, 0.9))"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Animated circles - representing mindfulness concepts with more complex animations */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-green-500/20 blur-xl"
          animate={{
            x: ['-10%', '60%', '30%', '-10%'],
            y: ['15%', '30%', '60%', '15%'],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.2, 0.3, 0.2, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-blue-500/20 blur-xl"
          animate={{
            x: ['70%', '20%', '50%', '70%'],
            y: ['60%', '20%', '30%', '60%'],
            scale: [1.1, 0.9, 1.2, 1.1],
            opacity: [0.2, 0.4, 0.2, 0.2]
          }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-teal-400/20 blur-xl"
          animate={{
            x: ['30%', '60%', '10%', '30%'],
            y: ['30%', '60%', '10%', '30%'],
            scale: [0.9, 1.1, 0.8, 0.9],
            opacity: [0.3, 0.2, 0.4, 0.3]
          }}
          transition={{ repeat: Infinity, duration: 35, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-yellow-400/10 blur-xl"
          animate={{
            x: ['10%', '40%', '70%', '10%'],
            y: ['40%', '70%', '20%', '40%'],
            scale: [1, 1.3, 0.7, 1],
            opacity: [0.1, 0.3, 0.1, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 40, ease: "easeInOut" }}
        />
      </div>
      
      {/* Light particles floating effect */}
      <div className="absolute inset-0 z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
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
            { color: "bg-teal-400", text: "Growth" }
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
        
        {/* Scroll indicator with enhanced animation */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M12 5L12 19M12 19L18 13M12 19L6 13" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;