import { Link } from "react-router-dom";
import { 
  FiTarget, 
  FiEye, 
  FiHeart, 
  FiAward,
  FiUsers,
  FiGlobe,
  FiTrendingUp
} from "react-icons/fi";

const About = () => {
  const stats = [
    { icon: <FiUsers className="w-6 h-6" />, number: "10K+", label: "Active Users" },
    { icon: <FiGlobe className="w-6 h-6" />, number: "50+", label: "Countries" },
    { icon: <FiTrendingUp className="w-6 h-6" />, number: "99.9%", label: "Uptime" },
    { icon: <FiAward className="w-6 h-6" />, number: "4.8/5", label: "Rating" }
  ];

  return (
    <div className="min-h-screen bg-base-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-base-200 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-base-content">
              About TaskFlow
            </h1>
            <p className="text-xl md:text-2xl text-base-content/70">
              Revolutionizing task management for individuals and teams worldwide
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FiTarget className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-base-content">Our Mission</h2>
              </div>
              <p className="text-lg text-base-content/70 mb-6">
                To empower individuals and teams to achieve their full potential by providing 
                intuitive, powerful, and accessible task management tools that simplify workflow 
                and boost productivity.
              </p>
              <p className="text-lg text-base-content/70">
                We believe that everyone deserves to work smarter, not harder. TaskFlow is 
                designed to help you focus on what truly matters while we handle the organization.
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FiEye className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-base-content">Our Vision</h2>
              </div>
              <p className="text-lg text-base-content/70 mb-6">
                To become the world's most trusted task management platform, recognized for 
                innovation, reliability, and user-centric design that adapts to the evolving 
                needs of modern workplaces.
              </p>
              <p className="text-lg text-base-content/70">
                We envision a future where task management is seamless, collaborative, and 
                integrated into every successful workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-primary mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-base-content mb-2">
                  {stat.number}
                </div>
                <div className="text-base-content/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-base-content">Our Values</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              The principles that guide everything we do at TaskFlow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <FiHeart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center text-xl font-semibold mb-4 text-base-content">
                  User First
                </h3>
                <p className="text-base-content/70">
                  Every decision we make is driven by what's best for our users. 
                  Your success is our success.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <FiAward className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center text-xl font-semibold mb-4 text-base-content">
                  Excellence
                </h3>
                <p className="text-base-content/70">
                  We strive for excellence in every feature, every update, and 
                  every interaction with our platform.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body text-center">
                <FiUsers className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="card-title justify-center text-xl font-semibold mb-4 text-base-content">
                  Collaboration
                </h3>
                <p className="text-base-content/70">
                  We believe in the power of teamwork and build tools that 
                  enhance collaboration and communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-base-content">
              Join the TaskFlow Community
            </h2>
            <p className="text-xl mb-8 text-base-content/70">
              Be part of our growing community and transform how you manage tasks forever
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg text-primary-content">
                Get Started Today
              </Link>
              <Link to="/features" className="btn btn-outline btn-lg">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;