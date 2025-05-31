import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage';
import QuestionPapersInterface from './components/QuestionPaper';
import LoginModal from './components/Login';
import ForgotPassword from './components/ForgotPass';
import Loading from './components/Loading';
import ToastContainer from './components/ToastContainer';
import { ToastProvider, useToast } from "./components/ToastContext"
import { Helmet } from 'react-helmet';
function App_main() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUpPageOpen, setSignUpPageOpen] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const { addToast } = useToast();
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

  const handleLogout = () => {
    addToast("Logout Successful", "success")
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
  }, [isLoginModalOpen]);


  return (

    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} onLoginClick={handleLoginPage} onLogout={handleLogout} onSignUpClick={handleSignUpPage} />}
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
          onLoadClose={() => setIsLoad(false)}
          isLoading={handleLoading}
        />
        <ForgotPassword isForgotOpen={isForgotPass} onForgotClose={() => setIsForgotPass(false)} onLoadClose={() => setIsLoad(false)} isLoading={handleLoading} />
      </BrowserRouter>
    </ToastProvider>

  );
}
const App = () => {

  return (
    <ToastProvider>
      <Helmet>
        <title>NIT KKR Previous Papers</title>
        <meta name="description" content="Access Previous Papers of NIT Kurukshetra , to Work and acheive the best Grade in your exams ." />
        <meta name="keywords" content="QPaper, past papers, exam prep, CBSE, SSC, study materials, students,NIT KKR , NIT Kurukshetra, NIT previous papers" />
      </Helmet>
      <App_main />
    </ToastProvider>
  )
}
export default App;
