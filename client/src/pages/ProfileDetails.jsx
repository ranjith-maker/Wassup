import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoArrowBackOutline, IoMailOutline, IoSparklesOutline } from 'react-icons/io5';
import axios from 'axios';
import { BASEURL } from '../main';
import { setSelectedUser } from '../store/userSlice';



export default function ProfileDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId } = useParams(); 

    const selectedUser = useSelector((state) => state.user?.selectedUser);
    const [loading, setLoading] = useState(false);

    // Fetch user details from DB on refresh if Redux state was wiped out
    useEffect(() => {
        const targetId = userId || selectedUser?._id;

        // If we don't have selectedUser in Redux or the URL ID doesn't match selectedUser
        if (targetId && (!selectedUser || selectedUser._id !== targetId)) {


            const fetchUserProfile = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${BASEURL}/api/user/get-selected-user/${targetId}`, {
                        withCredentials: true
                    });
                    const fetchedUser = response.data?.data || response.data?.user || response.data;
                    if (fetchedUser) {
                        dispatch(setSelectedUser(fetchedUser));
                        // console.log('fetched him');
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile details:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserProfile();
        }
    }, [userId, selectedUser?._id, dispatch]);

    // Active display data
    const user = {
        name: selectedUser?.name || "User",
        profilePicture: selectedUser?.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedUser?.name || 'default'}`,
        bio: selectedUser?.bio || "No bio available.",
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0880bc] text-white font-semibold">
                Loading profile details...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0880bc] text-slate-100 antialiased relative overflow-hidden">
            {/* Top decorative branding banner */}
            <div className="absolute top-0 left-0 w-full h-48 bg-linear-to-b from-sky-700 to-sky-950 -z-10 border-b border-sky-800/40" />

            {/* Navigation Header */}
            <header className="w-full max-w-4xl mx-auto px-4 pt-6 flex items-center justify-between z-10">
                <button 
                    onClick={() => navigate('/')} 
                    className="p-2.5 rounded-xl bg-sky-900/60 text-sky-400 border border-sky-800/50 hover:bg-sky-800 hover:text-white transition-all active:scale-95 flex items-center justify-center shadow-lg backdrop-blur-md"
                    title="Back to home"
                >
                    <IoArrowBackOutline className="w-6 h-6" />
                </button>
                <span className="text-sm font-semibold tracking-wide text-white bg-sky-900/40 px-5 py-2 rounded-full border border-sky-800/30 backdrop-blur-sm">
                    User Profile
                </span>
            </header>

            {/* Profile Main Content */}
            <main className="w-full max-w-2xl mx-auto px-4 mt-12 flex-1 flex flex-col items-center">
                
                {/* Profile Picture Frame */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-linear-to-tr from-sky-500 to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500" />
                    <div className="relative w-36 h-36 rounded-full p-1 bg-linear-to-b from-sky-400 to-sky-900 shadow-2xl">
                        <img 
                            src={user.profilePicture} 
                            alt={user.name} 
                            className="w-full h-full object-cover rounded-full bg-slate-900"
                        />
                    </div>
                </div>

                {/* Identity Presentation */}
                <h1 className="text-3xl font-bold text-white mt-6 tracking-tight text-center">
                    {user.name}
                </h1>

                {/* Profile Cards */}
                <section className="w-full mt-10 space-y-4">
                    
                    {/* Bio Section Card */}
                    <div className="w-full bg-sky-500/30 border border-sky-800/40 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wider">
                            <IoSparklesOutline className="w-4 h-4" />
                            <span>About / Bio</span>
                        </div>
                        <p className="text-slate-100 leading-relaxed text-base font-semibold whitespace-pre-line">
                            {user.bio}
                        </p>
                    </div>

                    {/* Meta Info Card */}
                    <div className="w-full bg-sky-500/30 border border-sky-900/40 rounded-2xl p-4 flex justify-between items-center text-sm text-white shadow-xl font-semibold">
                        <span>Account Status</span>
                        <div className="flex items-center animate-pulse gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-emerald-400 font-bold">Verified Account</span>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}
