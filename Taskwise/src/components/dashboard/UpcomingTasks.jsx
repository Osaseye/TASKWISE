import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TaskDetailsModal from './TaskDetailsModal';
import Skeleton from 'react-loading-skeleton';
import { useTasks } from '../../context/TaskContext';
import { format, isAfter, isToday, parseISO, startOfDay, addHours, isBefore, isTomorrow } from 'date-fns';

const UpcomingTasks = ({ loading }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const { tasks } = useTasks();

  const upcomingTasks = useMemo(() => {
    if (!tasks) return [];
    
    const now = new Date();
    const threeHoursFromNow = addHours(now, 3);
    
    return tasks
      .filter(task => {
        const dateStr = task.dueDate || task.date;
        if (!dateStr) return false;
        
        // Parse date
        let taskDate = typeof dateStr === 'string' ? parseISO(dateStr) : 
                       dateStr.toDate ? dateStr.toDate() : new Date(dateStr);

        // If task has specific time, adjust the date object
        if (task.startTime || task.time) {
             const timeStr = task.startTime || task.time;
             if (timeStr.includes(':')) {
                 const [h, m] = timeStr.split(':');
                 taskDate = new Date(taskDate);
                 taskDate.setHours(parseInt(h), parseInt(m), 0, 0);
             }
        } else {
             return false;
        }
        
        return isAfter(taskDate, now) && isBefore(taskDate, threeHoursFromNow);
      })
      .sort((a, b) => {
         const dateA = a.dueDate || a.date;
         const dateB = b.dueDate || b.date;
         return new Date(dateA) - new Date(dateB);
      });
  }, [tasks]);

  // Group tasks by date
  const groupedTasks = useMemo(() => {
    const groups = {};
    upcomingTasks.forEach(task => {
      // Robust date extraction for grouping key
      let dateKey = task.dueDate || task.date;
      
      // Ensure we have a string YYYY-MM-DD for grouping
      try {
        if (dateKey && typeof dateKey !== 'string') {
             const d = dateKey.toDate ? dateKey.toDate() : new Date(dateKey);
             dateKey = d.toISOString().split('T')[0];
        } else if (dateKey && typeof dateKey === 'string' && dateKey.includes('T')) {
             dateKey = dateKey.split('T')[0];
        }
      } catch (e) {
          dateKey = 'Unknown';
      }

      if (!dateKey) dateKey = 'Unknown';

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });
    return groups;
  }, [upcomingTasks]);

  if (loading) {
    return (
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-surface-dark border border-[#293738] rounded-2xl p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#293738]">
                <Skeleton width={20} height={20} />
              </div>
              <Skeleton width={120} height={24} />
            </div>
            <Skeleton width={24} height={24} circle />
          </div>

          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative pl-4 border-l-2 border-[#293738] py-1">
                <Skeleton width="80%" height={20} className="mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton width={16} height={16} />
                  <Skeleton width={60} height={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-[#293738]">
            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Upcoming</h3>
        <a className="text-xs text-primary hover:text-primary-dark font-medium" href="#">View All</a>
      </div>
      
      <div className="bg-surface-dark border border-[#293738] rounded-xl p-1 h-full flex flex-col min-h-[300px]">
        {upcomingTasks.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
             <div className="w-12 h-12 rounded-full bg-[#293738] flex items-center justify-center mb-3">
               <span className="material-symbols-outlined text-text-secondary text-xl">event_busy</span>
             </div>
             <p className="text-white text-sm font-medium mb-1">No upcoming tasks</p>
             <p className="text-text-secondary text-xs">Your schedule is clear for the upcoming days.</p>
           </div>
        ) : (
          <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
            {Object.entries(groupedTasks).map(([date, tasks]) => {
               const dateObj = parseISO(date);
               const dateLabel = isTomorrow(dateObj) ? 'Tomorrow' : format(dateObj, 'EEEE, MMM d');
               
               return (
                 <div key={date} className="mb-2 last:mb-0">
                   <div className="px-3 py-2 bg-[#293738]/50 border-b border-[#293738] rounded-t-lg sticky top-0 z-10 backdrop-blur-sm">
                     <p className="text-xs font-semibold text-white">{dateLabel}</p>
                   </div>
                   <div className="p-1.5">
                     {tasks.map(task => (
                       <motion.div 
                         key={task.id}
                         whileHover={{ x: 4, backgroundColor: '#293738' }}
                         onClick={() => setSelectedTask(task)}
                         className="group flex items-start gap-2 p-2 rounded-lg transition-colors cursor-pointer"
                       >
                         <div className={`mt-0.5 min-w-[3px] h-3 ${task.color || 'bg-primary'} rounded-full`}></div>
                         <div>
                           <p className="text-white text-xs font-medium mb-0.5">{task.title}</p>
                           <p className="text-text-secondary text-[10px]">{task.time || 'No time'}</p>
                         </div>
                       </motion.div>
                     ))}
                   </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>

      <TaskDetailsModal 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
};

export default UpcomingTasks;
