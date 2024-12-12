import React from "react";
import './WelcomeSection.css'; // Ensure this contains any overrides you need

function WelcomeSection({ onSignIn }) {
  const handleScroll = () => {
    const target = document.getElementById("about").offsetTop;
    const startPosition = window.pageYOffset;
    const distance = target - startPosition;
    const duration = 1000;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const scrollY = easeInOutCubic(progress, startPosition, distance, duration);
      window.scrollTo(0, scrollY);
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const easeInOutCubic = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5E49E2] to-[#E21D60] flex flex-col text-white">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-8 py-6 w-full max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold opacity-90">Syntara</span>
        </div>
        <button
          className="text-white font-semibold hover:underline"
          onClick={onSignIn}
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-grow w-full max-w-screen-xl mx-auto px-8">
        {/* Left Column: Text and CTA */}
        <div className="md:w-1/2 md:pr-8 flex flex-col justify-center items-start mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Unlock the Power of Healthcare Data
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg">
            The volume of healthcare data is growing rapidly, but much of it goes unused due to privacy concerns. Syntara empowers healthcare with secure data solutions.
          </p>
          <button
            className="bg-white text-[#5E49E2] font-semibold text-lg px-6 py-3 rounded-full shadow-md hover:bg-[#f0f0ff] transition duration-300"
            onClick={onSignIn}
          >
            Sign In to Get Started
          </button>
        </div>

        {/* Right Column: Stacked Images */}
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
  <div className="absolute top-10 left-10 transform translate-x-6 translate-y-12 bg-white rounded-lg shadow-2xl p-2 max-w-sm w-full z-10 animate-circle">
    <img
      src="/syntara-webpage3.jpeg"
      alt="Healthcare Data Visualization"
      className="w-full h-auto rounded"
    />
  </div>
  <div className="bg-white rounded-lg shadow-2xl p-2 max-w-sm w-full animate-circle-slow">
    <img
      src="/syntara-webpage4.jpeg"
      alt="Healthcare Data Visualization"
      className="w-full h-auto rounded"
    />
  </div>
</div>

      </div>

      {/* Learn About Us button at bottom (optional) */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleScroll}
          className="flex flex-col items-center justify-center text-white opacity-80 hover:opacity-100 transition duration-300"
        >
          <span className="mb-2 text-sm font-semibold">Learn About Us</span>
          <svg
            className="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default WelcomeSection;
