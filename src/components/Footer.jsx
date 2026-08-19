import { Link } from "react-router-dom";
import { HeartHandshake, MapPin, Mail, Globe } from "lucide-react";

export default function Footer() {
  const navLinks = [
    { label: "Home", href: "/nit-kkr-pyqs" },
    { label: "About Us", href: "/nit-kkr/about" },
    { label: "Question Papers", href: "/nit-kkr/question-papers" },
    { label: "Syllabus", href: "/nit-kkr/syllabus" },
    { label: "Tech Stack", href: "/nit-kkr/tech-stack" },
    { label: "Donate", href: "/nit-kkr/donate" },
    { label: "Contact", href: "/nit-kkr/contact" },
    { label: "Privacy Policy", href: "/nit-kkr/privacy-policy" },
  ];

  return (
    <footer className="relative z-10 bg-indigo-950 text-white font-sans w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 flex flex-col md:flex-row justify-between items-start gap-10 md:gap-6">
        {/* Brand */}
        <div className="flex flex-col max-w-xs shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden p-0.5">
              <img
                src="/icon.png"
                alt="NIT KKR PYQs Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <p className="text-white font-semibold text-base leading-tight">
                NIT KKR PYQs
              </p>
              <p className="text-indigo-300 text-xs font-semibold tracking-widest uppercase">
                NexSphere
              </p>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-6">
            A free, student-run platform helping NIT Kurukshetra students find
            previous year question papers and syllabus resources, organized
            by branch, semester and year.
          </p>

          <Link
            to="/nit-kkr/donate"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors self-start"
          >
            <HeartHandshake className="w-4 h-4" />
            Support This Project
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col shrink-0">
          <h3 className="text-base font-semibold text-white mb-5">Quick Links</h3>
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm text-white/70 no-underline hover:text-indigo-300 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Reach Us */}
        <div className="flex flex-col max-w-xs shrink-0">
          <h3 className="text-base font-semibold text-white mb-5">Reach Us</h3>
          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-indigo-300" />
              <p className="text-sm text-white/70 leading-snug m-0">
                NIT Kurukshetra, Haryana, India
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 shrink-0 mt-0.5 text-indigo-300" />
              <Link
                to="/nit-kkr/contact"
                className="text-sm text-white/70 no-underline hover:text-indigo-300 transition-colors"
              >
                Reach us via our Contact page
              </Link>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="w-5 h-5 shrink-0 mt-0.5 text-indigo-300" />
              <Link
                to="/nit-kkr-pyqs"
                className="text-sm text-white/70 no-underline hover:text-indigo-300 transition-colors"
              >
                nitkkrpyqs.in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-6 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-white/40 m-0">
          © {new Date().getFullYear()} NIT KKR PYQs. Built by students, for students.
        </p>
        <p className="text-xs text-white/40 m-0">
          Not officially affiliated with NIT Kurukshetra.
        </p>
      </div>
    </footer>
  );
}
