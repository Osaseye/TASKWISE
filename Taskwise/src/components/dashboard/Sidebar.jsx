import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 h-full flex flex-col border-r border-[#293738] bg-[#111717] hidden md:flex shrink-0 z-20">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background-dark font-black text-xl">T</div>
        <h1 className="text-white text-lg font-bold tracking-tight">TASKWISE</h1>
      </div>
      <div className="px-3 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            <span className="text-sm font-medium">Calendar</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">view_kanban</span>
            <span className="text-sm font-medium">Projects</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
            <span className="text-sm font-medium">Analytics</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span className="text-sm font-medium">AI Insights</span>
          </a>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">My Projects</p>
            <button className="text-text-secondary hover:text-white transition-colors"><span className="material-symbols-outlined text-[16px]">add</span></button>
          </div>
          <div className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
              <div className="w-2 h-2 rounded-full bg-accent-blue"></div>
              <span className="text-sm font-medium">Website Redesign</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
              <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
              <span className="text-sm font-medium">Q4 Marketing</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">Personal Finance</span>
            </a>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-[#293738]">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-[#111717] font-bold text-sm py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors mb-4 shadow-[0_0_15px_rgba(30,201,210,0.3)]">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          New Project
        </button>
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#293738] cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-primary flex items-center justify-center text-white text-xs font-bold border border-white/10">AL</div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-white text-sm font-medium leading-none truncate">Alex Doe</p>
            <p className="text-text-secondary text-xs truncate mt-1">Pro Plan</p>
          </div>
          <span className="material-symbols-outlined text-text-secondary ml-auto text-[18px]">settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
