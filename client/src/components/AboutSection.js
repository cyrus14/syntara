import React from "react";

function AboutSection() {
  const founders = [
    {
      name: "Ankit Lakkapragada",
      role: "AI Engineer",
      description: "",
      img: "/ankit.jpeg",
    },
    {
      name: "Cyrus Irani",
      role: "Fullstack Engineer",
      description: "",
      img: "/cyrus.jpeg",
    },
    {
      name: "Rohan Shah",
      role: "Fullstack Engineer",
      description: "",
      img: "/rohan.jpeg",
    },
    {
      name: "Rohit Valiveti",
      role: "Fullstack Engineer",
      description: "",
      img: "/rohit.jpeg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 text-center bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Empowering Healthcare with Data Security
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Syntara is a federated data network for hospitals, researchers, and
        consumers to securely and efficiently access health insights created by
        consolidated private data. Using encryption algorithms, we ensure
        privacy while unlocking healthcare's true potential.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {founders.map((founder, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 text-center"
          >
            <img
              src={founder.img}
              alt={founder.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              {founder.name}
            </h3>
            <p className="text-sm text-gray-500">{founder.role}</p>
            <p className="text-sm text-gray-600 mt-2">{founder.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutSection;
