import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
const Home = lazy(() => import("./components/HomePage"));
const QuestionPapersInterface = lazy(
  () => import("./components/QuestionPaper"),
);
const LoginModal = lazy(() => import("./components/Login"));
const ForgotPassword = lazy(() => import("./components/ForgotPass"));
const Loading = lazy(() => import("./components/Loading"));
const ContributeModal = lazy(() => import("./components/ContributeModal"));
const SyllabusPage = lazy(() => import("./components/test"));
const Syllabus = lazy(() => import("./components/Syllabus"));
const BranchSemester = lazy(() => import("./components/BranchSemester"));
const BranchList = lazy(() => import("./components/BranchList"));
const BranchDetail = lazy(() => import("./components/BranchDetail"));
const QuestionPapersVerification = lazy(
  () => import("./components/tobeVerifed"),
);
const Donate = lazy(() => import("./components/donate"));
const ContactPage = lazy(() => import("./components/contactPage"));
const Loginpage = lazy(() => import("./components/TerminalMode"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const TechStack = lazy(() => import("./components/TechStack"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const NotFound = lazy(() => import("./components/NotFound"));
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
  const { addToast } = useToast();
  const [papersLength, setPapersLength] = useState(0);
  const [downloadCount, setDownloadCounts] = useState(0);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [mode, setMode] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_ENDPOINT}/auth/check`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (!response.ok) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }
        const data = await response.json();
        if (!data?.user) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }
        setUser({
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);
  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/papers`);
        if (!res.ok) throw new Error("Failed to fetch papers");
        const data = await res.json();
        setQuestionPapers(data);
      } catch (err) {
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
    const response = await fetch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
  };
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          }
        >
        <Routes>
          <Route path="/" element={<Navigate to="/nit-kkr-pyqs" replace />} />
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
                user={user}
                isLoading={handleLoading}
                onLoadClose={() => setIsLoad(false)}
              />
            }
          />
          <Route path="/nit-kkr/syllabus" element={<Syllabus isLoggedIn={isLoggedIn}
                user={user}
                onLoginClick={handleLoginPage}
                onLogout={handleLogout}
                onLoadClose={() => setIsLoad(false)}
                isLoading={handleLoading}
                setDownloadCounts={setDownloadCounts}
                setPapersLength={setPapersLength}
                questionPapers={questionPapers} />} />
          <Route
            path="/nit-kkr-pyqs/verifypaper"
            element={
              <QuestionPapersVerification
                isLoading={handleLoading}
                onLoadClose={() => setIsLoad(false)}
              />
            }
          />
          <Route path="/nit-kkr/contact" element={<ContactPage />} />
          <Route path="/nit-kkr/donate" element={<Donate />} />
          <Route
            path="/nit-kkr-pyqs/login"
            element={<Loginpage Mode={mode} />}
          />
          {/* <Route path="/nit-kkr/syllabus/course/rapc-203" element={<SyllabusPage />} /> */}
          <Route path="/nit-kkr/syllabus/course/:code" element={<SyllabusPage />} />
          <Route path="/nit-kkr/syllabus/branch" element={<BranchList />} />
          <Route
            path="/nit-kkr/syllabus/branch/:branchSlug"
            element={<BranchDetail />}
          />
          <Route
            path="/nit-kkr/syllabus/branch/:branchSlug/semester/:semNumber"
            element={<BranchSemester />}
          />
          <Route path="/nit-kkr/about" element={<AboutUs />} />
          <Route path="/nit-kkr/tech-stack" element={<TechStack />} />
          <Route path="/nit-kkr/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
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
        </Suspense>
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
              content="Access Previous Papers (PYQs) of NIT Kurukshetra , To Work and acheive the best Grade in your exams ."
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
