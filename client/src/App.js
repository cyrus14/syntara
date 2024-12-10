import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import UploadSection from "./components/UploadSection";
import SearchSection from "./components/SearchSection";
import PredictSection from "./components/PredictSection";
import DataVisualization from "./components/DataVisualization";
import WelcomeSection from "./components/WelcomeSection";
import Footer from "./components/Footer";
import { auth, provider, signInWithPopup, signOut } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-grow">
        {user ? (
          <>
            {activeTab === "upload" && (
              <>
                <SearchSection />
                <UploadSection />
                <PredictSection />
              </>
            )}
            {activeTab === "visualization" && <DataVisualization />}
          </>
        ) : (
          <WelcomeSection onSignIn={handleSignIn} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
