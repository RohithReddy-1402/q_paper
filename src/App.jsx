import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage';
import QuestionPapersInterface from './components/QuestionPaper';
import LoginModal from './components/Login';
import ForgotPassword from './components/ForgotPass';
import Loading from './components/Loading';

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUpPageOpen,setSignUpPageOpen]=useState(false);
  const [isForgotPass,setIsForgotPass]=useState(false);
  const [isLoad,setIsLoad]=useState(false);

  const handleLoginPage = () => {
    
    setSignUpPageOpen(false);
    setLoginModalOpen(true);
  };
  const handleSignUpPage=()=>{
    console.log("sent")
    
      setSignUpPageOpen(true);
      setLoginModalOpen(true);

    
  }
  const handleForgotPass=()=>{
    setLoginModalOpen(false);
    setSignUpPageOpen(false);
    setIsForgotPass(true);
    
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
      <Loading isLoadingOpen={isLoad} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
        isSignUpOpen={isSignUpPageOpen}
        setForgotPass={handleForgotPass}
        onLoadClose={()=>setIsLoad(false)}
      />
      <ForgotPassword isForgotOpen={isForgotPass} onForgotClose={()=>setIsForgotPass(false)} onLoadClose={()=>setIsLoad(false)}/>
    </BrowserRouter>
  );
}

export default App;
