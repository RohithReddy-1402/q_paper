import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./components/HomePage"));
const QuestionPapersInterface = lazy(
  () => import("./components/QuestionPaper"),
);
const LoginModal = lazy(() => import("./components/Login"));
const ForgotPassword = lazy(() => import("./components/ForgotPass"));
const Loading = lazy(() => import("./components/Loading"));
const ContributeModal = lazy(() => import("./components/ContributeModal"));
const QuestionPapersVerification = lazy(
  () => import("./components/tobeVerifed"),
);
import { ToastProvider, useToast } from "./components/ToastContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";

function App_main() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUpPageOpen, setSignUpPageOpen] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [ContributeModalOpen, setContributeModalOpen] = useState(false);
  const { addToast } = useToast();
  const [papersLength, setPapersLength] = useState(0);
  const [downloadCount, setDownloadCounts] = useState(0);
  const [questionPapers, setQuestionPapers] = useState([]);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://back-6j6v.onrender.com/auth/check",
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        const userData = {
          email: data?.user?.email,
          name: data?.user?.name,
          role: data?.user?.role,
        };

        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        if (err.response?.status !== 401) {
          console.error(err);
        }
      }
    };

    checkAuth();
  }, []);
  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await fetch("https://back-6j6v.onrender.com/papers");
        if (!res.ok) throw new Error("Failed to fetch papers");
        const data = await res.json();
        setQuestionPapers(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching papers:", err);
      } finally {
      }
    }
    fetchPapers();
  }, []);
  const handleLoginPage = () => {
    setSignUpPageOpen(false);
    setLoginModalOpen(true);
  };
  const handleSignUpPage = () => {
    setSignUpPageOpen(true);
    setLoginModalOpen(true);
  };
  const handleLoading = () => {
    setIsLoad(true);
  };
  const handleForgotPass = () => {
    setLoginModalOpen(false);
    setSignUpPageOpen(false);
    setIsForgotPass(true);
  };
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);

    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    addToast("Logout Successful", "success");
    setUser(null);

    setIsLoggedIn(false);
    const response = await fetch("https://back-6j6v.onrender.com/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
  };
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/nit-kkr-pyqs"
            element={
              <Home
                isLoggedIn={isLoggedIn}
                onLoginClick={handleLoginPage}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onSignUpClick={handleSignUpPage}
                onContributeClick={() => setContributeModalOpen(true)}
                papersLength={papersLength}
                downloadCount={downloadCount}
                questionPapers={questionPapers}
              />
            }
          />
          <Route
            path="/nit-kkr/question-papers"
            element={
              <QuestionPapersInterface
                isLoggedIn={isLoggedIn}
                user={user}
                onLoginClick={handleLoginPage}
                onLogout={handleLogout}
                onLoadClose={() => setIsLoad(false)}
                isLoading={handleLoading}
                setDownloadCounts={setDownloadCounts}
                setPapersLength={setPapersLength}
                questionPapers={questionPapers}
              />
            }
          />
          <Route
            path="/nit-kkr-pyqs/contribute"
            element={
              <ContributeModal
                onClose={() => setContributeModalOpen(false)}
                isContributeOpen={ContributeModalOpen}
                user={user}
                isLoading={handleLoading}
                onLoadClose={() => setIsLoad(false)}
              />
            }
          />
          <Route
            path="/nit-kkr-pyqs/verifypaper"
            element={
              <QuestionPapersVerification
                isLoading={handleLoading}
                onLoadClose={() => setIsLoad(false)}
              />
            }
          />
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
        <ForgotPassword
          isForgotOpen={isForgotPass}
          onForgotClose={() => setIsForgotPass(false)}
          onLoadClose={() => setIsLoad(false)}
          isLoading={handleLoading}
          onLogin={handleLogin}
        />
      </BrowserRouter>
    </ToastProvider>
  );
}
const App = () => {
  return (
    <ToastProvider>
      <GoogleOAuthProvider clientId="339051675114-aaha2bnjsut4rat31u31c72rrl916elu.apps.googleusercontent.com">
        <HelmetProvider>
          <Helmet>
            <title>NIT KKR Previous Papers</title>
            <meta
              name="description"
              content="Access Previous Papers of NIT Kurukshetra , To Work and acheive the best Grade in your exams ."
            />
            <meta
              name="keywords"
              content="QPaper, past papers, exam prep, CBSE, SSC, study materials,students,NIT KKR, NIT Kurukshetra, NIT previous papers,NIT KKR Question Papers, NIT Kurukshetra Question Papers,nit kkr pyqs,pyqs,nitkkr pyqs, nitkkr papers,nit kkr papers"
            />
          </Helmet>
        </HelmetProvider>

        <App_main />
      </GoogleOAuthProvider>
    </ToastProvider>
  );
};
export default App;
