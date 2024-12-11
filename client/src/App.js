import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import WelcomeNavbar from "./components/WelcomeNavBar";
import UploadSection from "./components/UploadSection";
import SearchSection from "./components/SearchSection";
import PredictSection from "./components/PredictSection";
import WelcomeSection from "./components/WelcomeSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import { auth, provider, signInWithPopup, signOut } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [welcomeTab, setWelcomeTab] = useState("welcome");

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
      <div className="flex-grow">
        {user ? (
          <>
            {activeTab === "upload" && (
              <>
                <Navbar
                  user={user}
                  onSignIn={handleSignIn}
                  onSignOut={handleSignOut}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <SearchSection />
                <UploadSection />
                <PredictSection />
              </>
            )}
          </>
        ) : (
          <>
            {" "}
            <WelcomeNavbar
              activeTab={welcomeTab}
              setActiveTab={setWelcomeTab}
            />
            <div className="flex-grow">
              {welcomeTab === "welcome" && (
                <WelcomeSection onSignIn={handleSignIn} />
              )}
              {welcomeTab === "about" && <AboutSection />}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
