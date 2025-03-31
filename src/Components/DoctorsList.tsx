// import React from "react";
// import { useNavigate } from "react-router-dom";
// import psychiatristImg from "../assets/images/Doc 1.webp";
// import psychologistImg from "../assets/images/Doc6.jpg";
// import therapistImg from "../assets/images/Doc 3.jpg";
// import counselorImg from "../assets/images/Doc 4.webp";
// import neuropsychiatristImg from "../assets/images/Doc5.avif";
// import socialWorkerImg from "../assets/images/Doc 2.webp";

// // Dummy user authentication check
// const isAuthenticated = () => {
//   return localStorage.getItem("user") !== null;
// };

// const doctors = [
//   {
//     id: 1,
//     image: psychiatristImg,
//     name: "Dr. Mark Okwena",
//     specialty: "Psychiatrist",
//     description:
//       "A psychiatrist is a medical doctor specializing in diagnosing, treating, and preventing mental illnesses. They can prescribe medication and provide therapy.",
//   },
//   {
//     id: 2,
//     image: psychologistImg,
//     name: "Dr. Celestina Kweyu",
//     specialty: "Psychologist",
//     description:
//       "A psychologist helps patients understand and manage mental health conditions using talk therapy, behavioral therapy, and psychological assessments.",
//   },
//   {
//     id: 3,
//     image: therapistImg,
//     name: "Dr. Faith Ndungwa",
//     specialty: "Therapist",
//     description:
//       "Therapists provide support and coping strategies for various mental health challenges, including stress, trauma, and relationship issues.",
//   },
//   {
//     id: 4,
//     image: counselorImg,
//     name: "Dr. Cyrus Kimutai",
//     specialty: "Licensed Counselor",
//     description:
//       "A licensed counselor offers therapy and guidance for individuals dealing with anxiety, depression, and emotional struggles.",
//   },
//   {
//     id: 5,
//     image: neuropsychiatristImg,
//     name: "Dr. Riyan Moraa",
//     specialty: "Neuropsychiatrist",
//     description:
//       "Neuropsychiatrists specialize in the link between mental health and brain disorders, treating conditions like schizophrenia and dementia.",
//   },
//   {
//     id: 6,
//     image: socialWorkerImg,
//     name: "Dr. Christine Monyancha",
//     specialty: "Clinical Social Worker",
//     description:
//       "A clinical social worker provides therapy and connects patients with community resources to improve mental well-being.",
//   },
// ];

// const DoctorsList: React.FC = () => {
//   const navigate = useNavigate();

//   const handleBooking = () => {
//     if (isAuthenticated()) {
//       navigate("/sessions"); // Redirect to booking page
//     } else {
//       navigate("/sessions"); // Redirect to register page if not logged in
//     }
//   };

//   return (
//     <section className="py-16 px-6 bg-gray-100">
//       <h2 className="text-3xl font-bold text-center text-green-900 mb-16">Meet Our Mental Health Experts</h2>

//       <div className="max-w-5xl mx-auto space-y-20">
//         {doctors.map((doctor, index) => (
//           <div
//             key={doctor.id}
//             className={`flex flex-col md:flex-row items-center md:items-start md:gap-12 space-y-6 md:space-y-0 ${
//               index % 2 === 0 ? "md:flex-row-reverse" : ""
//             }`}
//           >
//             <img
//               src={doctor.image}
//               alt={doctor.name}
//               className="w-full md:w-1/2 rounded-lg shadow-lg"
//             />
//             <div className="w-full md:w-1/2">
//               <h3 className="text-2xl font-semibold text-green-800 mb-2">{doctor.name}</h3>
//               <h4 className="text-lg font-medium text-green-600 mb-4">{doctor.specialty}</h4>
//               <p className="text-gray-700 leading-relaxed mb-4">{doctor.description}</p>
//               <button
//                 onClick={handleBooking}
//                 className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
//               >
//                 Book Now
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default DoctorsList;






import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultDoctorImg from "../assets/images/Doc 1.webp";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  specialization?: string;
  experience_years?: number;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

interface Therapist {
  id: number;
  full_name: string;
  specialization: string;
  experience_years: number;
  contact_phone: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

const DoctorsList: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch("http://localhost:8000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        
        // Filter users to get only therapists
        const therapistUsers = data.filter((user: User) => 
          user.role === "therapist" && user.specialization
        );
        
        // Format the therapist data with default values
        const formattedTherapists = therapistUsers.map((user: User): Therapist => ({
          id: user.id,
          full_name: user.full_name.startsWith("Dr. ") ? user.full_name : `Dr. ${user.full_name}`,
          specialization: user.specialization || "General Therapy",
          experience_years: user.experience_years || 0,
          contact_phone: user.contact_phone || "Not provided",
          created_at: user.created_at,
          updated_at: user.updated_at,
          image_url: user.image_url || defaultDoctorImg
        }));

        // Extract unique specializations for filtering
        const uniqueSpecializations: string[] = Array.from(
          new Set<string>(formattedTherapists.map((t: Therapist) => t.specialization))
        );
        
        setSpecializations(uniqueSpecializations);
        setTherapists(formattedTherapists);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  const getSpecializationDescription = (specialization: string, experience: number) => {
    if (experience === 1) {
      return `Specializes in ${specialization} with 1 year of experience`;
    }
    return `Specializes in ${specialization} with ${experience} years of experience`;
  };

  const handleBooking = (therapistId: number) => {
    if (localStorage.getItem("user")) {
      navigate(`/sessions?therapistId=${therapistId}`);
    } else {
      navigate("/register");
    }
  };

  // Filter therapists based on search term and specialization
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === "" || 
                                 therapist.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
          <p className="text-center text-gray-600 mt-4">Loading therapists...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-900 mb-8">Meet Our Therapists</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Our team of licensed therapists is dedicated to providing personalized care and support for your mental health journey.
        </p>

        {/* Search and Filter Controls */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-lg shadow-md">
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Therapists</label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or specialization..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Filter by Specialization</label>
            <select
              id="specialization"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          <p>{filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Therapist Cards */}
        {filteredTherapists.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-xl text-gray-600">No therapists match your search criteria.</p>
            <button 
              className="mt-4 text-green-600 hover:text-green-800"
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialization("");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {filteredTherapists.map((therapist, index) => (
              <div
                key={therapist.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl"
              >
                <div className={`flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="md:w-2/5 relative">
                    <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      {therapist.specialization}
                    </div>
                    <img
                      src={therapist.image_url}
                      alt={therapist.full_name}
                      className="w-full h-full object-cover object-center aspect-square"
                    />
                  </div>
                  <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-green-800 mb-2">{therapist.full_name}</h3>
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-5 h-5 ${i < Math.min(Math.floor(therapist.experience_years/2), 5) ? "text-yellow-400" : "text-gray-300"}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          {Math.min(Math.floor(therapist.experience_years/2), 5)} out of 5
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">
                        {getSpecializationDescription(therapist.specialization, therapist.experience_years)}
                      </p>
                      <div className="bg-gray-100 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
                        <p className="text-gray-600">{therapist.contact_phone}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleBooking(therapist.id)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                      >
                        Book Session
                      </button>
                      <p className="text-sm text-gray-500">Member since {new Date(therapist.created_at).getFullYear()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsList;