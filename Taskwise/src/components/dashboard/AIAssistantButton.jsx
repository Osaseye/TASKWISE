import React from 'react';
import { BsStars } from 'react-icons/bs';

const AIAssistantButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1ec9d2] to-[#169ea5] rounded-full shadow-[0_4px_20px_rgba(30,201,210,0.4)] hover:shadow-[0_4px_30px_rgba(30,201,210,0.6)] hover:-translate-y-1 transition-all duration-300">
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        <BsStars className="text-white text-[24px] animate-pulse" />
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#293738] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
          Ask AI Assistant
        </div>
      </button>
    </div>
  );
};

export default AIAssistantButton;
