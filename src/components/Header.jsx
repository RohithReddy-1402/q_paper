"use client";
import { useState } from "react";
// import Button from '@mui/material/Button';
// import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import nextLogo from "/icon.png";
import {useRef} from "react";
import "./Header.styles.css";
import {
  Lock,
  BookOpen,
  Upload,
  User,
  KeyRound,
  LogOut,
  Book,
  Briefcase,
  ArrowRight,
  Star,
  Download,
} from "lucide-react";
export default function Header({isLoggedIn,
  user,
  onLoginClick,
  onLogin,
  onLogout,
  onSignUpClick}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useNavigate();
  const dropdownRef = useRef(null);
  const handleiconclick = () => {
    if (dropdownRef.current) dropdownRef.current.classList.toggle("hidden");
  };
  const navigate = useNavigate();
  const handleNavigation = (route) => {
    setMenuOpen(false);
    navigate(route);
  };
  return (
    <main className="z-50 min-h-full flex flex-col items-center justify-start bg-transparent font-sans">
      <div className="flex items-center md:justify-around justify-between w-full min-h-24">
        <div className="logo ml-2 lg:ml-8 cursor-pointer flex not-sm:flex-col  justify-center items-center">
          <img src={nextLogo} alt="Next.js logo" width={100} height={20} />
        </div>
        <div
          className="nav-btn hidden lg:flex  items-center h-auto py-4 mx-8 "
          style={{ width: "65%" }}
        >
          <h1 className="cursor-pointer hover:text-blue-500">
            <Link to="/nit-kkr-pyqs">Home</Link>
          </h1>
          <div className="relative group">
            <h1 className="cursor-pointer hover:text-blue-500">
              <Link to="/nit-kkr/about">About Us</Link>
            </h1>

            <div className="absolute top-full left-0 pt-2 hidden group-hover:flex flex-col bg-white shadow-lg rounded-md min-w-48 z-50">
              <Link to="/nit-kkr/about/team" className="px-4 py-2 hover:bg-gray-100">
                Our Team
              </Link>
              <Link
                to="/nit-kkr/about/mission"
                className="px-4 py-2 hover:bg-gray-100"
              >
                Mission
              </Link>
              <Link
                to="/nit-kkr/about/history"
                className="px-4 py-2 hover:bg-gray-100"
              >
                History
              </Link>
            </div>
          </div>
          <h1 className="cursor-pointer hover:text-blue-500">
            <Link to="/nit-kkr/question-papers">Question Papers</Link>
          </h1>
          <h1 className="cursor-pointer hover:text-blue-500">
            <Link to="/nit-kkr/syllabus">Syllabus</Link>
          </h1>
          <h1 className="cursor-pointer hover:text-blue-500">
            <Link to="/nit-kkr/events">Events</Link>
          </h1>
          <h1 className="cursor-pointer hover:text-blue-500">
            <Link to="/nit-kkr/gallery">Gallery</Link>
          </h1>
          <h1 className="cursor-pointer hover:text-blue-500">
            <Link to="/nit-kkr-pyqs/contact">Contact</Link>
          </h1>
          
        </div>
        <div className="flex h-16 items-center  justify-around lg:mx-8 gap-1">
          
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={onLoginClick}
                  className="bg-white/80 ml-8 text-indigo-600 border border-indigo-100 px-5 py-2 rounded-lg shadow-sm hover:shadow-md 
                  transition-all duration-300 flex items-center space-x-2 hover:bg-indigo-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </button>
                <button
                  onClick={onSignUpClick}
                  className="bg-indigo-600 text-white px-5 py-2 hidden rounded-lg shadow-md hover:shadow-lg 
                  transition-all duration-300 md:flex items-center space-x-2 hover:bg-indigo-700"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Sign Up</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className=" px-4 py-2 rounded-lg inline-block items-center space-x-2">
                  <div className="flex items-center">
                    <div className="relative">
                      <div
                        id="avatarButton"
                        className="relative w-10 h-10 overflow-hidden bg-gray-100 shadow-pink-200 rounded-full dark:bg-gray-600 cursor-pointer"
                        data-dropdown-toggle="userDropdown"
                        onClick={handleiconclick}
                      >
                        <svg
                          className="absolute w-12 h-12 text-gray-400 -left-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>

                      <div
                        ref={dropdownRef}
                        className="z-10 hidden absolute top-full left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <div className="px-4 py-3  text-sm text-gray-900 dark:text-white">
                          <div>{user?.name}</div>
                          <div className="font-medium truncate pt-2">
                            {user?.email}
                          </div>
                        </div>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Settings
                            </a>
                          </li>
                        </ul>
                        <div className="py-1">
                          <a
                            href="#"
                            onClick={onLogout}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Sign out
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="font-medium dark:text-black ml-4">
                      <div>{user?.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.joindate || null}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <button
                  onClick={onLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg 
                  transition-all duration-300 flex items-center space-x-2 hover:bg-indigo-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button> */}
              </div>
            )}
          </div>
          <div
            className="flex lg:hidden cursor-pointer pr-4"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <CloseIcon className="none" fontSize="large" /> : <MenuIcon fontSize="large" className="text-black"/>}
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="z-10 flex w-full flex-col gap-4 items-start h-auto py-4 px-8">
          <h1
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleNavigation("/")}
          >
            Home
          </h1>
          <h1
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleNavigation("/about")}
          >
            About Us
          </h1>
          <h1
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleNavigation("/nit-kkr/question-papers")}
          >
            Question Papers
          </h1>
          <h1 onClick={() => handleNavigation("/nit-kkr/syllabus")} className="cursor-pointer hover:text-blue-500">
            syllabus
          </h1>
          <h1
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleNavigation("/events")}
          >
            Events
          </h1>
          <h1
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleNavigation("/gallery")}
          >
            Gallery
          </h1>
          <h1
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleNavigation("/nit-kkr-pyqs/contact")}
          >
            Contact
          </h1>
          
        </div>
      )}
    </main>
  );
}
