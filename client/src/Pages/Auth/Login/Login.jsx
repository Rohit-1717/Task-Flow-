import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiCopy, FiCheck } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

const Login = () => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const { login, loading, error, isAuth, clearError } = useAuthStore();

  const testEmail = import.meta.env.VITE_TEST_EMAIL;
  const testPassword = import.meta.env.VITE_TEST_PASSWORD;

  // Clear errors when component mounts or inputs change
  useEffect(() => {
    clearError();
  }, [emailInput, passwordInput, clearError]);

  // Handle auth state changes
  useEffect(() => {
    if (isAuth) {
      setToast({ type: "success", message: "Login successful!" });
      setTimeout(() => navigate("/tasks"), 1500);
    }
  }, [isAuth, navigate]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      setToast({ type: "error", message: error });
    }
  }, [error]);

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setToast(null);
    clearError();

    // Basic validation
    if (!emailInput || !passwordInput) {
      setToast({ type: "error", message: "Please fill in all fields" });
      return;
    }

    try {
      await login(emailInput, passwordInput);
      // Navigation will be handled by the useEffect watching isAuth
    } catch (err) {
      // Error is already handled in the store and will be shown via useEffect
      console.log("Login error caught in component:", err.message);
    }
  };

  // Auto-hide toast after 3s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-base-100 text-base-content px-6 md:px-16 transition-colors duration-300 relative">
      {/* Left Illustration */}
      <div className="md:w-1/2 flex justify-center relative mb-10 md:mb-0">
        <img
          src="/Login_img.png"
          alt="Login Illustration"
          className="max-w-lg md:max-w-md w-full"
        />

        {/* Test Credentials Dropdown */}
        <div className="absolute top-0 right-0 md:top-0 md:-right-4">
          <div className="relative">
            <button
              className="btn btn-sm btn-primary rounded-md focus:outline-none flex items-center justify-between gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((prev) => !prev);
              }}
            >
              Test Credentials
            </button>

            {/* Animated Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-72 md:w-60 rounded-xl border border-base-300 p-4 z-50 backdrop-blur-lg bg-white/30 dark:bg-base-200/30 shadow-lg transform transition-all duration-300 ease-out
                ${
                  isDropdownOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-sm font-semibold text-base-content mb-3">
                Test Credentials
              </h4>
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="flex justify-between items-center bg-base-100/70 dark:bg-base-200/70 p-2 rounded-md backdrop-blur-sm">
                  <span className="truncate text-xs text-base-content dark:text-base-content mr-2">
                    {testEmail}
                  </span>
                  <button
                    onClick={() => {
                      handleCopy(testEmail, "email");
                      setEmailInput(testEmail);
                      setIsDropdownOpen(false);
                    }}
                    className="text-primary hover:text-primary-focus"
                    title="Copy email & fill"
                  >
                    {copied === "email" ? (
                      <FiCheck size={16} />
                    ) : (
                      <FiCopy size={16} />
                    )}
                  </button>
                </div>
                {/* Password */}
                <div className="flex justify-between items-center bg-base-100/70 dark:bg-base-200/70 p-2 rounded-md backdrop-blur-sm">
                  <span className="truncate text-xs text-base-content dark:text-base-content mr-2">
                    {testPassword}
                  </span>
                  <button
                    onClick={() => {
                      handleCopy(testPassword, "password");
                      setPasswordInput(testPassword);
                      setIsDropdownOpen(false);
                    }}
                    className="text-primary hover:text-primary-focus"
                    title="Copy password & fill"
                  >
                    {copied === "password" ? (
                      <FiCheck size={16} />
                    ) : (
                      <FiCopy size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="md:w-1/2 w-full flex justify-center">
        <div className="card w-full max-w-md bg-base-200 shadow-xl p-8 rounded-lg relative">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Welcome Back
          </h2>

          {/* Display error from store */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-md"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full rounded-md pr-10"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-primary"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <Link to="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-primary w-full rounded-md ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm mt-3">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-top toast-end z-50`}>
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;
