import React from "react";

function WelcomeSection({ onSignIn }) {
  const handleScroll = () => {
    const target = document.getElementById("about").offsetTop;
    const startPosition = window.pageYOffset;
    const distance = target - startPosition;
    const duration = 1000; // Adjust duration (in milliseconds) for slower scrolling
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const scrollY = easeInOutCubic(
        progress,
        startPosition,
        distance,
        duration
      );
      window.scrollTo(0, scrollY);
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  // Easing function for smoother animation
  const easeInOutCubic = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 to-red-600 flex flex-col justify-center items-center relative text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          Unlock the Power of Healthcare Data
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          The volume of healthcare data is growing rapidly, but much of it goes
          unused due to privacy concerns. Syntara empowers healthcare with
          secure data solutions.
        </p>
        <button
          className="bg-white text-blue-600 font-semibold text-lg px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition duration-300"
          onClick={onSignIn}
        >
          Sign In to Get Started
        </button>
      </div>

      <div className="absolute bottom-8">
        <button
          onClick={handleScroll}
          className="flex flex-col items-center justify-center text-white animate-bounce"
        >
          <span className="mb-2 text-sm">Learn About Us</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default WelcomeSection;
