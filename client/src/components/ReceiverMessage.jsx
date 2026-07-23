import React from "react";
import { useSelector } from "react-redux";





export default function ReceiverMessage({ message, image }) {
    // Grab the active chat user context from your Redux store
    const { selectedUser } = useSelector(state => state.user);

    // Dynamic fallback avatar using the selected chat user context properties
    const avatarUrl = selectedUser?.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedUser?.name || 'default'}`;

    return (
        <div className="w-full flex justify-start items-end gap-2.5 mb-2 animate-in fade-in slide-in-from-bottom-1 duration-150">
            
            {/* 1. Small Round Receiver Avatar (Positioned gracefully on the left side) */}
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-slate-200 shrink-0 bg-white">
                <img 
                    src={avatarUrl} 
                    alt={`${selectedUser?.name || 'User'} avatar`} 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 2. Message Bubble Block */}
            <div className="relative max-w-[70%] lg:max-w-[55%] px-4 py-2.5 bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-200/60 shadow-sm min-w-15">
                
                {/* Optional Username header text */}
                <h1 className="text-xs text-slate-400 lowercase font-medium mb-1">
                    {selectedUser?.name || "user"}
                </h1>

                {/* Cloudinary uploaded image display */}
                {image && (
                    <div className={`rounded-xl overflow-hidden max-w-full my-1 ${message ? "mb-2" : ""}`}>
                        <img 
                            src={image} 
                            alt="Received attachment" 
                            className="w-full max-h-72 object-cover rounded-xl"
                            loading="lazy"
                        />
                    </div>
                )}

                {message && (
                    <p className="text-sm md:text-base leading-relaxed wrap-break-word whitespace-pre-wrap font-medium">
                        {message}
                    </p>
                )}

                {/* Left Tail bubble styling element configured safely matching the top-left hook */}
                <div className="absolute top-0 -left-1 w-0 h-0 border-b-8 border-b-transparent border-r-8 border-r-white filter drop-shadow-[-1px_0px_0px_rgba(226,232,240,0.8)]" />
            </div>
            
        </div>
    );
}







