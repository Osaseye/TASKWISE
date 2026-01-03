import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { motion } from 'framer-motion';

const StatsRow = () => {
  const { tasks, stats } = useTasks();
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const pendingCount = totalCount - completedCount;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Stat 1: Completion Rate */}
      <motion.div 
        whileHover={{ y: -4, borderColor: '#3d5152' }}
        className="bg-surface-dark border border-[#293738] rounded-xl p-4 flex flex-col justify-between transition-all group cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="p-1.5 rounded-lg bg-[#293738] text-white group-hover:bg-primary/20 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">+12% vs yest</span>
        </div>
        <div>
          <p className="text-text-secondary text-xs font-medium mb-1">Daily Completion</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-bold text-white">{stats.completionRate}%</p>
            <div className="flex-1 pb-2">
              <div className="h-1.5 w-full bg-[#293738] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${stats.completionRate}%` }}
                ></div> 
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat 2: Task Overview */}
      <motion.div 
        whileHover={{ y: -4, borderColor: '#3d5152' }}
        className="bg-surface-dark border border-[#293738] rounded-xl p-4 flex flex-col justify-between transition-all group cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="p-1.5 rounded-lg bg-[#293738] text-white group-hover:bg-accent-blue/20 group-hover:text-accent-blue transition-colors">
            <span className="material-symbols-outlined text-[20px]">list_alt</span>
          </div>
        </div>
        <div>
          <p className="text-text-secondary text-xs font-medium mb-1">Task Overview</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white">{completedCount}<span className="text-sm text-text-secondary font-normal">/{totalCount}</span></p>
            <p className="text-xs text-text-secondary">completed</p>
          </div>
        </div>
      </motion.div>

      {/* Stat 3: Current Streak */}
      <motion.div 
        whileHover={{ y: -4, borderColor: '#3d5152' }}
        className="bg-surface-dark border border-[#293738] rounded-xl p-4 flex flex-col justify-between transition-all group cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="p-1.5 rounded-lg bg-[#293738] text-white group-hover:bg-orange-400/20 group-hover:text-orange-400 transition-colors">
            <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
          </div>
          <span className="text-[10px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">Best: 12 days</span>
        </div>
        <div>
          <p className="text-text-secondary text-xs font-medium mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-white">5 Days</p>
        </div>
      </motion.div>
    </section>
  );
};

export default StatsRow;
