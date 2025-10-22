import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import useTheme from "./store/useTheme";
import useAuthStore from "./store/authStore";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import Login from "./Pages/Auth/Login/Login";
import Signup from "./Pages/Auth/Signup/Signup";
import Tasks from "./Pages/Tasks/Tasks";
import Profile from "./Pages/User/Profile/Profile";
import Features from "./Pages/Features/Features";
import About from "./Pages/About/About";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFound from "./Pages/NotFound/NotFound";

function App() {
  const { theme } = useTheme();
  const initAuth = useAuthStore((state) => state.init);

  // Apply theme globally
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Initialize auth from localStorage
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
