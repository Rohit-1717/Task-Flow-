import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await register(name, email, password);
      navigate("/tasks"); // Redirect on successful signup
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-base-100 text-base-content px-6 md:px-16 transition-colors duration-300">
      {/* Left Illustration */}
      <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
        <img
          src="/signup_img.png"
          alt="Signup Illustration"
          className="max-w-sm md:max-w-md w-full"
        />
      </div>

      {/* Right Form */}
      <div className="md:w-1/2 w-full flex justify-center">
        <div className="card w-full max-w-md bg-base-200 shadow-xl p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Create Your Account
          </h2>

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <form className="space-y-5" onSubmit={handleSignup}>
            {/* Full Name */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                  placeholder="Create a strong password"
                  className="input input-bordered w-full rounded-md pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {/* Confirm Password */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="input input-bordered w-full rounded-md pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-primary"
                >
                  {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-primary w-full rounded-md ${
                loading ? "loading" : ""
              }`}
              disabled={loading}
            >
              Sign Up
            </button>

            {/* Switch to Login */}
            <p className="text-center text-sm mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
