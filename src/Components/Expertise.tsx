import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpertiseArea {
  name: string;
  description: string;
  longDescription: string;
  icon: string;
}

const expertiseAreas: ExpertiseArea[] = [
  { 
    name: "Trauma", 
    description: "Trauma can affect mental health deeply, leading to PTSD and other stress disorders.",
    longDescription: "Trauma therapy helps individuals process difficult experiences and develop healthy coping mechanisms. We use evidence-based approaches including EMDR, CPT, and somatic experiencing to help you heal.",
    icon: "🛡️"
  },
  { 
    name: "Anxiety", 
    description: "Anxiety disorders involve excessive fear and nervousness, affecting daily life.",
    longDescription: "Our anxiety treatment combines cognitive-behavioral techniques, mindfulness practices, and exposure therapy to help you manage symptoms and develop resilience against anxious thoughts and feelings.",
    icon: "😰"
  },
  { 
    name: "Depression", 
    description: "Depression is a persistent feeling of sadness and loss of interest in activities.",
    longDescription: "We offer comprehensive depression treatment including cognitive therapy, behavioral activation, mindfulness-based approaches, and when appropriate, medication management referrals.",
    icon: "😔"
  },
  { 
    name: "Autism", 
    description: "Autism spectrum disorder affects communication and social interaction.",
    longDescription: "Our autism-focused services provide support for individuals across the spectrum, focusing on social skills development, sensory integration, and building on individual strengths and interests.",
    icon: "🧩"
  },
  { 
    name: "Life Transitions", 
    description: "Major life changes like job loss, divorce, or relocation can impact mental health.",
    longDescription: "Life transitions can be challenging, but they also offer opportunities for growth. We'll help you navigate changes with resilience while developing adaptive coping strategies for your new circumstances.",
    icon: "🔄"
  },
  { 
    name: "Grief & Loss", 
    description: "Grief from losing loved ones can cause emotional and mental distress.",
    longDescription: "Our compassionate grief counseling acknowledges that there's no single way to grieve. We create space for your unique experience and help you find meaning while honoring your relationship with what's been lost.",
    icon: "💔"
  },
  { 
    name: "Parenting", 
    description: "Parenting can be challenging, leading to stress and emotional strain.",
    longDescription: "Our parenting support combines practical strategies with emotional guidance. We help parents develop stronger relationships with their children while maintaining their own wellbeing and boundaries.",
    icon: "👨‍👩‍👧‍👦"
  },
  { 
    name: "OCD", 
    description: "Obsessive-Compulsive Disorder causes recurring thoughts and repetitive behaviors.",
    longDescription: "Our OCD treatment specializes in Exposure and Response Prevention (ERP), the gold standard approach that helps break the cycle of obsessions and compulsions while developing healthier thought patterns.",
    icon: "🔄"
  },
  { 
    name: "ADHD", 
    description: "Attention-deficit/hyperactivity disorder affects focus and impulsivity.",
    longDescription: "Our ADHD services include comprehensive assessment, cognitive training, behavioral strategies, and organizational skills development to help harness your natural creativity and energy.",
    icon: "⚡"
  },
];

const Expertise: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleSelect = (itemName: string) => {
    if (selected === itemName) {
      setSelected(null);
    } else {
      setSelected(itemName);
    }
  };

  const selectedItem = expertiseAreas.find(item => item.name === selected);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-800 to-teal-600 mb-4">
            Areas of Expertise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our specialists are trained in various therapeutic approaches to address your specific needs with compassion and evidence-based care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseAreas.map((item, index) => (
            <motion.div 
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className={`w-full h-full p-8 rounded-xl overflow-hidden
                  ${selected === item.name 
                    ? "bg-gradient-to-br from-green-700 to-teal-700 text-white shadow-lg shadow-green-200" 
                    : "bg-white text-green-900 shadow-md hover:shadow-xl"
                  }
                  border border-green-100 flex flex-col items-center`}
                onClick={() => handleSelect(item.name)}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-4xl mb-4">{item.icon}</span>
                <h3 className={`text-xl font-bold mb-2 ${selected === item.name ? "text-white" : "text-green-800"}`}>
                  {item.name}
                </h3>
                <p className={`text-sm ${selected === item.name ? "text-green-100" : "text-gray-600"}`}>
                  {item.description}
                </p>
                
                <AnimatePresence>
                  {hoveredItem === item.name && selected !== item.name && (
                    <motion.div 
                      className="mt-4 inline-flex items-center text-sm font-medium text-teal-600"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div 
              className="mt-12 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-600"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex flex-col md:flex-row items-start">
                  <div className="bg-green-100 p-4 rounded-full text-4xl mr-6 mb-4 md:mb-0">
                    {selectedItem?.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-3">
                      {selectedItem?.name}
                    </h3>
                    <p className="text-gray-700 text-lg mb-4">
                      {selectedItem?.longDescription}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <motion.button 
                        className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Schedule Consultation
                      </motion.button>
                      <motion.button 
                        className="border border-green-700 text-green-700 hover:bg-green-50 px-6 py-2 rounded-lg font-medium flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Learn More
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-16 bg-green-50 rounded-lg p-8 border border-green-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Not sure which area fits your needs?
          </h3>
          <p className="text-gray-700 mb-6">
            Many people experience multiple concerns or aren't certain how to categorize what they're feeling. Our initial consultation helps identify the best approach for your unique situation.
          </p>
          <motion.button 
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Free 15-Minute Consultation
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Expertise;