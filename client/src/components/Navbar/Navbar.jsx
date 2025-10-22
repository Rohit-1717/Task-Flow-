import { useState, useEffect, useRef } from "react";
import useAuthStore from "../../store/authStore";
import useTheme from "../../store/useTheme";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
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
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
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
        to={"/"}
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <img
          src="/logo.png"
          alt="TaskFlow Logo"
          className="w-8 h-8 object-contain rounded-md"
        />
        <span className="text-xl font-bold text-primary">TaskFlow</span>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Center Links - Only for unauthenticated */}
        {!isAuth && (
          <ul className="hidden lg:flex gap-6 font-medium">
            <li>
              <Link
                to={"/features"}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to={"/about"}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                About
              </Link>
            </li>
          </ul>
        )}

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
          <>
            {/* Desktop User Dropdown */}
            <div ref={userDropdownRef} className="hidden md:block relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserDropdownOpen(!userDropdownOpen);
                }}
                className="btn btn-ghost btn-circle avatar rounded-full border border-base-300"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User"
                      )}&background=random`
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-base-100 border border-base-300 p-2 rounded-lg shadow-lg w-48 z-50">
                  <p className="font-semibold px-3 py-2 border-b border-base-300">
                    {user?.name || "User"}
                  </p>
                  <Link
                    to="/tasks"
                    className="block px-3 py-2 hover:bg-base-200 rounded-md transition-colors w-full text-left"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Tasks
                  </Link>
                  <Link
                    to="/user-profile"
                    className="block px-3 py-2 hover:bg-base-200 rounded-md transition-colors w-full text-left"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="block px-3 py-2 hover:bg-error hover:text-error-content rounded-md transition-colors w-full text-left mt-1"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Not Authenticated: Get Started */
          <Link
            to="/login"
            className="btn btn-primary hidden md:inline-flex rounded-md px-6"
          >
            Get Started
          </Link>
        )}

        {/* Mobile Hamburger - Always visible on mobile */}
        <div ref={mobileMenuRef} className="md:hidden relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen(!mobileOpen);
            }}
            className="btn btn-ghost btn-circle btn-sm p-2"
            aria-label="Menu"
          >
            {mobileOpen ? <FiX size={32} /> : <FiMenu size={32} />}
          </button>

          {mobileOpen && (
            <div className="absolute right-0 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg w-48 z-50 p-3">
              {!isAuth ? (
                // Mobile menu for unauthenticated users
                <>
                  <a className="block px-3 py-2 hover:bg-base-200 rounded-md transition-colors cursor-pointer mb-1">
                    Home
                  </a>
                  <a className="block px-3 py-2 hover:bg-base-200 rounded-md transition-colors cursor-pointer mb-1">
                    Features
                  </a>
                  <a className="block px-3 py-2 hover:bg-base-200 rounded-md transition-colors cursor-pointer mb-3">
                    About
                  </a>
                  <Link
                    to="/login"
                    className="btn btn-primary w-full rounded-md"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                // Mobile menu for authenticated users
                <>
                  <div className="flex items-center gap-3 px-3 py-2 border-b border-base-300 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User"
                          )}&background=random`
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-semibold text-sm">
                      {user?.name || "User"}
                    </span>
                  </div>
                  <Link
                    to="/tasks"
                    className="block px-3 py-2 hover:bg-base-200 rounded-md transition-colors mb-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    Tasks
                  </Link>
                  <Link
                    to="/user-profile"
                    className="block px-3 py-2 hover:bg-base-200 rounded-md transition-colors mb-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="btn btn-error w-full rounded-md"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
