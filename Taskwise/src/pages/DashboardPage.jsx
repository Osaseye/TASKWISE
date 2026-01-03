import React from 'react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased h-screen overflow-hidden flex selection:bg-primary selection:text-background-dark"
    >
      {/* Sidebar */}
      <aside className="w-64 h-full flex flex-col border-r border-[#293738] bg-[#111717] hidden md:flex shrink-0 z-20">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background-dark font-black text-xl">T</div>
          <h1 className="text-white text-lg font-bold tracking-tight">TASKWISE</h1>
        </div>
        <div className="px-3 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span className="text-sm font-medium">Calendar</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">view_kanban</span>
              <span className="text-sm font-medium">Projects</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
              <span className="text-sm font-medium">Analytics</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-[#293738] hover:text-white transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
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
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            New Project
          </button>
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#293738] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-primary flex items-center justify-center text-white text-xs font-bold border border-white/10">AL</div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-sm font-medium leading-none truncate">Alex Doe</p>
              <p className="text-text-secondary text-xs truncate mt-1">Pro Plan</p>
            </div>
            <span className="material-symbols-outlined text-text-secondary ml-auto text-[20px]">settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header & NLP Input */}
        <header className="pt-8 px-6 pb-6 md:px-10 flex flex-col gap-6 shrink-0 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Good Morning, Alex</h2>
              <p className="text-text-secondary text-base">You have 5 tasks pending today. Stay focused.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-[#293738] hover:bg-[#3d5152] flex items-center justify-center text-white transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-primary border border-[#293738]"></span>
              </button>
            </div>
          </div>
          {/* NLP Input */}
          <div className="w-full max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-blue/20 to-primary/20 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-[#1c2a2b] border border-[#3d5152] rounded-xl flex items-center shadow-lg focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
              <div className="pl-4 text-primary animate-pulse">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <input className="w-full bg-transparent border-none text-white placeholder-text-secondary/70 px-4 py-4 focus:ring-0 text-base md:text-lg font-light outline-none" placeholder="What would you like to achieve today? Type 'Meeting with team at 2pm'..." type="text" />
              <div className="pr-2">
                <button className="bg-[#293738] hover:bg-primary hover:text-[#111717] text-white p-2 rounded-lg transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-20">
          {/* Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Stat 1 */}
            <div className="bg-surface-dark border border-[#293738] rounded-xl p-5 flex flex-col justify-between hover:border-[#3d5152] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-[#293738] text-white group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">+12% vs yest</span>
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Daily Completion</p>
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-bold text-white">78%</p>
                  <div className="flex-1 pb-2">
                    <div className="h-1.5 w-full bg-[#293738] rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Stat 2 */}
            <div className="bg-surface-dark border border-[#293738] rounded-xl p-5 flex flex-col justify-between hover:border-[#3d5152] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-[#293738] text-white group-hover:bg-accent-blue/20 group-hover:text-accent-blue transition-colors">
                  <span className="material-symbols-outlined">hourglass_top</span>
                </div>
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Focus Time</p>
                <p className="text-3xl font-bold text-white">4h 12m</p>
              </div>
            </div>
            {/* Stat 3 */}
            <div className="bg-surface-dark border border-[#293738] rounded-xl p-5 flex flex-col justify-between hover:border-[#3d5152] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-[#293738] text-white group-hover:bg-accent-purple/20 group-hover:text-accent-purple transition-colors">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
              </div>
              <div>
                <p className="text-text-secondary text-sm font-medium mb-1">Deep Work Session</p>
                <p className="text-3xl font-bold text-white">4.5 hrs</p>
              </div>
            </div>
          </section>

          {/* Main Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-6">
            {/* Today's Tasks (Takes 2 columns) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Today's Focus
                  <span className="text-xs bg-[#293738] text-white px-2 py-0.5 rounded-full">5</span>
                </h3>
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-[#293738] rounded text-text-secondary hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">sort</span>
                  </button>
                  <button className="p-1.5 hover:bg-[#293738] rounded text-text-secondary hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {/* Task Item 1 */}
                <div className="group flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div className="relative flex items-center justify-center">
                    <input className="peer appearance-none w-6 h-6 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-[#111717] text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-base group-hover:text-primary transition-colors">Review Q3 Financial Reports</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">High Priority</span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        2:00 PM
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-[14px]">folder</span>
                        Finance
                      </span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[#293738] rounded-lg text-text-secondary hover:text-white transition-all">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                {/* Task Item 2 */}
                <div className="group flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div className="relative flex items-center justify-center">
                    <input className="peer appearance-none w-6 h-6 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-[#111717] text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-base group-hover:text-primary transition-colors">Team Sync with Engineering</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-medium text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">Medium</span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        4:30 PM
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-[14px]">folder</span>
                        Product
                      </span>
                    </div>
                  </div>
                  <div className="flex -space-x-2 mr-2">
                    <img alt="User Avatar" className="w-6 h-6 rounded-full border border-[#1c2a2b]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfIdvHwbl4hhrrBhZzKVde--P3sPA7ugwc1f5zU3UOGjEn_mS04Jm25GIJIHafBlHVviPBfO3CUHvnFUgRipxb5TvnZaGMmJC3MYy8mv9wz2sWJAgZ3XJ_ofqOH4TUI_AyTqg_F-SyEnZHCFAfslEUhRzve8F8Gx9a1wioY2j_2RkaaNJLO-jAmiWTw9z6z7z1QWqR7LCAU3MyvpKI-cn290ATuIBU2hlJJXXT_SOpKyeb0nZMxpcxRZKYiFRMk61Z0fGTEY8LGgKJ" />
                    <img alt="User Avatar" className="w-6 h-6 rounded-full border border-[#1c2a2b]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIj9idJTXR0ppo7zzI7renqcYka4OoWXV-N5uK5fDE3S1qVBavCgtC5v8oS7Iee4gQVj-Y_YRKqG1GFRtyCR1oesBMdQnFbKmHEoeFLJC3TeU5QLo_lwavPox4oAE9PFpm6hL7ef-hM7Z43yzWIZjntsXLctueMSqiEaZKtzrNOyURmC9ydOGCYlibhyTADydNRW4Z5uNBjLpz0U9aCCguc6EsSRt1oumsnXF_5NZ6koGSwLeTf2PnpXceHw1O5b5koemfR7xZKQB-" />
                  </div>
                </div>
                {/* Task Item 3 */}
                <div className="group flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md opacity-70">
                  <div className="relative flex items-center justify-center">
                    <input defaultChecked className="peer appearance-none w-6 h-6 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-[#111717] text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-text-secondary line-through font-medium text-base">Client Call: Zenith Corp</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Done</span>
                    </div>
                  </div>
                </div>
                {/* Task Item 4 */}
                <div className="group flex items-center gap-4 bg-surface-dark p-4 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div className="relative flex items-center justify-center">
                    <input className="peer appearance-none w-6 h-6 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
                    <span className="material-symbols-outlined absolute text-[#111717] text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-base group-hover:text-primary transition-colors">Update Marketing Copy</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs font-medium text-text-secondary bg-[#293738] px-2 py-0.5 rounded">Low</span>
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        5:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Upcoming Tasks (Takes 1 column) */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Upcoming</h3>
                <a className="text-sm text-primary hover:text-primary-dark font-medium" href="#">View All</a>
              </div>
              <div className="bg-surface-dark border border-[#293738] rounded-xl p-1 overflow-hidden h-full flex flex-col">
                {/* Date Header 1 */}
                <div className="px-4 py-3 bg-[#293738]/50 border-b border-[#293738]">
                  <p className="text-sm font-semibold text-white">Tomorrow</p>
                </div>
                <div className="p-2">
                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
                    <div className="mt-0.5 min-w-[4px] h-4 bg-accent-purple rounded-full"></div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Dentist Appointment</p>
                      <p className="text-text-secondary text-xs">9:00 AM - 10:00 AM</p>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
                    <div className="mt-0.5 min-w-[4px] h-4 bg-primary rounded-full"></div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Buy Milk & Coffee</p>
                      <p className="text-text-secondary text-xs">After work</p>
                    </div>
                  </div>
                </div>
                {/* Date Header 2 */}
                <div className="px-4 py-3 bg-[#293738]/50 border-b border-[#293738] border-t">
                  <p className="text-sm font-semibold text-white">Friday, Oct 24</p>
                </div>
                <div className="p-2">
                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
                    <div className="mt-0.5 min-w-[4px] h-4 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Project Alpha Deadline</p>
                      <p className="text-text-secondary text-xs">5:00 PM • Critical</p>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
                    <div className="mt-0.5 min-w-[4px] h-4 bg-accent-blue rounded-full"></div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Weekly Retrospective</p>
                      <p className="text-text-secondary text-xs">11:00 AM</p>
                    </div>
                  </div>
                </div>
                {/* Empty State Illustration Placeholder (Conceptual) */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 opacity-40">
                  <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">event_available</span>
                  <p className="text-xs text-text-secondary text-center">Plan ahead to stay relaxed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background decorative gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      </main>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#1ec9d2] to-[#169ea5] rounded-full shadow-[0_4px_20px_rgba(30,201,210,0.4)] hover:shadow-[0_4px_30px_rgba(30,201,210,0.6)] hover:-translate-y-1 transition-all duration-300">
          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
          <span className="material-symbols-outlined text-white text-[28px] animate-pulse">spark</span>
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#293738] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
            Ask AI Assistant
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
