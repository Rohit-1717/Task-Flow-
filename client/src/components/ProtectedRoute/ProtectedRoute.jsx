// components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuth, isInitialized } = useAuthStore();

  // Show loading spinner while initializing auth
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Redirect to login only after initialization is complete
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
