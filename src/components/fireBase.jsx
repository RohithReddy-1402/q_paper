import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARx2FaU3G5MqMVViOCqvdoYhYhRIqcqMQ",
  authDomain: "project-x-64686.firebaseapp.com",
  projectId: "project-x-64686",
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
