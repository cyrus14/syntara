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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user || null);
  
      if (user) {
        try {
          // Fetch admin emails from your backend
          const response = await fetch("http://localhost:8000/get-admin-emails");
          const adminEmailsJson = await response.json();
  
          // Check if the user's email is in the admin email list
          const isAdminUser = adminEmailsJson.adminEmails.includes(user.email);
          setIsAdmin(isAdminUser);
        } catch (error) {
          console.error("Error checking admin email:", error);
        }
      } else {
        setIsAdmin(false); // Reset admin status when no user is logged in
      }
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
                {isAdmin &&
                <SearchSection />}
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
