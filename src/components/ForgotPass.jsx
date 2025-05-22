import { em } from "framer-motion/client";
import { useEffect, useRef, useState } from "react";

const ForgotPassword = ({ isForgotOpen, onForgotClose }) => {
  const containerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState(false);
  const [values, setValues] = useState(Array(6).fill(""));
  const [passInput,setPassInput]=useState(false);
  const [password,setPassword]=useState("");
  useEffect(() => {
    if (!isForgotOpen) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onForgotClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isForgotOpen, onForgotClose]);
  
  const inputsRef = useRef([]);

  const handleInput = (e, index) => {
    const val = e.target.value;
    if (val !== "" && isNaN(val)) {
      return;
    }
    const newValues = [...values];
    newValues[index] = val.slice(-1);
    setValues(newValues);
    if (val !== "") {
      const nextInput = inputsRef.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");
    
    const newValues = [...values];
    digits.forEach((digit, i) => {
      if (i < 6) newValues[i] = digit;
    });
    setValues(newValues);

    if (digits.length < 6) {
      inputsRef.current[digits.length].focus();
    } else {
      inputsRef.current[5].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    const key = e.key;
    
    if (key === "Backspace" || key === "Delete") {
      if (values[index] === "") {
        const prevInput = inputsRef.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          if (key === "Backspace") {
            const newValues = [...values];
            newValues[index - 1] = "";
            setValues(newValues);
          }
        }
      } else {
        const newValues = [...values];
        newValues[index] = "";
        setValues(newValues);
      }
    } else if (key === "ArrowLeft") {
      const prevInput = inputsRef.current[index - 1];
      if (prevInput) prevInput.focus();
    } else if (key === "ArrowRight") {
      const nextInput = inputsRef.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };
  const verifyOTP=async()=>{
     try{
      const otpAsInteger = parseInt(values.join(""), 10);
      const response=await fetch('https://back-u7se.onrender.com/otp-verify',{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({EmailID:email, otp:otpAsInteger})
      })
      const data=response.json();
      console.log(data)
      console.log(response.status)
      if(response.status==200){
        setPassInput(true);
      }
     }catch(err){

     }
  }
  const sendOtp = async () => {

    const response = await fetch("https://back-u7se.onrender.com/forgotpassword", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ EmailID: email })
    })
    const data = response.json()
    if (response.status === 200) {
      setOtpInput(true);
    }
    console.log(data)
  }
  if (!isForgotOpen) return null;

  return (
    <div className="forgot-main flex w-full h-full justify-center items-center bg-gray-100 py-12">
  {!otpInput && (
    <div
      ref={containerRef}
      className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Reset Password</h1>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onForgotClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-8">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input 
            type="email" 
            id="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email"
          />
        </div>
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
          onClick={sendOtp}
        >
          Send Verification Code
        </button>
      </div>
    </div>
  )}
  
  {otpInput && (
    <div 
      ref={containerRef}
      className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Verification Code</h1>
        
        <p className="text-gray-600 mb-6">
          Please enter the 6-digit code sent to your email
        </p>
        
        <div 
          id="inputs" 
          className="flex justify-between mb-8" 
          onPaste={handlePaste}
        >
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={values[index]}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ))}
        </div>
        
        <div className="flex space-x-4">
          <button 
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" 
            onClick={onForgotClose}
          >
            Cancel
          </button>
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={verifyOTP}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default ForgotPassword;
