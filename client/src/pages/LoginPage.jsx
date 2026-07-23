import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../store/userSlice";
import { BASEURL } from "../main";
import { RiWhatsappLine } from "react-icons/ri";
// import { HiEye } from "react-icons/hi2";
// import { RiEyeCloseFill } from "react-icons/ri";



export default function LoginPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    //taking from step-1
    const email = location.state?.email || "";
    const name = location.state?.name || "";

    const otpDigits = 6;
    const [otp, setOtp] = useState(new Array(otpDigits).fill(''));

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            navigate("/auth", { replace: true });
            //focus on otp input
        } else if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [email, navigate]);


function handleChange(index, value) {
        // Only allow numerical digits
        const cleanValue = value.replace(/[^0-9]/g, "");
        if (!cleanValue) return;

        const newOtp = [...otp];
        // only last digit 
        newOtp[index] = cleanValue.slice(-1);
        setOtp(newOtp);

        // input focus here
        if (index < otpDigits - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

function handleKeyDown(index, ev) {
        const newOtp = [...otp];

        if (ev.key === 'Backspace') {
            ev.preventDefault(); // overriding native browsers so that React can manage handle
            
            if (otp[index]) {
                // If box has a value, clear it stay focus there
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                // If box is already empty, clear the previous box, move focus left
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }

        // Arrow controls here
        if (ev.key === 'ArrowRight' && index < otpDigits - 1) {
            ev.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }

        if (ev.key === 'ArrowLeft' && index > 0) {
            ev.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
    }

function handlePaste(ev) {
        ev.preventDefault();
        
        // Grab string and filter out any non-numeric content
        const pastedText = ev.clipboardData.getData('text').replace(/[^0-9]/g, "");
        const cleanData = pastedText.slice(0, otpDigits);
        
        if (!cleanData) return;

        const newOtp = [...otp];
        cleanData.split('').forEach((digit, index) => {
            if (index < otpDigits) {
                newOtp[index] = digit;
            }
        });

        setOtp(newOtp);

        // Move focus to last box
        const lastIndex = Math.min(cleanData.length, otpDigits - 1);
        inputRefs.current[lastIndex]?.focus();
    }


async function handleVerify(ev) {
        ev.preventDefault();
        const finalOtp = otp.join("");
        if (finalOtp.length < otpDigits) return;

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${BASEURL}/api/auth/login-user`, 
                { 
                    email, 
                    otp: finalOtp, 
                    name: name || undefined 
                }, 
                { withCredentials: true }
            );

            if (response.data.success) {
                setSuccessMsg("Logged in smoothly!");
                dispatch(setUserData(response.data.data));
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP code. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (

<div className="min-h-screen relative flex items-center justify-center bg-sky-700 px-4">
     <div className="absolute top-0 left-0 w-full h-1/3 bg-sky-800 -z-10 border-b border-sky-800" />

    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-sky-100/30">
     <div className="flex flex-col items-center mb-8">
             
             
        <div className="w-20 h-20 bg-sky-700 rounded-full flex items-center justify-center mb-5 border border-sky-100 shadow-lg">
            <RiWhatsappLine  size={42}  className="text-white" />
         </div>
         
         <h2 className="text-2xl font-bold text-slate-900">Verification Code</h2>
         <p className="text-slate-500 text-sm mt-2 text-center">
             Sent to <span className="font-semibold text-sky-600">{email} ,{" "} check Inbox</span>
         </p>
         </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
         {successMsg && <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm text-center">{successMsg}</div>}

     <form onSubmit={handleVerify} className="space-y-6">
         <div className="flex justify-between gap-2">
             {otp.map((digit, index) => (
                 <input
                    key={index}
                     type="text" minLength={1}
                     inputMode="numeric"
                     ref={(el) => (inputRefs.current[index] = el)}
                     value={digit}
                     onChange={(ev) => handleChange(index, ev.target.value)}
                     onKeyDown={(ev) => handleKeyDown(index, ev)}
                     onPaste={handlePaste}
                     className=" w-10 sm:w-12 h-12 sm:h-14 text-center text-xl font-bold text-slate-800 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-sky-100 transition-all 
                     outline-none" />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.some(d => !d)}
                        className={`w-full py-3.5 rounded-xl text-white font-semibold tracking-wide transition-all ${
                            loading || otp.some(d => !d)
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-sky-600 hover:bg-sky-700 active:scale-[0.98]"
                        }`}
                    >
                        {loading ? "Validating Securely..." : "Verify & Connect"}
                    </button>
                </form>
            </div>
        </div>
    );
}
