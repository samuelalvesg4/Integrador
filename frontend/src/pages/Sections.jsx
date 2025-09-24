import React from "react";
import { Link } from "react-router-dom";

export default function Sections() {
  const sections = [
    { id: "bebidas", name: "Bebidas", color: "from-orange-400 to-orange-600" },
    { id: "alimentos", name: "Alimentos", color: "from-green-400 to-green-600" },
  ];

  return (
    <main className="section-container">
      <h1 className="section-title text-center">Nossas Seções</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`/section/${section.id}`}
            className={`block rounded-xl shadow-lg bg-gradient-to-r ${section.color} 
              text-white p-12 text-center text-2xl font-semibold transform 
              hover:scale-105 transition duration-300`}
          >
            {section.name}
          </Link>
        ))}
      </div>
    </main>
  );
}

