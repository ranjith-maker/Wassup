import React from "react";
import { useSelector } from "react-redux";



export default function SenderMessage({ message, image }) {
    // Grab the current logged-in user's profile picture for the sender avatar
    const { userData } = useSelector(state => state.user); 

    // Dynamic avatar fallback
    const avatarUrl = userData?.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userData?.name || 'default'}`;

    return (
        <div className="w-full flex justify-end items-end gap-2.5 mb-2 animate-in fade-in slide-in-from-bottom-1 duration-150">
            
            {/* 1. Message Bubble Block */}
            <div className="relative max-w-[70%] lg:max-w-[55%] px-4 py-2.5 bg-sky-600 text-white rounded-2xl rounded-br-none shadow-sm min-w-15">
                
                {/* Optional Username header text */}
                <h1 className="text-xs text-sky-200/90 lowercase font-medium mb-1">
                    {userData?.name || "you"}
                </h1>

                {/* Cloudinary uploaded image attachment display */}
                {image && (
                    <div className={`rounded-xl overflow-hidden max-w-full my-1 ${message ? "mb-2" : ""}`}>
                        <img 
                            src={image} 
                            alt="Sent attachment" 
                            className="w-full max-h-50 object-cover rounded-xl"
                            loading="lazy"
                        />
                    </div>
                )}

                {message && (
                    <p className="text-sm md:text-base leading-relaxed wrap-break-word whitespace-pre-wrap font-medium">
                        {message}
                    </p>
                )}

                {/* Tail bubble styling alignment element */}
                <div className="absolute bottom-0 -right-1 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-sky-600" />
            </div>

            {/* 2. Small Round Sender Avatar (Aligned perfectly side-by-side on same line) */}
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-sky-500/30 shrink-0 bg-sky-900">
                <img 
                    src={avatarUrl} 
                    alt="My avatar" 
                    className="w-full h-full object-cover"
                />
            </div>
            
        </div>
    );
}







