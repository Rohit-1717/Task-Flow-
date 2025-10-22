import { useState, useEffect, useRef } from "react";
import useAuthStore from "../../store/authStore";
import useTheme from "../../store/useTheme";
import { FiSun, FiMoon } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuth, user, logout } = useAuthStore();
  const { toggleTheme, theme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 sm:px-6 py-3 sticky top-0 z-50 flex justify-between items-center">
      
      {/* Left: Logo */}
      <Link
        to={isAuth ? "/tasks" : "/"}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <img src="/logo.png" alt="TaskFlow Logo" className="w-8 h-8 object-contain rounded-md" />
        <span className="text-xl font-bold text-primary">TaskFlow</span>
      </Link>

      {/* Center Links - Only for unauthenticated */}
      {!isAuth && (
        <ul className="hidden lg:flex gap-6 font-medium">
          <li><a className="hover:text-primary">Home</a></li>
          <li><a className="hover:text-primary">Features</a></li>
          <li><a className="hover:text-primary">About</a></li>
        </ul>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        {isAuth ? (
          /* Authenticated: User Avatar & Dropdown */
          <div ref={userDropdownRef} className="relative ml-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserDropdownOpen(!userDropdownOpen);
              }}
              className="btn btn-ghost btn-circle avatar rounded-full border border-zinc-700"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`
                  }
                  alt="Avatar"
                />
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 bg-base-200 p-3 rounded-lg shadow-md w-48 z-50">
                <p className="font-semibold mb-2">{user?.name || "User"}</p>
                <Link
                  to="/tasks"
                  className="btn btn-ghost btn-sm w-full justify-start rounded-md mb-1"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  Tasks
                </Link>
                <Link
                  to="/user-profile"
                  className="btn btn-ghost btn-sm w-full justify-start rounded-md mb-1"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setUserDropdownOpen(false);
                  }}
                  className="btn btn-error btn-sm w-full justify-start rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Not Authenticated: Get Started + Mobile Menu */
          <>
            {/* Desktop Get Started */}
            <Link
              to="/login"
              className="btn btn-primary hidden md:inline-flex rounded-md px-6"
            >
              Get Started
            </Link>

            {/* Mobile Hamburger */}
            <div ref={mobileMenuRef} className="md:hidden relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileOpen(!mobileOpen);
                }}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`} />
              </button>

              {mobileOpen && (
                <ul className="absolute right-0 mt-3 bg-base-100 rounded-lg shadow-md w-48 p-2 border z-50">
                  <li><a className="hover:bg-base-200">Home</a></li>
                  <li><a className="hover:bg-base-200">Features</a></li>
                  <li><a className="hover:bg-base-200">About</a></li>
                  <li>
                    <Link to="/login" className="btn btn-primary w-full mt-1 rounded-md">
                      Get Started
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
