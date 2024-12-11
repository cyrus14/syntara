import React from "react";

function WelcomeSection({ onSignIn }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 px-4 py-12">
      <div className="text-center bg-white p-8 max-w-3xl mx-auto shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Unlock the Power of Healthcare Data
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The volume of healthcare data is growing rapidly, but much of it goes
          unused due to privacy concerns.
        </p>
        <button
          onClick={onSignIn}
          className="bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
        >
          Sign In to Get Started
        </button>
      </div>
    </div>
  );
}

export default WelcomeSection;
