import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  Sparkles, 
  Heart, 
  ListChecks, 
  Lightbulb, 
  Waves
} from "lucide-react";

const trainingData = [
  {
    id: 1,
    title: "Managing Anxiety",
    description:
      "Learn effective techniques like Cognitive Behavioral Therapy (CBT) and guided meditation to reduce anxiety symptoms.",
    icon: Waves,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "border-blue-400"
  },
  {
    id: 2,
    title: "Overcoming Depression",
    description:
      "Our structured programs include positive psychology, exercise therapy, and interpersonal therapy for long-term recovery.",
    icon: Sparkles,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    accent: "border-purple-400"
  },
  {
    id: 3,
    title: "PTSD Recovery Program",
    description:
      "We use Exposure Therapy, EMDR, and resilience training to help patients heal from traumatic experiences.",
    icon: Heart,
    color: "bg-red-100", 
    iconColor: "text-red-600",
    accent: "border-red-400"
  },
  {
    id: 4,
    title: "Coping with OCD",
    description:
      "Exposure and Response Prevention (ERP) and mindfulness exercises help manage compulsive behaviors effectively.",
    icon: ListChecks,
    color: "bg-amber-100",
    iconColor: "text-amber-600",
    accent: "border-amber-400"
  },
  {
    id: 5,
    title: "Stress Management",
    description:
      "Our training focuses on breathing exercises, relaxation techniques, and time management strategies for stress reduction.",
    icon: Brain,
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "border-emerald-400"
  },
  {
    id: 6,
    title: "Bipolar Disorder Therapy",
    description:
      "Cognitive therapy, mood stabilization exercises, and lifestyle adjustments help maintain emotional balance.",
    icon: Lightbulb,
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
    accent: "border-indigo-400"
  },
];

const BookTraining: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBooking = () => {
    navigate("/register");
  };
  
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-500">
          Mental Health Training Programs
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Expert-led programs designed to provide you with effective tools and strategies for better mental wellbeing
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trainingData.map((training) => (
            <div
              key={training.id}
              className={`flex flex-col h-full rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl bg-white border-l-4 ${training.accent}`}
            >
              <div className={`p-8 flex items-center ${training.color} border-b border-gray-100`}>
                <div className={`p-4 rounded-full ${training.iconColor} bg-white mr-4`}>
                  <training.icon size={32} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {training.title}
                </h3>
              </div>
              
              <div className="p-6 flex-grow">
                <p className="text-gray-600">{training.description}</p>
              </div>
              
              <div className="p-6 pt-0">
                <button
                  onClick={handleBooking}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 transform hover:-translate-y-1`}
                >
                  Book This Training
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookTraining;