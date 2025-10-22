import { Link } from "react-router-dom";
import { FiHome, FiArrowLeft, FiSearch } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration Image */}
        <div className="flex justify-center">
          <div className="w-full h-full sm:w-80 sm:h-80">
            <img
              src="./404.svg"
              alt="404 Not Found - Page doesn't exist"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-lg text-base-content/70 max-w-md mx-auto leading-relaxed">
            We couldn't find the page you're looking for. It might have been
            moved, deleted, or you entered an incorrect URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link to="/" className="btn btn-primary gap-2 px-6">
            <FiHome className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline gap-2 px-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
