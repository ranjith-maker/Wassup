
import React, { useState,useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import {BASEURL} from '../main'

import { BiImageAdd } from "react-icons/bi";
import { IoArrowBackOutline } from 'react-icons/io5';
import { IoMdPhotos } from 'react-icons/io';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { TbSend2 } from 'react-icons/tb';
import { TbBrandWhatsappFilled } from "react-icons/tb";
import { SlClose } from "react-icons/sl";
import { LuSend } from "react-icons/lu";
import ChatTheme from '../assets/chatTheme.avif'


import {setMessages, appendSentMessage } from '../store/chatSlice'; // Matches your flat messages slice path
import { setSelectedUser } from '../store/userSlice';   // Matches your user state path
import { clearMessages } from '../store/chatSlice';
import { useNavigate } from 'react-router-dom';






export default function MessageTab() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    // 1. Pull current profile context elements from global slices
    const { userData, selectedUser,onlineUsers } = useSelector((state) => state.user);
   const EMPTY_MESSAGES = [];
    const messages = useSelector(
        (state) => state.chat.conversations[selectedUser?._id] ?? EMPTY_MESSAGES
);


    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const emojiContainerRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 2. Fetch Chat logs automatically whenever active target changes
    useEffect(() => {
        if (!selectedUser?._id) {
            dispatch(clearMessages());
            return;
        }

async function fetchMessageLogs(){
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${BASEURL}/api/chat/get-message/${selectedUser._id}`, 
                    { withCredentials: true }
                );
                if (response.data?.success) {
                    dispatch(setMessages({
                       userId: selectedUser._id,
                       messages: response.data.data
                    }));
                }

            } catch (err) {
                console.error("Failed fetching chat records:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessageLogs();
    }, [selectedUser?._id, dispatch]);

    // 3. Keep standard container track synchronized to base line view
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 4. Click outside handler to dismiss picker modal frame
    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiContainerRef.current && !emojiContainerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


function handleImageChange(ev) {
        const file = ev.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

function handleClearImage(){
    setSelectedImage(null);

    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    }
};

    const handleEmojiClick = (em) => {
        setInputText((prev) => prev + em.emoji);
    };

    const canSend = inputText.trim().length > 0 || selectedImage !== null;

    // 5. Submit Message Node Handler over multipart form boundaries
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!canSend) return;

        try {
            const formData = new FormData();
            formData.append("receiverId", selectedUser._id);
            formData.append("content", inputText.trim());
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            // Clear inputs early for responsive UI state feel
            setInputText("");
            handleClearImage();
            setShowEmojiPicker(false);

            const response = await axios.post(
                "http://localhost:4000/api/chat/send-message", 
                formData, 
                { 
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true 
                }
            );

            if (response.data?.success) {
                // Dispatch backend populated JSON response payload object directly into Redux
                dispatch(appendSentMessage(response.data.data));
            }
        } catch (err) {
            console.error("Transmission exception layer dropped message:", err);
        }
    };

const isOnline = onlineUsers.includes(selectedUser?._id);

    // Empty Laptop view
    if (!selectedUser) {
        return (
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-[#f8fafc] text-center px-6 relative select-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-sky-400 to-teal-400" />
                <div className="max-w-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100 mb-6 group transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <TbBrandWhatsappFilled className="w-14 h-14 text-sky-500 transition-transform group-hover:rotate-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-3">
                        This screen is getting awkward... 
                    </h3>
                    <p className="text-black text-lg leading-relaxed max-w-90">
                        Choose a chat from the left and let the conversation begin bro...... <span className="inline-block text-sky-500 font-bold ml-0.5" >  🩵    </span>
                    </p>
                </div>
            </div>
        );
    }

    // ====== CASE B: WORKSPACE INTERACTIVE CHAT PORTAL ENGINE ======


return (
    <div className={`
        ${selectedUser ? "w-full flex" : "hidden"} 
        lg:flex flex-1 flex-col h-full bg-sky-100 relative overflow-hidden
    `}>
        
        {/* WHATSAPP-STYLE BACKGROUND WALLPAPER LAYER */}
        {ChatTheme && (
            <div 
                className="absolute inset-0 w-full h-full opacity-40 pointer-events-none bg-repeat z-0"
                style={{ 
                    backgroundImage: `url(${ChatTheme})`,
                    backgroundSize: 'auto', // Keeps the pattern from scaling up blurrily
                }} 
            />
        )}
        
        {/* HEADER */}
        <header className="h-20 w-full bg-white border-b border-[#e2e8f0] px-4 lg:px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-3 min-w-0">
                <button 
                    onClick={() => dispatch(setSelectedUser(null))}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors outline-none shrink-0"
                >
                    <IoArrowBackOutline className="w-6 h-6" />
                </button>

                <div className="w-11 h-11 rounded-full relative overflow-visible shrink-0">
                    <img 
                        src={selectedUser.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedUser.name}`} 
                        alt={selectedUser.name} 
                        className="w-full h-full object-cover rounded-full border border-slate-200 cursor-pointer"
                        onClick={() => navigate(`/profiledetails/${selectedUser._id}`)}
                    />
                    {isOnline && <span className="h-3 w-3 bg-[#10b981] border-2 border-white rounded-full absolute bottom-0 right-0 shadow-sm" />}
                </div>
                
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{selectedUser.name}</h3>
                    <p className="text-xs text-slate-400 font-medium truncate">{isOnline ? 'online' : 'offline'}</p>
                </div>
            </div>
        </header>

        {/* MESSAGE CONTAINER */}
        {/* Note: added z-10 and relative so messages display safely above the wallpaper layer */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 scrollbar-thin relative z-10">
            {isLoading ? (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm font-medium">
                    Loading your convo with {selectedUser?.name}
                </div>
            ) : (
                <>
                    <div className="text-center my-2">
                        <span className="text-[11px] font-bold px-3 py-1 bg-white/80 text-slate-500 rounded-full border border-slate-200/50 shadow-sm tracking-wider uppercase backdrop-blur-sm">
                            Secure Inbox
                        </span>
                    </div>

                    {/* Render actual messages */}
                    {messages.map((msg) => {
                        const msgSenderId = msg.sender?._id || msg.sender;
                        const isSender = msgSenderId?.toString() === userData?._id?.toString();
                        return isSender ? (
                            <SenderMessage
                                key={msg._id} 
                                message={msg.content} 
                                image={msg.imageUrl} 
                            />
                        ) : (
                            <ReceiverMessage 
                                key={msg._id} 
                                message={msg.content} 
                                image={msg.imageUrl} 
                            />
                        );
                    })}
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>

        {/* DOCK FOOTER COMPOSER */}
        <footer className="p-3 lg:p-4 bg-white border-t border-[#e2e8f0] relative shrink-0 z-10">
            {imagePreview && (
                <div className="absolute bottom-full left-4 mb-3 p-2 bg-sky-50 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 z-40">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 relative">
                        <img src={imagePreview} alt="Local file link preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                        type="button"
                        onClick={handleClearImage}
                        className="p-1.5 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors self-start outline-none"
                    >
                        <SlClose className="w-4 h-4 stroke-[2.5px]" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2 lg:gap-3 relative">
                <div className="flex items-center gap-0.5 lg:gap-1 shrink-0">
                    <div ref={emojiContainerRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer outline-none ${showEmojiPicker ? "bg-sky-50 text-sky-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                        >
                            <RiEmojiStickerLine className="w-5 h-5" />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-3 z-50 shadow-2xl border border-slate-200 rounded-2xl overflow-hidden max-w-[90vw]">
                                <EmojiPicker 
                                    onEmojiClick={handleEmojiClick}
                                    theme="light"
                                    width={290}
                                    height={360}
                                />
                            </div>
                        )}
                    </div>

                    <label htmlFor="gallery" className={`p-2.5 rounded-xl cursor-pointer transition-all outline-none text-slate-400 hover:text-slate-600 hover:bg-slate-50 ${selectedImage ? "bg-emerald-50 text-emerald-600" : ""}`}>
                        <input
                            type="file" 
                            id='gallery'
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <BiImageAdd className="w-5.5 h-5.5" />
                    </label>
                </div>

                <div className="flex-1">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={`Message ${selectedUser.name}...`}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl transition-all outline-none text-sm text-slate-800 shadow-inner"
                    />
                </div>

                <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                    {canSend && (
                        <button
                            type="submit"
                            className="w-full h-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-sky-600/20 active:scale-95 transition-all outline-none"
                        >
                            <LuSend className="w-4.5 h-4.5 stroke-[2.5px]" />
                        </button>
                    )}
                </div>
            </form>
        </footer>
    </div>
);


}

