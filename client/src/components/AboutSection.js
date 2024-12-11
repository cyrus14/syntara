import React from "react";

function AboutSection() {
  const founders = [
    { name: "Ankit Lakkapragada", role: "AI Engineer", img: "/ankit.jpeg" },
    { name: "Cyrus Irani", role: "Fullstack Engineer", img: "/cyrus.jpeg" },
    { name: "Rohan Shah", role: "Fullstack Engineer", img: "/rohan.jpeg" },
    { name: "Rohit Valiveti", role: "Fullstack Engineer", img: "/rohit.jpeg" },
  ];

  return (
    <div
      id="about"
      className="min-h-screen bg-gradient-to-br from-blue-500 to-red-500 text-white py-16"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Empowering Healthcare with Data Security
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-12">
          Syntara is a federated data network for hospitals, researchers, and
          consumers to securely and efficiently access health insights created
          by consolidated private data. Using encryption algorithms, we ensure
          privacy while unlocking healthcare's true potential.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 shadow-md rounded-lg p-6 text-center"
            >
              <img
                src={founder.img}
                alt={founder.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">{founder.name}</h3>
              <p className="text-sm text-gray-600">{founder.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
