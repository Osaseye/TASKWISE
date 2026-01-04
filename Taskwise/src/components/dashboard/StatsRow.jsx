import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';

const StatsRow = ({ loading }) => {
  const { tasks, stats } = useTasks();
  
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const pendingCount = totalCount - completedCount;

  if (loading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-dark border border-[#293738] rounded-xl p-4 flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start mb-3">
              <Skeleton width={32} height={32} borderRadius={8} />
              <Skeleton width={60} height={20} />
            </div>
            <div>
              <Skeleton width={100} height={16} className="mb-2" />
              <div className="flex items-end gap-3">
                <Skeleton width={40} height={32} />
                <div className="flex-1 pb-2">
                  <Skeleton height={6} borderRadius={999} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

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
          <span className="text-[10px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">Best: {stats.bestStreak || 0} days</span>
        </div>
        <div>
          <p className="text-text-secondary text-xs font-medium mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-white">{stats.currentStreak || 0} Days</p>
        </div>
      </motion.div>
    </section>
  );
};

export default StatsRow;
