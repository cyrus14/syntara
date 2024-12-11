function WelcomeNavbar({ activeTab, setActiveTab }) {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <img src="/logo.png" alt="Syntara Logo" className="h-16 w-16 mr-2" />
          <span className="text-xl font-bold text-gray-800">Syntara</span>

          <button
            className={`text-lg font-semibold ${
              activeTab === "welcome"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("welcome")}
          >
            Welcome
          </button>

          <button
            className={`text-lg font-semibold ${
              activeTab === "about"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
}

export default WelcomeNavbar;
