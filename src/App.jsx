import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage';
import QuestionPapersInterface from './components/QuestionPaper';
import LoginModal from './components/Login';
import ForgotPassword from './components/ForgotPass';
import Loading from './components/Loading';
import ToastContainer from './components/ToastContainer';
import { ToastProvider, useToast } from "./components/ToastContext"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ContributeModal from './components/ContributeModal'
import { Analytics } from "@vercel/analytics/react"
import QuestionPapersVerification from './components/tobeVerifed';
function App_main() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUpPageOpen, setSignUpPageOpen] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [ContributeModalOpen, setContributeModalOpen] = useState(false);
  const { addToast } = useToast();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://back-u7se.onrender.com/auth/check", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        const userData = { email: data.user.email, name: data.user.name, role: data.user.role };

        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        throw error;
      }
    };

    checkAuth();
  }, []);

  const handleLoginPage = () => {

    setSignUpPageOpen(false);
    setLoginModalOpen(true);
  };
  const handleSignUpPage = () => {
    setSignUpPageOpen(true);
    setLoginModalOpen(true);


  }
  const handleLoading = () => {
    setIsLoad(true);
  }
  const handleForgotPass = () => {
    setLoginModalOpen(false);
    setSignUpPageOpen(false);
    setIsForgotPass(true);

  }
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);

    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    addToast("Logout Successful", "success")
    setUser(null);


    setIsLoggedIn(false);
    const response = await fetch("https://back-u7se.onrender.com/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

  };

  useEffect(() => {
  }, [isLoginModalOpen]);


  return (

    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} onLoginClick={handleLoginPage} user={user} onLogin={handleLogin} onLogout={handleLogout} onSignUpClick={handleSignUpPage} onContributeClick={() => setContributeModalOpen(true)} />}
          />
          <Route
            path="/papers"
            element={<QuestionPapersInterface isLoggedIn={isLoggedIn} user={user} onLoginClick={handleLoginPage} onLogout={handleLogout} onLoadClose={() => setIsLoad(false)}
              isLoading={handleLoading} />}
          />
          <Route
            path='/contribute'
            element={<ContributeModal onClose={() => setContributeModalOpen(false)} isContributeOpen={ContributeModalOpen} user={user} />}
          />
          <Route path='/verifypaper' element={<QuestionPapersVerification isLoading={handleLoading} onLoadClose={() => setIsLoad(false)} />} />
        </Routes>
        <Analytics />
        <Loading isLoadingOpen={isLoad} />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
          isSignUpOpen={isSignUpPageOpen}
          setForgotPass={handleForgotPass}
          onLoadClose={() => setIsLoad(false)}
          isLoading={handleLoading}
        />
        <ForgotPassword isForgotOpen={isForgotPass} onForgotClose={() => setIsForgotPass(false)} onLoadClose={() => setIsLoad(false)} isLoading={handleLoading} onLogin={handleLogin} />
      </BrowserRouter>
    </ToastProvider>

  );
}
const App = () => {

  return (
    <ToastProvider>
      <GoogleOAuthProvider clientId='339051675114-aaha2bnjsut4rat31u31c72rrl916elu.apps.googleusercontent.com'>
        <HelmetProvider>
          <Helmet>
            <title>NIT KKR Previous Papers</title>
            <meta name="description" content="Access Previous Papers of NIT Kurukshetra , To Work and acheive the best Grade in your exams ." />
            <meta name="keywords" content="QPaper, past papers, exam prep, CBSE, SSC, study materials,students,NIT KKR, NIT Kurukshetra, NIT previous papers,NIT KKR Question Papers, NIT Kurukshetra Question Papers" />
          </Helmet>
        </HelmetProvider>

        <App_main />
      </GoogleOAuthProvider>
    </ToastProvider >
  )
}
export default App;
