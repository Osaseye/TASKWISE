import React from 'react';

const UpcomingTasks = () => {
  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Upcoming</h3>
        <a className="text-xs text-primary hover:text-primary-dark font-medium" href="#">View All</a>
      </div>
      <div className="bg-surface-dark border border-[#293738] rounded-xl p-1 overflow-hidden h-full flex flex-col">
        {/* Date Header 1 */}
        <div className="px-3 py-2 bg-[#293738]/50 border-b border-[#293738]">
          <p className="text-xs font-semibold text-white">Tomorrow</p>
        </div>
        <div className="p-1.5">
          <div className="group flex items-start gap-2 p-2 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
            <div className="mt-0.5 min-w-[3px] h-3 bg-accent-purple rounded-full"></div>
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Dentist Appointment</p>
              <p className="text-text-secondary text-[10px]">9:00 AM - 10:00 AM</p>
            </div>
          </div>
          <div className="group flex items-start gap-2 p-2 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
            <div className="mt-0.5 min-w-[3px] h-3 bg-primary rounded-full"></div>
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Buy Milk & Coffee</p>
              <p className="text-text-secondary text-[10px]">After work</p>
            </div>
          </div>
        </div>
        {/* Date Header 2 */}
        <div className="px-3 py-2 bg-[#293738]/50 border-b border-[#293738] border-t">
          <p className="text-xs font-semibold text-white">Friday, Oct 24</p>
        </div>
        <div className="p-1.5">
          <div className="group flex items-start gap-2 p-2 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
            <div className="mt-0.5 min-w-[3px] h-3 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Project Alpha Deadline</p>
              <p className="text-text-secondary text-[10px]">5:00 PM • Critical</p>
            </div>
          </div>
          <div className="group flex items-start gap-2 p-2 rounded-lg hover:bg-[#293738] transition-colors cursor-pointer">
            <div className="mt-0.5 min-w-[3px] h-3 bg-accent-blue rounded-full"></div>
            <div>
              <p className="text-white text-xs font-medium mb-0.5">Weekly Retrospective</p>
              <p className="text-text-secondary text-[10px]">11:00 AM</p>
            </div>
          </div>
        </div>
        {/* Empty State Illustration Placeholder (Conceptual) */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 opacity-40">
          <span className="material-symbols-outlined text-3xl text-text-secondary mb-1">event_available</span>
          <p className="text-[10px] text-text-secondary text-center">Plan ahead to stay relaxed.</p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTasks;
