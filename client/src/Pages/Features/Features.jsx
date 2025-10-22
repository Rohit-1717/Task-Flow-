import { Link } from "react-router-dom";
import {
  FiCheckSquare,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiBell,
  FiLock,
  FiSmartphone,
  FiZap,
} from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: <FiCheckSquare className="w-8 h-8" />,
      title: "Smart Task Management",
      description:
        "Create, organize, and prioritize tasks with our intuitive drag-and-drop interface.",
    },
    {
      icon: <FiCalendar className="w-8 h-8" />,
      title: "Due Date Tracking",
      description:
        "Never miss a deadline with smart due date reminders and calendar integration.",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Team Collaboration",
      description:
        "Assign tasks to team members and collaborate seamlessly on projects.",
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: "Progress Analytics",
      description:
        "Track your productivity with detailed insights and performance metrics.",
    },
    {
      icon: <FiBell className="w-8 h-8" />,
      title: "Smart Notifications",
      description:
        "Get timely reminders and notifications for upcoming deadlines and updates.",
    },
    {
      icon: <FiLock className="w-8 h-8" />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and encryption.",
    },
    {
      icon: <FiSmartphone className="w-8 h-8" />,
      title: "Cross-Platform",
      description:
        "Access your tasks from any device - desktop, tablet, or mobile.",
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Built for speed with instant updates and smooth performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-base-200 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-base-content">
              Powerful Features
            </h1>
            <p className="text-xl md:text-2xl text-base-content/70 mb-8">
              Everything you need to manage your tasks efficiently and boost
              your productivity
            </p>
            <Link
              to="/signup"
              className="btn btn-primary btn-lg text-primary-content"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="card-body text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="card-title justify-center text-lg font-semibold mb-3 text-base-content">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-base-content">
              Ready to Boost Your Productivity?
            </h2>
            <p className="text-xl mb-8 text-base-content/70">
              Join thousands of users who are already managing their tasks
              efficiently with TaskFlow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn btn-primary btn-lg text-primary-content"
              >
                Start Free Trial
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;