import React, { useState, useEffect } from 'react';

const AutoHangingBoard = () => {
  const [isRightStringCut, setIsRightStringCut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRightStringCut(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className=" fixed top-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div 
        className="absolute top-0 left-12 w-1 bg-amber-700 origin-top transition-all duration-700 ease-out"
        style={{
          height: isRightStringCut?'105px':"80px",
          transform: isRightStringCut ? 'rotate(-4deg)' : 'rotate(0deg)',
        }}
      />

      <div 
        className={`absolute top-0 right-12 w-1 bg-amber-700 origin-top transition-all duration-300 ${
          isRightStringCut ? 'opacity-0 scale-y-50' : 'opacity-100 scale-y-100'
        }`}
        style={{
          height: '80px',
        }}
      />
      {isRightStringCut && (
        <div 
          className="absolute top-16 right-12 w-1 bg-amber-700"
          style={{
            height: '40px',
            animation: 'ropeFall 1.5s ease-in forwards',
          }}
        />
      )}

      <div 
        className={`hanging-box box relative top-20 w-64 h-16   rounded-lg shadow-lg transition-all duration-700 ease-out origin-top-left ${
          isRightStringCut ? 'transform rotate-28 translate-x-2' : 'transform rotate-0'
        }`}
      >
        <div className="absolute -top-1 left-12 w-3 h-3 bg-gray-900 rounded-full border border-gray-600"></div>
        <div className="absolute -top-1 right-12 w-3 h-3 bg-gray-900 rounded-full border border-gray-600"></div>
        <div className="flex items-center justify-center h-full text-black font-semibold">
          Happy New Year 2026
        </div>
      </div>

      <style jsx>{`
        @keyframes ropeFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) rotate(30deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AutoHangingBoard;


