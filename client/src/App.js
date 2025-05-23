import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import UploadAndPredictSection from "./components/UploadAndPredictSection";
import SearchSection from "./components/SearchSection";
import WelcomeSection from "./components/WelcomeSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import PredictSectionOnly from "./components/PredictSectionOnly";
import { BACKEND_URL } from "./constants";


function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user || null);

      if (user) {
        try {
          // Fetch admin emails from your backend
          const response = await fetch(
            `${BACKEND_URL}/get-admin-emails`
          );
          const adminEmailsJson = await response.json();

          // Check if the user's email is in the admin email list
          const isAdminUser = adminEmailsJson.adminEmails.includes(user.email);
          setIsAdmin(isAdminUser);
          console.log("isAdminUser", isAdminUser);
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
    <div className="bg-gradient-to-br from-blue-600 to-red-600 min-h-screen flex flex-col">
      <div className="flex-grow">
        {user ? (
          <>
            <Navbar
              user={user}
              onSignIn={handleSignIn}
              onSignOut={handleSignOut}
              isAdmin={isAdmin}
            />
            <div className="container mx-auto px-4 py-8 space-y-8">
              <SearchSection />
              {isAdmin && <UploadAndPredictSection />}
              {!isAdmin && <PredictSectionOnly />}
            </div>
          </>
        ) : (
          <>
            <WelcomeSection onSignIn={handleSignIn} />
            <AboutSection />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
