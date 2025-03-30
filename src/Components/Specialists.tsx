import React from "react";
import { useNavigate } from "react-router-dom";
import specialist1 from "../assets/images/Doc 1.webp";
import specialist2 from "../assets/images/Doc 2.webp";
import specialist3 from "../assets/images/Doc 3.jpg";
import specialist4 from "../assets/images/Doc 4.webp";

const specialists = [
  { id: 1, name: "Dr. Rachel Wanagari", experience: "10+ Years", image: specialist1, specialty: "Psychiatry" },
  { id: 2, name: "Dr. Ray Kiprono", experience: "8+ Years", image: specialist2, specialty: "Therapy" },
  { id: 3, name: "Dr. Dorothy Achieng", experience: "5+ Years", image: specialist3, specialty: "Mental Health" },
  { id: 4, name: "Dr. Jane Simiyu", experience: "7+ Years", image: specialist4, specialty: "Counseling" },
];

const Specialists: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen w-full py-16 bg-green-50 text-center">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-12">
        Get Treatment From Our Specialists
      </h2>

      {/* Specialists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-8 lg:px-16">
        {specialists.map((specialist) => (
          <div
            key={specialist.id}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 text-center"
          >
            {/* Specialist Image */}
            <img
              src={specialist.image}
              alt={specialist.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-green-200 mb-6"
            />

            {/* Specialist Name */}
            <h3 className="text-xl font-semibold text-green-900 mb-2">{specialist.name}</h3>

            {/* Specialist Details */}
            <p className="text-sm text-gray-600 mb-4">
              {specialist.specialty} - {specialist.experience}
            </p>

            {/* Book Doctor Button */}
            <button
              className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2"
              onClick={() => navigate(`/register`)}
            >
              Book Doctor
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Specialists;