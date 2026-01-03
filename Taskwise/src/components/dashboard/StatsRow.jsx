import React from 'react';

const StatsRow = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Stat 1 */}
      <div className="bg-surface-dark border border-[#293738] rounded-xl p-4 flex flex-col justify-between hover:border-[#3d5152] transition-colors group">
        <div className="flex justify-between items-start mb-3">
          <div className="p-1.5 rounded-lg bg-[#293738] text-white group-hover:bg-primary/20 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">+12% vs yest</span>
        </div>
        <div>
          <p className="text-text-secondary text-xs font-medium mb-1">Daily Completion</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-bold text-white">78%</p>
            <div className="flex-1 pb-2">
              <div className="h-1.5 w-full bg-[#293738] rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Stat 2 */}
      <div className="bg-surface-dark border border-[#293738] rounded-xl p-4 flex flex-col justify-between hover:border-[#3d5152] transition-colors group">
        <div className="flex justify-between items-start mb-3">
          <div className="p-1.5 rounded-lg bg-[#293738] text-white group-hover:bg-accent-blue/20 group-hover:text-accent-blue transition-colors">
            <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          </div>
        </div>
        <div>
          <p className="text-text-secondary text-xs font-medium mb-1">Focus Time</p>
          <p className="text-2xl font-bold text-white">4h 12m</p>
        </div>
      </div>
      {/* Stat 3 */}
      <div className="bg-surface-dark border border-[#293738] rounded-xl p-4 flex flex-col justify-between hover:border-[#3d5152] transition-colors group">
        <div className="flex justify-between items-start mb-3">
          <div className="p-1.5 rounded-lg bg-[#293738] text-white group-hover:bg-accent-purple/20 group-hover:text-accent-purple transition-colors">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
        </div>
        <div>
          <p className="text-text-secondary text-xs font-medium mb-1">Deep Work Session</p>
          <p className="text-2xl font-bold text-white">4.5 hrs</p>
        </div>
      </div>
    </section>
  );
};

export default StatsRow;
