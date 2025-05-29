import React, { useState, useEffect } from 'react';
import { Lock, BookOpen, Upload, User, KeyRound, LogOut, Book, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const HomePage = ({ isLoggedIn, user, onLoginClick, onLogout, onSignUpClick }) => {
  const [activeHover, setActiveHover] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
   const nav=useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleQuestionPapers = () => {
    nav("/home")
  };

  const handleContribute = () => {
    if (!isLoggedIn) {
      alert('Please log in to Contribute');
    } else {
      console.log('Opening Contribution Section');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-indigo-300/20 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>
      <div className={`absolute inset-0 z-50 bg-indigo-600 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="text-white text-4xl font-bold flex items-center">
          <span className="mr-3">StudyResource</span>
          <Book className="w-10 h-10" />
        </div>
      </div>
      <header className="relative z-20 w-full py-6 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Book className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StudyResource
            </h1>
          </div>
          
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
                <div className="bg-white/80 px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg 
                  transition-all duration-300 flex items-center space-x-2 hover:bg-indigo-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-10 flex flex-col lg:flex-row px-8 py-12">
        <div className="w-full lg:w-1/2 flex flex-col xl:pl-48 justify-center items-center lg:items-start space-y-8 mb-12 lg:mb-0">
          <div className="text-center lg:text-left max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Your Gateway to Academic Excellence
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Access previous question papers and contribute to help fellow students excel in their academic journey.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleQuestionPapers}
                onMouseEnter={() => setActiveHover('papers')}
                onMouseLeave={() => setActiveHover(null)}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 text-white 
                px-6 py-4 rounded-xl shadow-lg hover:shadow-xl group transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <BookOpen className={`w-6 h-6 transition-all duration-300 ${activeHover === 'papers' ? 'transform -translate-x-1' : ''}`} />
                  <span className="font-semibold text-lg">Browse Question Papers</span>
                  <ArrowRight className={`w-5 h-5 transition-all duration-300 opacity-0 ${activeHover === 'papers' ? 'transform translate-x-1 opacity-100' : ''}`} />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {!isLoggedIn && <Lock className="absolute top-2 right-2 w-4 h-4 text-white/70" />}
              </button>
              
              <button 
                onClick={handleContribute}
                onMouseEnter={() => setActiveHover('contribute')}
                onMouseLeave={() => setActiveHover(null)}
                className="relative overflow-hidden bg-white border-2 border-indigo-500 text-indigo-600 
                px-6 py-4 rounded-xl shadow-lg hover:shadow-xl group transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <Upload className={`w-6 h-6 transition-all duration-300 ${activeHover === 'contribute' ? 'transform -translate-x-1' : ''}`} />
                  <span className="font-semibold text-lg">Contribute Papers</span>
                  <ArrowRight className={`w-5 h-5 transition-all duration-300 opacity-0 ${activeHover === 'contribute' ? 'transform translate-x-1 opacity-100' : ''}`} />
                </div>
                <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                {!isLoggedIn && <Lock className="absolute top-2 right-2 w-4 h-4 text-indigo-500/70" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 max-w-lg mt-12">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Book className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg font-semibold text-gray-800">10+</span>
              </div>
              <p className="text-gray-600 font-bold">Question Papers</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-lg font-semibold text-gray-800">1</span>
              </div>
              <p className="text-gray-600 text-center font-bold">NIT KKR</p>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <div className="relative max-w-md w-full transition-all duration-500 hover:scale-105 transform-gpu">
           
            <div className="flex flex-col items-center justify-center h-full relative z-10">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 mb-6 transform rotate-3 shadow-lg border border-white/30">
                  <BookOpen className="w-20 h-20 text-black mb-2" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black mb-3">Past Question Papers</h3>
                  <p className="text-black/90 mb-6">Prepare better with  previous exam papers</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-white/70"></div>
                    <div className="w-3 h-3 rounded-full bg-white/40"></div>
                    <div className="w-3 h-3 rounded-full bg-white/40"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Book className="w-8 h-8 text-black/70" />
              </div>
              <div className="absolute bottom-12 left-4 w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Upload className="w-6 h-6 text-white/70" />
              </div>
              
              <div className="absolute inset-0 opacity-10" 
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}>
              </div>
            
          
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-100 rounded-xl shadow-lg transform rotate-12 -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-100 rounded-xl shadow-lg transform -rotate-12 -z-10"></div>
          </div>
        </div>
      </main>
      <footer className="relative z-10 py-6 px-8 text-center text-gray-600 bg-white/20 backdrop-blur-sm border-t border-indigo-100">
        <div className="max-w-7xl mx-auto">
          <p>© 2025 StudyResource. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;