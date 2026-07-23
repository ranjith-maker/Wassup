import React from 'react';

export default function ShimmerLoading() {
  // Generate 7 placeholder chat item rows to fill the screen
  
  const skeletonRows = Array.from({ length: 7 });

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200 select-none overflow-hidden animate-pulse">
      
      {/* 1. HEADER SECTION SHIMMER */}
      <header className="h-20 w-full border-b border-slate-100 px-4 lg:px-6 flex items-center justify-between shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-3">
          {/* Circular User Profile Avatar */}
          <div className="w-11 h-11 rounded-full bg-slate-200" />
          
          {/* Double Text Lines (Name & Status) */}
          <div className="space-y-2">
            <div className="h-3.5 w-24 bg-slate-200 rounded-md" />
            <div className="h-2.5 w-32 bg-slate-200 rounded-md" />
          </div>
        </div>
        
        {/* Right Header Action Icons */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="w-8 h-8 rounded-full bg-slate-200" />
        </div>
      </header>

      {/* 2. SEARCH / FILTER BAR CONTAINER */}
      <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-white shrink-0">
        <div className="h-9 flex-1 bg-slate-100 rounded-xl" />
        <div className="h-8 w-8 bg-slate-100 rounded-lg shrink-0" />
      </div>

      {/* 3. SCROLLABLE CHAT THREADS STREAM LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100/60">
        {skeletonRows.map((_, index) => (
          <div 
            key={index} 
            className="w-full flex items-center gap-3 p-3 transition-colors bg-white first:pt-3 pt-4"
          >
            {/* Thread Avatar Node */}
            <div className="w-12 h-12 rounded-full bg-slate-200/80 shrink-0 relative">
              {/* Optional tiny indicator anchor block */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-100 rounded-full border-2 border-white" />
            </div>

            {/* Core Row Identity Data Blocks */}
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex justify-between items-center">
                {/* Contact Name Target Block */}
                <div className="h-3.5 w-28 bg-slate-200/80 rounded-md" />
                
                {/* Meta Timestamp Tracker */}
                <div className="h-2.5 w-10 bg-slate-200/60 rounded-md" />
              </div>

              <div className="flex justify-between items-center">
                {/* Message Excerpt Snippet Segment */}
                <div className="h-3 w-40 sm:w-48 bg-slate-200/60 rounded-md" />
                
                {/* Unread Alert Bubble Frame Marker */}
                <div className="h-4 w-4 rounded-full bg-slate-200/70 shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}