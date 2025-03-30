import React, { useState } from "react";

const expertiseAreas = [
  { name: "Trauma", description: "Trauma can affect mental health deeply, leading to PTSD and other stress disorders." },
  { name: "Anxiety", description: "Anxiety disorders involve excessive fear and nervousness, affecting daily life." },
  { name: "Depression", description: "Depression is a persistent feeling of sadness and loss of interest in activities." },
  { name: "Autism", description: "Autism spectrum disorder affects communication and social interaction." },
  { name: "Life Transitions", description: "Major life changes like job loss, divorce, or relocation can impact mental health." },
  { name: "Grief & Loss", description: "Grief from losing loved ones can cause emotional and mental distress." },
  { name: "Parenting", description: "Parenting can be challenging, leading to stress and emotional strain." },
  { name: "OCD", description: "Obsessive-Compulsive Disorder causes recurring thoughts and repetitive behaviors." },
  { name: "ADHD", description: "Attention-deficit/hyperactivity disorder affects focus and impulsivity." },
];

const Expertise: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="min-h-screen w-full py-16 text-center bg-white">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-8">
        Area of Expertise
      </h2>

      {/* Expertise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 lg:px-16">
        {expertiseAreas.map((item, index) => (
          <button
            key={index}
            className={`p-6 rounded-lg shadow-md transition-all duration-300 text-lg font-semibold
              ${selected === item.name ? "bg-green-800 text-white" : "bg-green-300 text-green-900"}
              hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2`}
            onClick={() => setSelected(selected === item.name ? null : item.name)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Selected Description */}
      {selected && (
        <div className="mt-8 bg-gray-100 p-6 text-green-900 text-lg rounded-md max-w-2xl mx-auto">
          <p>{expertiseAreas.find((item) => item.name === selected)?.description}</p>
        </div>
      )}
    </section>
  );
};

export default Expertise;