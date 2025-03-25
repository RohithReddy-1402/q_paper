import React, { useState, useEffect } from 'react';
import QuestionPapersInterface from './components/QuestionPaper';
import LoginModal from './components/Login';

function App() {
const [isLoginModalOpen, setLoginModalOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);
useEffect(() => {
console.log("Updated State -> isLoggedIn:", isLoggedIn);
console.log("Updated User ->", user)       ;
}, [isLoggedIn, user]); 

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

return (
<div>
<QuestionPapersInterface 
isLoggedIn={isLoggedIn}
user={user}
onLoginClick={() => setLoginModalOpen(true)}
onLogout={handleLogout}
/>
<LoginModal 
isOpen={isLoginModalOpen} 
onClose={() => setLoginModalOpen(false)}
onLogin={handleLogin}
/>
</div>
);
}

export default App;
