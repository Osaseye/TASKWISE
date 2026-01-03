import React from 'react';

const TodaysFocus = () => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Today's Focus
          <span className="text-[10px] bg-[#293738] text-white px-2 py-0.5 rounded-full">5</span>
        </h3>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-[#293738] rounded text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">sort</span>
          </button>
          <button className="p-1.5 hover:bg-[#293738] rounded text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {/* Task Item 1 */}
        <div className="group flex items-center gap-3 bg-surface-dark p-3 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
          <div className="relative flex items-center justify-center">
            <input className="peer appearance-none w-5 h-5 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
            <span className="material-symbols-outlined absolute text-[#111717] text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm group-hover:text-primary transition-colors">Review Q3 Financial Reports</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">High Priority</span>
              <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                2:00 PM
              </span>
              <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                <span className="material-symbols-outlined text-[12px]">folder</span>
                Finance
              </span>
            </div>
          </div>
          <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#293738] rounded-lg text-text-secondary hover:text-white transition-all">
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>
        </div>
        {/* Task Item 2 */}
        <div className="group flex items-center gap-3 bg-surface-dark p-3 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
          <div className="relative flex items-center justify-center">
            <input className="peer appearance-none w-5 h-5 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
            <span className="material-symbols-outlined absolute text-[#111717] text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm group-hover:text-primary transition-colors">Team Sync with Engineering</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-medium text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">Medium</span>
              <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                4:30 PM
              </span>
              <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                <span className="material-symbols-outlined text-[12px]">folder</span>
                Product
              </span>
            </div>
          </div>
          <div className="flex -space-x-2 mr-2">
            <img alt="User Avatar" className="w-5 h-5 rounded-full border border-[#1c2a2b]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfIdvHwbl4hhrrBhZzKVde--P3sPA7ugwc1f5zU3UOGjEn_mS04Jm25GIJIHafBlHVviPBfO3CUHvnFUgRipxb5TvnZaGMmJC3MYy8mv9wz2sWJAgZ3XJ_ofqOH4TUI_AyTqg_F-SyEnZHCFAfslEUhRzve8F8Gx9a1wioY2j_2RkaaNJLO-jAmiWTw9z6z7z1QWqR7LCAU3MyvpKI-cn290ATuIBU2hlJJXXT_SOpKyeb0nZMxpcxRZKYiFRMk61Z0fGTEY8LGgKJ" />
            <img alt="User Avatar" className="w-5 h-5 rounded-full border border-[#1c2a2b]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIj9idJTXR0ppo7zzI7renqcYka4OoWXV-N5uK5fDE3S1qVBavCgtC5v8oS7Iee4gQVj-Y_YRKqG1GFRtyCR1oesBMdQnFbKmHEoeFLJC3TeU5QLo_lwavPox4oAE9PFpm6hL7ef-hM7Z43yzWIZjntsXLctueMSqiEaZKtzrNOyURmC9ydOGCYlibhyTADydNRW4Z5uNBjLpz0U9aCCguc6EsSRt1oumsnXF_5NZ6koGSwLeTf2PnpXceHw1O5b5koemfR7xZKQB-" />
          </div>
        </div>
        {/* Task Item 3 */}
        <div className="group flex items-center gap-3 bg-surface-dark p-3 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md opacity-70">
          <div className="relative flex items-center justify-center">
            <input defaultChecked className="peer appearance-none w-5 h-5 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
            <span className="material-symbols-outlined absolute text-[#111717] text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
          </div>
          <div className="flex-1">
            <p className="text-text-secondary line-through font-medium text-sm">Client Call: Zenith Corp</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Done</span>
            </div>
          </div>
        </div>
        {/* Task Item 4 */}
        <div className="group flex items-center gap-3 bg-surface-dark p-3 rounded-xl border border-[#293738] hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
          <div className="relative flex items-center justify-center">
            <input className="peer appearance-none w-5 h-5 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" type="checkbox" />
            <span className="material-symbols-outlined absolute text-[#111717] text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm group-hover:text-primary transition-colors">Update Marketing Copy</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-medium text-text-secondary bg-[#293738] px-2 py-0.5 rounded">Low</span>
              <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                5:00 PM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysFocus;
