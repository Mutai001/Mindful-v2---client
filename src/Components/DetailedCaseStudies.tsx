import React from "react";
import { 
  Heart, 
  Star, 
  Shield, 
  Compass, 
  Users, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

const caseStudies: {
  id: number;
  title: string;
  description: string;
  icon: React.FC;
  accent: "green" | "blue" | "purple" | "amber" | "teal" | "indigo";
  progress: number;
  tag: string;
}[] = [
  {
    id: 1,
    title: "Overcoming Anxiety: Sarah's Journey",
    description:
      "Sarah struggled with anxiety attacks that made social situations overwhelming. With cognitive behavioral therapy (CBT), breathing exercises, and gradual exposure therapy, she learned to manage her anxiety. Over time, Sarah built confidence, reconnected with friends, and regained control over her life.",
    icon: Heart,
    accent: "green",
    progress: 85,
    tag: "Anxiety"
  },
  {
    id: 2,
    title: "Fighting Depression: James' Recovery",
    description:
      "James faced years of deep depression that left him feeling isolated. His healing process involved therapy sessions, medication, and incorporating daily walks and journaling into his routine. Through community support and personal growth, James rediscovered joy and purpose.",
    icon: Star,
    accent: "blue",
    progress: 92,
    tag: "Depression"
  },
  {
    id: 3,
    title: "Healing from PTSD: Maria's Transformation",
    description:
      "Maria suffered from PTSD after experiencing a traumatic event. She struggled with flashbacks and nightmares. With the help of EMDR therapy, mindfulness meditation, and supportive counseling, Maria slowly regained her sense of security and started living without fear.",
    icon: Shield,
    accent: "purple",
    progress: 78,
    tag: "PTSD"
  },
  {
    id: 4,
    title: "Managing Bipolar Disorder: David's Balance",
    description:
      "David's mood swings made it difficult to maintain relationships and work stability. He found relief through a combination of medication, therapy, and structured routines. By tracking mood patterns and engaging in mindfulness practices, David achieved a balanced and fulfilling life.",
    icon: Compass,
    accent: "amber",
    progress: 80,
    tag: "Bipolar Disorder"
  },
  {
    id: 5,
    title: "Social Anxiety Recovery: Emma's Confidence",
    description:
      "Emma's fear of social interactions held her back from forming friendships. She worked with a therapist to develop small social goals, practice self-affirmations, and use exposure therapy. Over time, Emma became more comfortable in group settings and found her voice.",
    icon: Users,
    accent: "teal",
    progress: 88,
    tag: "Social Anxiety"
  },
  {
    id: 6,
    title: "OCD Recovery: Michael's New Beginning",
    description:
      "Michael's obsessive thoughts and compulsions controlled his daily life. With Exposure and Response Prevention (ERP) therapy, he learned to resist compulsions and reframe intrusive thoughts. With time, Michael reclaimed his independence and embraced a new way of thinking.",
    icon: CheckCircle,
    accent: "indigo",
    progress: 83,
    tag: "OCD"
  },
];

// Dynamic styling based on accent color
const getAccentStyles = (accent: "green" | "blue" | "purple" | "amber" | "teal" | "indigo") => {
  const styles = {
    green: {
      bg: "bg-green-50",
      border: "border-green-300",
      text: "text-green-800",
      light: "text-green-600",
      progress: "bg-green-500",
      icon: "text-green-500",
      tag: "bg-green-100 text-green-700"
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-800",
      light: "text-blue-600",
      progress: "bg-blue-500",
      icon: "text-blue-500",
      tag: "bg-blue-100 text-blue-700"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-300",
      text: "text-purple-800",
      light: "text-purple-600",
      progress: "bg-purple-500",
      icon: "text-purple-500",
      tag: "bg-purple-100 text-purple-700"
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-800",
      light: "text-amber-600",
      progress: "bg-amber-500",
      icon: "text-amber-500",
      tag: "bg-amber-100 text-amber-700"
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-300",
      text: "text-teal-800",
      light: "text-teal-600",
      progress: "bg-teal-500",
      icon: "text-teal-500",
      tag: "bg-teal-100 text-teal-700"
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-300",
      text: "text-indigo-800",
      light: "text-indigo-600",
      progress: "bg-indigo-500",
      icon: "text-indigo-500",
      tag: "bg-indigo-100 text-indigo-700"
    }
  };
  
  return styles[accent];
};

const DetailsCaseStudies: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-teal-500">
            Success Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real journeys of transformation and healing from people who have overcome mental health challenges
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {caseStudies.map((study) => {
            const styles = getAccentStyles(study.accent);
            
            return (
              <div 
                key={study.id} 
                className={`rounded-2xl overflow-hidden shadow-md border ${styles.border} transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
              >
                {/* Top Section with Icon and Tag */}
                <div className={`p-6 ${styles.bg} flex justify-between items-center border-b ${styles.border}`}>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full bg-white ${styles.icon} mr-4`}>
                      {React.createElement(study.icon, { size: 28 } as React.SVGProps<SVGSVGElement>)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles.tag}`}>
                      {study.tag}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${styles.light} mr-2`}>Recovery Progress</span>
                    <div className="w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${styles.progress}`} 
                        style={{ width: `${study.progress}%` }}
                      ></div>
                    </div>
                    <span className={`ml-2 text-sm ${styles.text}`}>{study.progress}%</span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 bg-white">
                  <h3 className={`text-xl font-bold mb-4 ${styles.text}`}>
                    {study.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {study.description}
                  </p>
                  
                  {/* Read More Link */}
                  <div className="mt-6">
                    <a href="#" className={`inline-flex items-center ${styles.light} hover:underline`}>
                      Read full story
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DetailsCaseStudies;