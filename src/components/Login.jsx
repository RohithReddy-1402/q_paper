import { em, i } from 'framer-motion/client';
import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from "./ToastContext";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { auth, provider, signInWithPopup } from './fireBase';
const LoginModalAuto = ({ isOpen, onClose, onLogin, isSignUpOpen, setForgotPass, isLoading, onLoadClose }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const { addToast } = useToast();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    setIsLogin(!isSignUpOpen)
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      isLoading();

      const response = await fetch("https://back-u7se.onrender.com/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmailID: email, pass: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          addToast("User Not Found", "error");
          setEmail("");
          setPassword("");
        } else if (response.status == 402) { addToast("Incorrect Password", "warning") } else {
          addToast("Error Occurred! Please Try Again", "error");
        }
        onLoadClose();
        return;
      }
      onLoadClose();
      if (data.user) {
        addToast("Login successful", "success");
        const userData = { email: data.user.EmailID, name: data.user.username };
        onLogin(userData);
        onClose();
      } else {
        addToast("Invalid response from server", "warning");
      }
    } catch (error) {
      onLoadClose();
      addToast("Network error or server down", "error");
      console.error(error);
    }
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: "339051675114-aaha2bnjsut4rat31u31c72rrl916elu.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      
    };
    document.body.appendChild(script);
  }, []);
 
  const handleCredentialResponse = (response) => {

    const user = jwtDecode(response.credential);
    localStorage.setItem('user', JSON.stringify(user));
    const userData = { email: user.email, name: user.name };
    onLogin(userData);
    onClose();
    addToast("Login Successful", "success")
  };
  const handleGoogleLogin = () => {
    try {
      isLoading();
      window.google.accounts.id.cancel();

      window.google.accounts.id.prompt();
      onLoadClose()
    }
    catch (err) {
      throw err;
    }
  }
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData={email:user.email,name:user.displayName};
      onLogin(userData);
      onClose();
    } catch (err) {
      console.error("Google sign-in error", err);
    }
  };
  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    try {
      isLoading();
      const response = await fetch("https://back-u7se.onrender.com/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name: username, EmailID: email, pass: password })
      })
      const data = await response.json()
      onLoadClose();
      if (response.status == 201) {
        addToast("Account Created Successfully", "success");
        const userData = { email, username };
        onLogin(userData); onClose()
      }


    }
    catch {
      console.log("Error occured while reaching the endpoint")
    }
  }
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleLogin = () => {
    google.accounts.id.initialize({
      client_id: "339051675114-aaha2bnjsut4rat31u31c72rrl916elu.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.prompt();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div id='g-btn'
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-[80%] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full  sm:p-6">
        <div>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create an account'}
            </h3>
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="space-y-4" onSubmit={isLogin ? handleLoginSubmit : handleSignUpSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full rounded-md h-12 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md h-12 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md h-12 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {isLogin &&
              <div className='flex flex-row-reverse pr-4 cursor-pointer hover:text-blue-600'>
                <a onClick={setForgotPass}>Forgot Password ?</a>
              </div>
            }
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </span>
          </div>

          <div className="mt-4">
            <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400" onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
            <button className="w-full flex justify-center py-2 px-4 mt-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
              Sign in with Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin, isSignUpOpen, setForgotPass, isLoading, onLoadClose }) => {
  return (
    <ToastProvider>
      <LoginModalAuto isOpen={isOpen} onClose={onClose} isSignUpOpen={isSignUpOpen} setForgotPass={setForgotPass} onLogin={onLogin} isLoading={isLoading} onLoadClose={onLoadClose} />
    </ToastProvider>
  )
}
export default LoginModal;