import styles from "./Navbar.css";

function Navbar({ user, onSignIn, onSignOut, isAdmin }) {
  return (
    <nav
      className={
        styles.navbar +
        "bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 animate-gradient-x shadow-md "
      }
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Animated Syntara Logo/Name */}
        <div className="flex items-center space-x-8">
          <span className="text-3xl font-bold text-white hover:opacity-90 transition">
            Syntara
          </span>
        </div>

        {/* User Info and Sign-In/Out Buttons */}
        <div className="flex items-center">
          {user ? (
            <>
              <span className="text-white mr-4 flex items-center">
                {isAdmin && (
                  <span className="mr-2 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                    Contributor
                  </span>
                )}
                Welcome, {user.displayName}
              </span>
              <img
                src={user?.photoURL || "/default-profile.jpg"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                onError={(e) => {
                  e.target.src = "/default-profile.jpg";
                }}
              />
              <button
                onClick={onSignOut}
                className="ml-4 bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-blue-200 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded shadow hover:bg-blue-200 transition"
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
