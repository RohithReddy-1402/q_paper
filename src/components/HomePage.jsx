import React, { useState } from 'react';
import { Lock, BookOpen, Upload, User, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Image from '../assets/7228781.jpg'
const HomePage = ({ isLoggedIn, user, onLoginClick, onLogout }) => {
  const nav=useNavigate();

  const url="https://drive.google.com/uc?export=view&id=1h2uz5s5TUkeXsprHCn2azVHY7BAC6ubX";

  const handleQuestionPapers = () => {
    if (!isLoggedIn) {
      alert('Please log in to access Question Papers');
    } else {
      nav('/home')
    }
  };

  const handleContribute = () => {
    if (!isLoggedIn) {
      alert('Please log in to Contribute');
    } else {
      console.log('Opening Contribution Section');
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-gradient-x 
        opacity-50 transform transition-all duration-1000 ease-in-out"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          boxShadow: 'inset 0 0 200px rgba(255,255,255,0.3)',
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-lg transform rotate-12 opacity-50 blur-sm animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/20 rounded-xl transform -rotate-12 opacity-40 blur-sm animate-float-reverse"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-end space-x-4">
        {!isLoggedIn ? (
          <>
            <button 
              onClick={onLoginClick}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 
              transition duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <KeyRound className="w-5 h-5" />
              <span>Login</span>
            </button>
            <button 
              onClick={onLoginClick}
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-purple-700 
              transition duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <User className="w-5 h-5" />
              <span>Sign Up</span>
            </button>
          </>
        ) : (
            <button 
            onClick={onLogout}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-indigo-700 
            transition duration-300 flex items-center space-x-2 transform hover:scale-105"
          >
            <KeyRound className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center space-y-8 z-10 relative p-8">
        <div className="w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <button 
            onClick={handleQuestionPapers}
            className="w-full bg-white/30 backdrop-blur-lg border border-white/40 
            text-gray-800 px-8 py-6 rounded-2xl shadow-2xl 
            flex items-center justify-center space-x-4 
            hover:bg-blue-100/50 transition duration-300"
          >
            {!isLoggedIn && <Lock className="w-6 h-6 text-gray-500" />}
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold">Question Papers</span>
          </button>
        </div>

        <div className="w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <button 
            onClick={handleContribute}
            className="w-full bg-white/30 backdrop-blur-lg border border-white/40 
            text-gray-800 px-8 py-6 rounded-2xl shadow-2xl 
            flex items-center justify-center space-x-4 
            hover:bg-green-100/50 transition duration-300"
          >
            {!isLoggedIn && <Lock className="w-6 h-6 text-gray-500" />}
            <Upload className="w-8 h-8 text-green-600" />
            <span className="text-xl font-semibold">Contribute</span>
          </button>
        </div>
      </div>

      <div className="w-1/2 flex justify-center items-center z-10 relative p-8">
        <div className="w-full max-w-md transform transition-all duration-300 hover:scale-105">
          <img 
            src={Image}
            alt="Question Paper" 
            className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/50 object-cover"
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
          100% { transform: translateY(0px) rotate(12deg); }
        }

        @keyframes float-reverse {
          0% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(20px) rotate(-15deg); }
          100% { transform: translateY(0px) rotate(-12deg); }
        }

        .animate-gradient-x {
          animation: gradient 15s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;