import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASEURL } from "../main";
import { setUserData } from "../store/userSlice"; 
import { 
    IoArrowBackOutline, 
    IoCameraOutline, 
    IoMailOutline, 
    IoSparklesOutline 
} from "react-icons/io5";


export default function Profile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { userData } = useSelector((state) => state.user);

    const [formdata, setFormData] = useState({
        image: null,
        bio: userData?.bio || ''
    });

    const [preview, setPreview] = useState(
        userData?.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userData?.name || 'default'}`
    );
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Synchronize local form state when Redux user data hydrates or changes
    useEffect(() => {
        if (!userData) return;

        setFormData(prev => ({ ...prev, bio: userData.bio || '' }));
        setPreview(
            userData.profilePicture ||
            `https://api.dicebear.com/7.x/adventurer/svg?seed=${userData.name || 'default'}`
        );
    }, [userData?._id]);

    // Cleanup blob URLs on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const showToastMessage = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    function handleForm(ev) {
        const { name, value } = ev.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleImage(ev) {
        const file = ev.target.files[0];
        if (!file) return;

        // Revoke existing blob URL if present
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setFormData(prev => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
    }

    async function editProfile(ev) {
        ev.preventDefault();

        const bioChanged = formdata.bio.trim() !== (userData?.bio || '');
        const imageChanged = !!formdata.image;

        if (!bioChanged && !imageChanged) {
            showToastMessage("No changes to save", "error");
            return;
        }

        setSaving(true);

        try {
            const data = new FormData();

            if (bioChanged) {
                data.append('bio', formdata.bio.trim());
            }

            if (imageChanged) {
                data.append('image', formdata.image);
            }

            const response = await axios.patch(
                `${BASEURL}/api/user/edit-profile`,
                data,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            const updatedUser = response.data?.data || response.data?.user;

            if (updatedUser) {
                dispatch(setUserData(updatedUser));
                setFormData(prev => ({ ...prev, image: null })); // Reset image selection state
                showToastMessage("Profile updated successfully!");
            }

        } catch (err) {
            console.error("Profile modification exception:", err);
            const errMsg = err?.response?.data?.message || "Failed to update profile details.";
            showToastMessage(errMsg, "error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0880bc] text-slate-100 antialiased relative overflow-hidden">
            {/* Top decorative banner */}
            <div className="absolute top-0 left-0 w-full h-48 bg-linear-to-b from-sky-900 to-sky-950 -z-10 border-b border-sky-800/40" />

            {/* TOAST NOTIFICATION CONTAINER */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-sm font-semibold transition-all duration-300 transform translate-y-0 ${
                    toast.type === "success" 
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800/60 shadow-emerald-950/50" 
                        : "bg-rose-950 text-rose-400 border-rose-800/60 shadow-rose-950/50"
                }`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <header className="w-full max-w-4xl mx-auto px-4 pt-6 flex items-center justify-between z-10">
                <button 
                    onClick={() => navigate('/')} 
                    className="p-2.5 rounded-xl bg-sky-900/60 text-sky-400 border border-sky-800/50 hover:bg-sky-800 hover:text-white transition-all active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-md"
                    title="Back to home"
                >
                    <IoArrowBackOutline className="w-6 h-6" />
                </button>
            </header>

            {/* Main Profile Layout */}
            <main className="w-full max-w-2xl mx-auto px-4 mt-12 flex-1 flex flex-col items-center z-10">
                
                {/* Avatar with Camera Trigger */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-linear-to-tr from-sky-500 to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500" />
                    <div className="relative w-36 h-36 rounded-full p-1 bg-linear-to-b from-sky-400 to-sky-900 shadow-2xl">
                        <img 
                            src={preview} 
                            alt="Profile avatar" 
                            className="w-full h-full object-cover rounded-full bg-slate-900"
                        />
                        
                        <label
                            htmlFor="profileImage"
                            className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-500 shadow-md flex items-center justify-center cursor-pointer text-white border border-sky-400/30 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <IoCameraOutline className="text-lg" />
                        </label>
                        <input 
                            type="file" 
                            id="profileImage"
                            hidden 
                            accept="image/*"
                            onChange={handleImage}
                        />
                    </div>
                </div>

                {/* Name & Email Block */}
                <h1 className="text-3xl font-bold text-white mt-6 tracking-tight text-center">
                    {userData?.name || "Handsome guy"}
                </h1>
                
                <div className="flex items-center gap-2 mt-2 text-slate-400 font-medium text-sm bg-sky-950/80 px-3 py-1.5 rounded-lg border border-sky-900 shadow-inner">
                    <IoMailOutline className="w-4 h-4 text-sky-400" />
                    <span>{userData?.email || "Account Profile Options"}</span>
                </div>

                {/* Form */}
                <form className="w-full mt-10 space-y-4" onSubmit={editProfile}>
                    <div className="w-full bg-sky-900/30 border border-sky-800/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm uppercase tracking-wider">
                            <IoSparklesOutline className="w-4 h-4" />
                            <span>Edit Description / Bio</span>
                        </div>
                        <textarea
                            rows={3} 
                            name="bio"
                            value={formdata.bio} 
                            onChange={handleForm}
                            placeholder="Tell the community about yourself..."
                            className="w-full bg-sky-950/50 border border-sky-900/60 rounded-xl px-4 py-3 resize-none outline-none focus:border-sky-500 text-sm text-slate-200 placeholder-slate-500 transition-all shadow-inner focus:ring-2 focus:ring-sky-900"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={saving}
                        className="w-full bg-sky-400 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 font-semibold py-4 rounded-xl shadow-lg shadow-sky-600/10 active:scale-[0.99] transition-all text-sm tracking-wide outline-none border border-sky-500/20"
                    >
                        {saving ? 'Saving changes securely...' : 'Save Profile Changes'}
                    </button>
                </form>
            </main>
        </div>
    );
}