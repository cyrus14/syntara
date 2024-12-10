import React from "react";

function Navbar({ user, onSignIn, onSignOut, activeTab, setActiveTab }) {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <img src="/logo.png" alt="Syntara Logo" className="h-16 w-16 mr-2" />
          <span className="text-xl font-bold text-gray-800">Syntara</span>

          {/* Tabs for navigation */}
          <button
            className={`text-lg font-semibold ${
              activeTab === "upload"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload Data
          </button>
          <button
            className={`text-lg font-semibold ${
              activeTab === "visualization"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("visualization")}
          >
            Data Visualization
          </button>
        </div>

        <div className="flex items-center">
          {user ? (
            <>
              <span className="text-gray-800 mr-4">
                Welcome, {user.displayName}
              </span>
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <button
                onClick={onSignOut}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
