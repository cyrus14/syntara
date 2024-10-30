import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import WelcomeSection from "./components/WelcomeSection";
import SearchSection from "./components/SearchSection";
import UploadSection from "./components/UploadSection";
import Footer from "./components/Footer";
import { auth, provider, signInWithPopup, signOut } from "./firebase";

import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
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
      <Navbar user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />
      <div className="flex-grow">
        {user ? (
          <>
            <SearchSection />
            <UploadSection />
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
