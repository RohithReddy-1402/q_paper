import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage';
import QuestionPapersInterface from './components/QuestionPaper';
import LoginModal from './components/Login';

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUpPageOpen,setSignUpPageOpen]=useState(false);

  useEffect(() => {
    console.log("Updated State -> isLoggedIn:", isLoggedIn);
    console.log("Updated User ->", user);
  }, [isLoggedIn, user]);

  const handleLoginPage = () => {
    console.log("hello");
    setSignUpPageOpen(false);
    setLoginModalOpen(true);
  };
  const handleSignUpPage=()=>{
    console.log("sent")
    
      setSignUpPageOpen(true);
      setLoginModalOpen(true);

    
  }
  const handleLogin = (userData) => {
    console.log("handleLogin called!");
    console.log("UserData received:", userData);
    setUser(userData);
    setIsLoggedIn(true);
    
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    console.log('event');
  }, [isLoginModalOpen]);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Home isLoggedIn={isLoggedIn} onLoginClick={handleLoginPage} onLogout={handleLogout} onSignUpClick={handleSignUpPage}/>} 
        />
        <Route 
          path="/home" 
          element={<QuestionPapersInterface isLoggedIn={isLoggedIn} user={user} onLoginClick={handleLoginPage} onLogout={handleLogout} />} 
        />
      </Routes>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
        isSignUpOpen={isSignUpPageOpen}
      />
    </BrowserRouter>
  );
}

export default App;
