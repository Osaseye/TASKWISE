import React from 'react';

const Header = () => {
  return (
    <header className="pt-6 px-6 pb-4 md:px-8 flex flex-col gap-4 shrink-0 z-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Good Morning, Alex</h2>
          <p className="text-text-secondary text-sm">You have 5 tasks pending today. Stay focused.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-[#293738] hover:bg-[#3d5152] flex items-center justify-center text-white transition-colors relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-primary border border-[#293738]"></span>
          </button>
        </div>
      </div>
      {/* NLP Input */}
      <div className="w-full max-w-3xl mx-auto relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-blue/20 to-primary/20 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
        <div className="relative bg-[#1c2a2b] border border-[#3d5152] rounded-xl flex items-center shadow-lg focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <div className="pl-4 text-primary animate-pulse">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <input className="w-full bg-transparent border-none text-white placeholder-text-secondary/70 px-4 py-3 focus:ring-0 text-sm md:text-base font-light outline-none" placeholder="What would you like to achieve today? Type 'Meeting with team at 2pm'..." type="text" />
          <div className="pr-2">
            <button className="bg-[#293738] hover:bg-primary hover:text-[#111717] text-white p-1.5 rounded-lg transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
