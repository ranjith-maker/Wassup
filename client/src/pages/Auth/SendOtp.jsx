import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TbBrandWhatsappFilled } from "react-icons/tb";
import axios from "axios";
import { BASEURL } from "../../main";
import { RiWhatsappLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/userSlice";



export default function SendOtp() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

  const handleSendOtp = async (ev) => {
        ev.preventDefault();
        if (!email.trim()) {
            setError("Email address is required.");
            return;
        }

        setError("");
        setLoading(true);

        try {
        
            const response = await axios.post(`${BASEURL}/api/auth/send-otp`, 
            {
                email: email.trim().toLowerCase(),
                name: name.trim() || undefined // pass name if user filled it out
            });

            if (response.data.success) {
                // Passing both email and name forward in router state history for step-2
                navigate("/verify-otp", { 
                    state: { 
                        email: email.trim().toLowerCase(),
                        name: name.trim()
                    } 
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-800 relative px-4">
           {/* Elegant Top Horizon Header bar */}
           <div className="absolute top-0 left-0 w-full h-1/3 bg-sky-700 -z-10 border-b border-sky-800" />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-sky-100/30">
               <div className="flex flex-col items-center mb-8">
                      
            <div className="w-20 h-20 bg-sky-700 rounded-full flex items-center justify-center mb-5 shadow-2xl shadow-sky-100 border border-sky-200">
                      <RiWhatsappLine 
                                   size={42} 
                       className="text-white"
                       />
                   </div>
                    <h2 className="text-2xl font-bold text-sky-700"> Say Hai to Wassup </h2>
                   <p className="text-slate-500 text-sm font-bold mt-2 text-center">
                         Enter Valid email to get OTP
                   </p>
                </div>
               {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
                       {error}
                   </div>
               )}

              <form onSubmit={handleSendOtp} className="space-y-5">
                    {/* Full Name Input (Optional if user already exists, mandatory if new) */}
                  <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                           Full Name <span className="text-slate-400 font-semibold ">(Only required for new users)</span>
                        </label>
                        <input
                           type="text"
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                           placeholder="Sarah"
                            minLength={3} 
                          maxLength={20}
                            className="w-full px-4 py-3 text-slate-800 bg-slate-50 border text-center border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-sky-100 transition-all outline-none text-lg"
                      />
                 </div>
                    {/* Email Input */}
                <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                     <input
                         type="email"
                            value={email}
                         onChange={(ev) => setEmail(ev.target.value)}
                         placeholder="Enter Verified email" 
                            required                        
                         className="w-full px-4 py-3 text-slate-800 bg-slate-50 border text-center border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl focus:ring-4 focus:ring-sky-100 transition-all outline-none text-lg"
                        />
                    </div>
                 <button
                        type="submit"
                     disabled={loading || !email.trim()}
                        className={`w-full py-3.5 rounded-xl text-white font-semibold tracking-wide transition-all mt-2 ${
                         loading || !email.trim()
                                ? "bg-slate-300 cursor-not-allowed"
                               : "bg-sky-600 hover:bg-sky-700 active:scale-[0.98] shadow-md shadow-sky-600/20"
                        }`}
                  >
                     {loading ? "Sending OTP..." : "Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}

