import { FiArrowRight } from "react-icons/fi";

const Hero = () => (
  <section className="relative flex flex-col md:flex-row items-center justify-between gap-12 px-6 md:px-16 pt-10 md:pt-16 pb-16 bg-gradient-to-br from-base-200 via-base-100 to-base-200 transition-colors duration-300">
    {/* Left Content */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/2 space-y-6">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight text-base-content">
        Simplify Your <span className="text-primary">Workflow</span> with TaskFlow
      </h1>
      <p className="text-lg text-base-content/70 max-w-lg">
        A smarter way to create, organize, and track your daily tasks — all in one sleek dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="btn btn-primary rounded-md px-6 py-3 text-lg font-semibold flex items-center gap-2">
          Get Started <FiArrowRight size={18} />
        </button>
        <button className="btn btn-outline rounded-md px-6 py-3 text-lg font-semibold">
          Learn More
        </button>
      </div>
    </div>

    {/* Right Illustration */}
    <div className="md:w-1/2 flex justify-center md:justify-end">
      <img
        src="/taskImg.png"
        alt="Task management illustration"
        className="rounded-xl w-full max-w-md object-cover"
      />
    </div>

    {/* Decorative Background */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 blur-2xl opacity-30" />
  </section>
);

export default Hero;