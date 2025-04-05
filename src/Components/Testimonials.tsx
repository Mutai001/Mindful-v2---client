import React, { useEffect, useRef } from "react";
import { Star, User, Quote, Heart } from "lucide-react";

const Testimonials: React.FC = () => {
  // References for animation elements
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animated avatar component instead of static images
  const AnimatedAvatar: React.FC<{ seed: string; index: number }> = ({ index }) => {
    // Use different animation delays based on index
    const animationDelay = `${index * 0.2}s`;
    
    return (
      <div className="relative w-24 h-24 mx-auto mb-6">
        {/* Animated ring */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-75"
          style={{
            animation: `pulse 2s infinite ${animationDelay}`,
          }}
        ></div>
        
        {/* Avatar circle */}
        <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center overflow-hidden">
          <div 
            className="w-full h-full bg-gradient-to-br from-green-200 via-green-300 to-green-100 flex items-center justify-center"
            style={{
              animation: `gradientShift 8s infinite ease-in-out ${animationDelay}`,
            }}
          >
            <User 
              className="w-12 h-12 text-green-700" 
              style={{
                animation: `bounce 3s infinite ease-in-out ${animationDelay}`,
              }}
            />
          </div>
        </div>

        {/* Decorative stars */}
        <div 
          className="absolute -top-2 -right-2 text-yellow-400"
          style={{
            animation: `spin 4s infinite linear ${animationDelay}`,
          }}
        >
          <Star size={16} fill="currentColor" />
        </div>
        <div 
          className="absolute -bottom-1 -left-1 text-yellow-400"
          style={{
            animation: `spin 4s infinite linear reverse ${animationDelay}`,
          }}
        >
          <Star size={12} fill="currentColor" />
        </div>
      </div>
    );
  };

  // Testimonial data with enhanced content
  const testimonials = [
    {
      text: "Best Service Ever! Mindful has completely transformed my approach to mental wellness. Their therapists are compassionate and truly listen.",
      author: "Cyrus Kimutai",
      position: "Software Engineer",
      rating: 5,
      seed: "Cyrus"
    },
    {
      text: "Mindful helped me find peace and clarity in life. The personalized approach made all the difference in my journey to better mental health.",
      author: "Saik Kweyu",
      position: "Marketing Director",
      rating: 5,
      seed: "jane"
    },
    {
      text: "A truly life-changing experience. Thank you, Mindful! I've recommended their services to all my friends and family struggling with stress.",
      author: "Riyan Christine",
      position: "Healthcare Professional",
      rating: 5,
      seed: "riyan"
    },
  ];

  // Add scroll reveal animation when section comes into view
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const cards = sectionRef.current.querySelectorAll('.testimonial-card');
    cards.forEach(card => observer.observe(card));
    
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 relative overflow-hidden bg-gradient-to-b from-white to-green-50"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -left-20 top-20 w-64 h-64 rounded-full bg-green-100 opacity-50"></div>
        <div className="absolute -right-32 bottom-20 w-96 h-96 rounded-full bg-green-100 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-yellow-100 opacity-30"></div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-green-600 mr-2" fill="currentColor" />
            <span className="text-sm font-medium uppercase tracking-wider text-green-600">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Love From Our Clients
          </h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            Discover how Mindful has helped people transform their lives through compassionate care and effective therapy
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card opacity-0 bg-white p-8 rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 relative group`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 bg-green-600 text-white p-3 rounded-full shadow-lg group-hover:bg-green-700 transition-colors duration-300">
                <Quote className="w-5 h-5" />
              </div>

              {/* Top border with gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-2xl"></div>

              {/* Animated avatar */}
              <AnimatedAvatar seed={testimonial.seed} index={index} />

              {/* Rating stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 mx-0.5" fill="currentColor" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-lg text-gray-700 italic mb-6 relative">
                "{testimonial.text}"
              </p>

              {/* Author info */}
              <div>
                <p className="font-bold text-green-900 text-lg">{testimonial.author}</p>
                <p className="text-green-600 text-sm">{testimonial.position}</p>
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-4 right-4 flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
            Read More Success Stories
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;