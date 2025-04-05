import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Award, Clock, MapPin } from "lucide-react";

// Define the Therapist interface based on the API response
interface Therapist {
  id: number;
  full_name: string;
  email: string;
  contact_phone: string;
  address: string;
  role: string;
  specialization: string;
  experience_years: number;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

const Specialists: React.FC = () => {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Generate avatar colors based on therapist id for consistent but unique colors
  const getAvatarColors = (id: number) => {
    const colors = [
      { bg: "bg-indigo-100", text: "text-indigo-600", accentBg: "bg-indigo-600" },
      { bg: "bg-emerald-100", text: "text-emerald-600", accentBg: "bg-emerald-600" },
      { bg: "bg-amber-100", text: "text-amber-600", accentBg: "bg-amber-600" },
      { bg: "bg-rose-100", text: "text-rose-600", accentBg: "bg-rose-600" },
      { bg: "bg-cyan-100", text: "text-cyan-600", accentBg: "bg-cyan-600" },
      { bg: "bg-violet-100", text: "text-violet-600", accentBg: "bg-violet-600" },
      { bg: "bg-lime-100", text: "text-lime-600", accentBg: "bg-lime-600" },
      { bg: "bg-pink-100", text: "text-pink-600", accentBg: "bg-pink-600" },
    ];
    return colors[id % colors.length];
  };

  // Get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/users");
        const therapistsData = response.data.filter(
          (user: Therapist) => user.role === "therapist"
        );
        setTherapists(therapistsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load therapists. Please try again later.");
        setLoading(false);
        console.error("Error fetching therapists:", err);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-green-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg w-64 h-80">
                <div className="w-32 h-32 mx-auto rounded-full bg-green-200 mb-6"></div>
                <div className="h-6 bg-green-200 rounded mb-4"></div>
                <div className="h-4 bg-green-100 rounded mb-4"></div>
                <div className="h-10 bg-green-200 rounded mt-6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-red-600 mb-4">Oops!</h3>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full py-16 bg-gradient-to-b from-green-50 to-green-100">
      {/* Heading with enhanced styling */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4">
          Meet Our Mental Health Experts
        </h2>
        <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
        <p className="text-lg text-green-800 max-w-2xl mx-auto">
          Our team of experienced specialists is here to provide you with the best care for your mental wellbeing
        </p>
      </div>

      {/* Therapists display as a flowing grid with cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {therapists.map((therapist) => {
            const colors = getAvatarColors(therapist.id);
            return (
              <div
                key={therapist.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-1 group"
              >
                <div className={`${colors.accentBg} h-8 w-full`}></div>
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex justify-center -mt-12 mb-6">
                    {therapist.profile_picture ? (
                      <img
                        src={therapist.profile_picture}
                        alt={therapist.full_name}
                        className={`w-24 h-24 rounded-full border-4 border-white ${colors.bg} object-cover`}
                      />
                    ) : (
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-white ${colors.bg} ${colors.text} text-2xl font-bold`}>
                        {getInitials(therapist.full_name)}
                      </div>
                    )}
                  </div>

                  {/* Name and Specialization */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{therapist.full_name}</h3>
                    <p className={`${colors.text} font-medium`}>{therapist.specialization}</p>
                  </div>

                  {/* Details with icons */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">{therapist.experience_years} Years Experience</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">{therapist.address}</span>
                    </div>
                  </div>

                  {/* Book button */}
                  <button
                    onClick={() => navigate(`/register?therapist=${therapist.id}`)}
                    className={`w-full py-3 rounded-lg ${colors.accentBg} text-white font-medium transition-all duration-300 hover:opacity-90 flex items-center justify-center space-x-2`}
                  >
                    <Award className="w-5 h-5" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* If no therapists found */}
      {therapists.length === 0 && !loading && !error && (
        <div className="text-center p-8">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Therapists Available</h3>
          <p className="text-gray-600">Please check back later for our updated list of specialists.</p>
        </div>
      )}
    </section>
  );
};

export default Specialists;