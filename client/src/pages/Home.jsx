import React from 'react';
import SideBar from '../components/SideBar';
import MessageTab from '../components/MessageTab'

export default function Home() {
    

    return (
        <div className="w-full h-screen flex overflow-hidden bg-[#f4f7f9] text-[#1e293b] font-sans antialiased">
            {/* Left Column Layout side frame,full in mobile */}
            <SideBar />
            
            {/* Right Column Layout side frame, full in mobile */}
            <MessageTab />
        </div>
    );
}



