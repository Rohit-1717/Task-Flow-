import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10 border-t border-base-300 transition-colors duration-300">
    {/* Left Section */}
    <aside className="space-y-3">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="TaskFlow Logo"
            className="w-8 h-8 object-contain rounded-md"
          />
          <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">
            TaskFlow
          </span>
        </Link>
      </div>

      <p className="text-sm opacity-70 max-w-sm">
        Streamline your projects, stay organized, and boost productivity with
        TaskFlow’s modern task management solution.
      </p>

      <p className="text-xs opacity-60">
        © {new Date().getFullYear()} TaskFlow. All rights reserved.
      </p>
    </aside>

    {/* Company Links */}
    <nav>
      <h6 className="footer-title">Company</h6>
      <a className="link link-hover">About</a>
      <a className="link link-hover">Careers</a>
      <a className="link link-hover">Contact</a>
    </nav>

    {/* Support Links */}
    <nav>
      <h6 className="footer-title">Support</h6>
      <a className="link link-hover">Help Center</a>
      <a className="link link-hover">Privacy Policy</a>
      <a className="link link-hover">Terms of Service</a>
    </nav>

    {/* Social Links */}
    <nav>
      <h6 className="footer-title">Follow Us</h6>
      <div className="flex gap-4 mt-2">
        <a className="hover:text-primary transition">
          <FaTwitter size={22} />
        </a>
        <a className="hover:text-primary transition">
          <FaLinkedin size={22} />
        </a>
        <a className="hover:text-primary transition">
          <FaGithub size={22} />
        </a>
        <a className="hover:text-primary transition">
          <MdOutlineEmail size={22} />
        </a>
      </div>
    </nav>
  </footer>
);

export default Footer;
