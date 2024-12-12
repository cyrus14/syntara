import styles from "./Navbar.css";

function Navbar({ user, onSignIn, onSignOut, isAdmin }) {
  return (
    <nav
      className={
        styles.navbar + " bg-white shadow-md border-b-4 border-gray-200"
      }
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Syntara Logo/Name */}
        <div className="flex items-center space-x-8">
          <span
            className="text-3xl font-bold text-gray-800 hover:text-gray-600 transition cursor-pointer"
            onClick={user ? onSignOut : onSignIn} // Sign out if user is logged in, otherwise sign in
          >
            Syntara
          </span>
        </div>

        {/* User Info and Sign-In/Out Buttons */}
        <div className="flex items-center">
          {user ? (
            <>
              <span className="text-gray-800 mr-4 flex items-center">
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
                className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                onError={(e) => {
                  e.target.src = "/default-profile.jpg";
                }}
              />
              <button
                onClick={onSignOut}
                className="ml-4 bg-white text-gray-800 font-semibold px-4 py-2 rounded shadow border border-gray-300 hover:bg-gray-100 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-white text-gray-800 font-semibold px-4 py-2 rounded shadow border border-gray-300 hover:bg-gray-100 transition"
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
