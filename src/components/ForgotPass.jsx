import { em } from "framer-motion/client";
import { useEffect, useRef, useState } from "react";

const ForgotPassword = ({ isForgotOpen, onForgotClose }) => {
  const containerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState(false);
  const [values, setValues] = useState(Array(6).fill(""));
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
      const response=await fetch('http://localhost:3001/otp-verify',{
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({EmailID:email, otp:otpAsInteger})
      })
      const data=response.json();
      console.log(data)
      console.log(response.status)
     }catch(err){

     }
  }
  const sendOtp = async () => {

    const response = await fetch("http://localhost:3001/forgotpassword", {
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
    <div className="forgot-main">
      <div className="flex w-full h-full justify-center items-center">
        {!otpInput && <div
          ref={containerRef}
          className="forgot-container flex-col md:w-1/4 md:h-3/10 w-9/10 h-4/10 bg-white"
        >
          <div className="flex justify-between">
            <h1 className="pt-4 pl-4 text-2xl ml-2 mt-2">Reset Your Password</h1>
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none mr-4 md:mr-10 mt-6"
              onClick={onForgotClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          </div>
          <div className="ml-6 flex-col ">
            <h1 className="text-xl">Enter your  Mail :</h1>
            <input type="email" className="border-1 mt-4 w-9/10 md:w-3/5 h-full rounded-xl pl-4 pt-0 text-xl" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter the Mail">

            </input>
          </div>
          <div className="ml-4 md:mt-0 mt-8">
            <button className="otp-btn ml-4" onClick={sendOtp}>
              Send Otp
            </button>
          </div>
        </div>}
        {
          otpInput &&
          <div className="forgot-container  md:w-1/4 md:h-3/10 w-9/10 h-4/10 bg-white" ref={containerRef}>
            <div className="container">
              <div className="mt-8 ml-8 md:mb-16  "><h1 className="text-2xl">Enter Your OTP</h1></div>
              <div id="inputs" className="inputs" onPaste={handlePaste}>
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
                    className="w-12 h-14 text-2xl text-center border-2 border-gray-400 rounded focus:outline-none focus:border-black"
                  />
                ))}
              </div>
              <div className="flex mt-8 justify-center">
                <button className="verify-btn border w-24 h-12 rounded-xl" onClick={verifyOTP}>Verify OTP</button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default ForgotPassword;
