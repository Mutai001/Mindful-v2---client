import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  HeartPulse, 
  UserRound, 
  Brain,
  Calendar,
  BookOpen
} from "lucide-react";

const trainingResources = [
  {
    id: 1,
    title: "Opioid Overdose Survivor: Mental Health and Suicidal Monitoring",
    description: "Learn effective strategies for monitoring and supporting those who have survived an opioid overdose, with special focus on mental health care and suicide prevention.",
    icon: HeartPulse,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50",
    accentColor: "text-rose-600",
    borderColor: "border-rose-200",
    sessions: 8,
    level: "Intermediate"
  },
  {
    id: 2,
    title: "Compassionate Caregivers: Expert on Childhood Experience",
    description: "Develop expertise in understanding and addressing childhood trauma through compassionate caregiving approaches and evidence-based therapeutic techniques.",
    icon: UserRound,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
    sessions: 12,
    level: "Advanced"
  },
  {
    id: 3,
    title: "Everything You Need to Know About Anxiety & Recovery",
    description: "A comprehensive program covering anxiety disorders, their symptoms, and various recovery approaches including CBT, mindfulness, and lifestyle modifications.",
    icon: Brain,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-50",
    accentColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    sessions: 6,
    level: "Beginner"
  },
];

const TrainMind: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-500">
            Train Your Mind With Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expert-led programs designed to help you develop mental resilience and emotional well-being
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainingResources.map((resource) => (
            <div
              key={resource.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${resource.borderColor} transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 flex flex-col h-full`}
            >
              {/* Top Section */}
              <div className={`${resource.bgColor} p-8 flex justify-center items-center border-b ${resource.borderColor}`}>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br opacity-10 blur-lg transform scale-150"></div>
                  <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${resource.color} flex items-center justify-center shadow-lg`}>
                    <resource.icon size={40} className="text-white" />
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${resource.bgColor} ${resource.accentColor}`}>
                    {resource.level}
                  </span>
                  <div className="flex items-center">
                    <Calendar size={14} className={resource.accentColor} />
                    <span className="ml-1 text-sm text-gray-600">{resource.sessions} sessions</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-gray-800">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-6">{resource.description}</p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <button
                    className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 bg-gradient-to-r ${resource.color} hover:shadow-md`}
                    onClick={() => navigate("/booktraining")}
                  >
                    Enroll Now
                  </button>
                  
                  <button
                    className={`p-3 rounded-lg border ${resource.borderColor} ${resource.accentColor} hover:bg-gray-50 transition-colors duration-300`}
                    onClick={() => navigate("/booktraining")}
                  >
                    <BookOpen size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainMind;