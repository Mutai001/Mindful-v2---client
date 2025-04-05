import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaTiktok, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    subject: "",
    message: "" 
  });
  const [focus, setFocus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if fields are filled
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Using Formspree for form submission
      const response = await fetch("https://formspree.io/f/mwplordg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email, // Formspree uses this field for reply-to
          _subject: formData.subject || "New contact form submission" // Custom subject
        }),
      });
      
      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
      console.error("Form submission failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFocus = (name: string) => setFocus(name);
  const handleBlur = () => setFocus(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 4px 8px rgba(0, 128, 0, 0.3)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  // Common contact info items for reuse
  const contactInfoItems = [
    {
      icon: <FaPhone />,
      label: "Phone",
      value: "+254722227154",
      animation: { rotate: [0, -10, 10, -10, 0], scale: 1.1 }
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: "kimtaicyrus@gmail.com", // Updated to the email that receives form submissions
      animation: { y: [0, -3, 3, -3, 0], scale: 1.1 }
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Location",
      value: "Nairobi, Kenya",
      animation: { scale: [1, 1.2, 1], x: [0, 3, 0] }
    },
    {
      icon: <FaRegClock />,
      label: "Business Hours",
      value: "Mon-Fri: 9am-5pm",
      animation: { rotate: [0, 20, 0], scale: 1.1 }
    }
  ];
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-100 to-gray-200 text-center relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-green-100 opacity-30 blur-3xl" 
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-green-200 opacity-20 blur-3xl" 
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-green-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative inline-block">
              Get In Touch
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.6 }}
              />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Have questions about our mindfulness services? Want to book a session? 
            Reach out to us directly or fill out the form below, and we'll get back to you as soon as possible.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
          {/* Contact information panel */}
          <motion.div 
            className="lg:col-span-2 bg-green-800 text-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3 
              className="text-2xl font-semibold mb-6 relative inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Contact Information
              <motion.span 
                className="absolute -bottom-2 left-0 w-16 h-1 bg-green-300"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </motion.h3>
            
            <motion.div 
              className="space-y-6 mt-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contactInfoItems.map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="flex items-start space-x-4"
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="mt-1 bg-green-700 p-3 rounded-full text-green-200"
                    whileHover={item.animation}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="text-left">
                    <h4 className="font-medium text-green-200">{item.label}</h4>
                    <p className="text-white">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <h4 className="font-medium text-green-200 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {[
                  { Icon: FaInstagram, url: "https://instagram.com", color: "hover:bg-pink-600" },
                  { Icon: FaTwitter, url: "https://twitter.com", color: "hover:bg-blue-600" },
                  { Icon: FaTiktok, url: "https://tiktok.com", color: "hover:bg-black" },
                  { Icon: FaYoutube, url: "https://youtube.com", color: "hover:bg-red-600" }
                ].map(({ Icon, url, color }, i) => (
                  <motion.a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-green-700 p-2 rounded-full ${color} transition-colors duration-300`}
                    custom={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4 + (i * 0.1), type: "spring" }}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: [0, -10, 10, -10, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <Icon size={16} className="text-white" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {/* Decorative pattern */}
            <div className="absolute bottom-6 right-6">
              <svg width="80" height="80" viewBox="0 0 100 100" className="text-green-700 opacity-30">
                <path d="M0,0 L100,0 L100,100" fill="none" stroke="currentColor" strokeWidth="8" />
              </svg>
            </div>
          </motion.div>
          
          {/* Contact form panel - Now using Formspree */}
          <motion.div 
            className="lg:col-span-3 bg-white p-8 rounded-lg shadow-lg relative"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h3 
              className="text-2xl font-semibold text-green-900 mb-6 text-left"
              variants={itemVariants}
            >
              Send Us a Message
            </motion.h3>
            
            <form className="flex flex-col space-y-5" onSubmit={handleSubmit} action="https://formspree.io/f/mwplordg" method="POST">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    animate={focus === 'name' ? { scale: 1.01 } : { scale: 1 }}
                    required
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: focus === 'name' ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    animate={focus === 'email' ? { scale: 1.01 } : { scale: 1 }}
                    required
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: focus === 'email' ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </div>
              
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Subject
                </label>
                <motion.input
                  type="text"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus('subject')}
                  onBlur={handleBlur}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  animate={focus === 'subject' ? { scale: 1.01 } : { scale: 1 }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: focus === 'subject' ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  name="message"
                  placeholder="How can we help you?"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => handleFocus('message')}
                  onBlur={handleBlur}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  animate={focus === 'message' ? { scale: 1.01 } : { scale: 1 }}
                  required
                />
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: focus === 'message' ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex items-center mt-2 text-left"
              >
                <input
                  type="checkbox"
                  id="privacy"
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  required
                />
                <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                  I agree to the <a href="/privacy" className="text-green-600 hover:underline">privacy policy</a>
                </label>
              </motion.div>
              
              {/* Hidden Formspree honeypot field to prevent spam */}
              <input type="text" name="_gotcha" style={{ display: "none" }} />
              
              <motion.button 
                className="bg-green-600 text-white py-3 rounded-lg font-medium shadow-sm self-start mt-4"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                disabled={loading}
                type="submit"
              >
                <motion.span 
                  className="flex items-center justify-center px-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <motion.svg 
                        className="ml-2 w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </motion.svg>
                    </>
                  )}
                </motion.span>
              </motion.button>
            </form>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="w-20 h-20"
              >
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="#047857" />
                </svg>
              </motion.div>
            </div>
            
            <div className="absolute -bottom-3 -left-3">
              <motion.div 
                className="grid grid-cols-3 gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                {[...Array(9)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="w-1.5 h-1.5 bg-green-600 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + (i * 0.05), duration: 0.4 }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Google Maps Embed - Replace with your actual location */}
        <motion.div 
          className="mt-16 rounded-lg overflow-hidden shadow-lg h-64 md:h-96"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="relative w-full h-full">
            {/* Replace the src URL with your actual Google Maps embed URL */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853743!2d36.68258163413455!3d-1.302861291105035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1712324537185!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
            
            {/* Map overlay with animation */}
            <motion.div 
              className="absolute inset-0 bg-green-900 pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;