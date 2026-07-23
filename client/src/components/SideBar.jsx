import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { RiLogoutCircleLine } from "react-icons/ri";
import { BASEURL } from "../main";

import { setSelectedUser, setUserData, setOnlineUsers, setLogout } from "../store/userSlice";

export default function Sidebar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

  
    const { userData, selectedUser, otherUsers, onlineUsers,  } = useSelector((state) => state.user);

  async function handleLogout() {
        try {
          
        await axios.post(`${BASEURL}/api/auth/logout-user` , {}, { withCredentials: true });
        } catch (error) {
            console.error("Logout exception cleared:", error);
        } finally {
            dispatch(setLogout())
           navigate("/auth", { replace: true });
        }
    };

    return (
        <div className={`
            ${!selectedUser ? "w-full block" : "hidden"} 
            lg:block lg:w-[32%] xl:w-[28%] h-full bg-white border-r border-[#e3e7eb] flex flex-col shrink-0 relative
        `}>
            
            {/* ====== HEADER ====== */}


<header className="bg-linear-to-br from-sky-600 to-sky-700 text-white p-7 rounded-b-2xl shadow-md flex flex-col gap-4 shrink-0">
    <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-wide">
            Wasssup{" "}
            <span className="text-base font-medium text-white  truncate max-w-56 inline-block align-middle">
                {userData?.name || "Guest"} 
            </span>
        </h1>

        <div className="relative group shrink-0">
            <button
                onClick={() => navigate("/profile")}
                className="w-14 h-14 rounded-full p-0.5 bg-white/20 hover:bg-white/35 shadow-md overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
            >
                <img
                    src={userData?.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userData?.name || "Rohith"}`}
                    alt="Your Profile"
                    className="w-full h-full rounded-full object-cover bg-white cursor-pointer  "
                />
            </button>

            <div className="absolute top-full right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="ml-auto mr-4 h-2 w-2 rotate-45 bg-slate-900 -mb-1"></div>
                <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap">
                    Go to Profile 😎
                </div>
            </div>
        </div>
    </div>
</header>

  {/* ====== DIRECTORY CONTENT ====== */}
  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 bg-[#f8fafc]">
      
      {/* ONLINE COMPANIONS */}
      <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
         Active Companions
     </h2>
     
     <div className="flex items-center gap-4 overflow-x-auto py-2 px-1 no-scrollbar">
         {otherUsers && otherUsers
             .filter(user => onlineUsers?.includes(user._id))
             .map((user) => {
                 const dicebearPic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`;
                 return (
            <div 
                key={`online-${user._id}`}
                onClick={() => dispatch(setSelectedUser(user))}
                className="flex flex-col items-center group cursor-pointer shrink-0" 
                     >
             <div className="w-14 h-14 relative rounded-full p-0.5 border-2 border-[#10b981] group-hover:scale-105 transition-transform duration-200">
                 <img 
                     src={user?.profilePicture || dicebearPic} 
                     alt="Online Profile" 
                     className="h-full w-full object-cover rounded-full bg-white shadow-sm" 
                 />
                 <span className="h-3.5 w-3.5 bg-[#10b981] border-2 border-white rounded-full absolute bottom-0 right-0 shadow-md"></span>
             </div>

            <span className="text-xs font-medium text-slate-600 mt-1.5 max-w-16 truncate">
                {user.name}
                        </span>
                    </div>
                    );
                })
            }

            {(!otherUsers || otherUsers.filter(user => onlineUsers?.includes(user._id)).length === 0) && (
                <p className="text-xs italic text-slate-400 py-1 px-1">Others will come online wait.</p>
            )}
        </div>
    </div>

    {/* all user row */}
    <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
            All Users inside the app
        </h2>
                
        {!otherUsers ? (
            <p className="text-sm text-slate-400 italic px-1 animate-pulse">Loading all your contacts...</p>
        ) : (
            <div className="space-y-1.5">
                {otherUsers.map((user) => {
       const isUserOnline = onlineUsers?.includes(user._id);
       const isSelected = selectedUser?._id === user._id;
       const contactDicebear = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`;

       return (
           <div 
               key={`all-${user._id}`} 
               onClick={() => dispatch(setSelectedUser(user))}
               className={`
                   w-full p-3 flex items-center gap-3.5 cursor-pointer rounded-xl transition-all duration-200 group border
                   ${isSelected 
                       ? "bg-[#e0f2fe] border-[#bae6fd] shadow-sm" 
                       : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200 shadow-sm"
                   }
               `}
              >
                  <div className="h-12 w-12 rounded-full relative overflow-visible shrink-0">
                      <img 
                          src={user?.profilePicture || contactDicebear} 
                          alt="User Profile" 
                          className="h-full w-full object-cover rounded-full bg-slate-100 border border-slate-200 shadow-sm" 
                     />
                     {isUserOnline && (
                         <span className="h-3 w-3 bg-[#10b981] border-2 border-white rounded-full absolute bottom-0 right-0 shadow-sm"></span>
                     )}
                 </div> 
                 
                  <div className="flex-1 min-w-0">
                     <h3 className={`text-sm font-semibold truncate ${isSelected ? "text-[#0369a1]" : "text-slate-800"}`}>
                         {user?.name}
                     </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate font-normal">                    {isUserOnline ? "👋 Online" : "Click to open chat thread"}
               </p>
                 </div>
             </div>   
         );
     })}
 </div>
                    )}
                </div>
            </div>

            {/*  footer */}
<footer className="bg-white border-t border-slate-100 p-4 shrink-0">
    <div className="relative inline-block group">
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:scale-95"
        >
            <RiLogoutCircleLine className="h-5 w-5 cursor-pointer " />
            <span>Log Out</span>
        </button>

        <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
            <div className="ml-5 h-2 w-2 rotate-45 bg-slate-900 -mb-1"></div>
            <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap">
                Sad to see you go 😔
            </div>
        </div>
    </div>
</footer>
        </div>
    );
}




/**
 * 
 * 
 * 
before selecting the user in laptop view right side , show this two

import { TbBrandWhatsappFilled } from "react-icons/tb";

Your keyboard is ready. Your emojis are waiting. This screen is getting awkward... Choose a chat from the left and let the conversation begin. 💚

once it is selcted you can show the chat screen 



 */