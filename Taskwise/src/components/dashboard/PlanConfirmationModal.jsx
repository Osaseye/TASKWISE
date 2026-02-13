import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';

const PlanConfirmationModal = ({ isOpen, onClose, planData }) => {
  const { addTask } = useTasks();
  const [tasks, setTasks] = useState(planData || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update tasks when planData changes
  useEffect(() => {
    if (planData) {
      setTasks(planData);
    }
  }, [planData]);

  const handleRemoveTask = (indexToRemove) => {
    const taskToRemove = tasks[indexToRemove];
    const dayToRemove = taskToRemove.day;
    const newTasks = tasks.filter((_, i) => i !== indexToRemove);

    // Check if any tasks remain for this day
    const hasRemainingTasksForDay = newTasks.some(t => t.day === dayToRemove);
    if (!hasRemainingTasksForDay) {
      const match = dayToRemove && dayToRemove.match(/Day (\d+)/i);
      if (match) {
        const removedDayNum = parseInt(match[1]);
        const renumberedTasks = newTasks.map(t => {
          const tMatch = t.day && t.day.match(/Day (\d+)/i);
          if (tMatch) {
            const tDayNum = parseInt(tMatch[1]);
            if (tDayNum > removedDayNum) {
              return { ...t, day: `Day ${tDayNum - 1}` };
            }
          }
          return t;
        });
        setTasks(renumberedTasks);
        return;
      }
    }
    setTasks(newTasks);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const today = new Date();
      let startDay = new Date(today);
      
      const day1Tasks = tasks.filter(t => t.day === "Day 1" || t.day === "Day 01");
      if (day1Tasks.length > 0) {
          day1Tasks.sort((a, b) => {
              if (!a.time) return 1;
              if (!b.time) return -1;
              return a.time.localeCompare(b.time);
          });
          const firstTask = day1Tasks[0];
          if (firstTask.time && firstTask.time.includes(':')) {
              const [hours, minutes] = firstTask.time.split(':');
              const firstTaskTime = new Date(today);
              firstTaskTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
              
              if (firstTaskTime < today) {
                  startDay.setDate(today.getDate() + 1);
                  startDay.setHours(0,0,0,0);
              }
          }
      }

      for (const task of tasks) {
        let dueDate = new Date(startDay);
        
        if (task.day) {
            const dayMatch = task.day.match(/Day (\d+)/i);
            if (dayMatch) {
                const dayOffset = parseInt(dayMatch[1]) - 1;
                dueDate.setDate(startDay.getDate() + dayOffset);
            }
        }

        if (task.time && task.time.includes(':')) {
            const [hours, minutes] = task.time.split(':');
            dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }

        await addTask({
          title: task.title,
          priority: task.priority || 'Medium',
          category: task.category || 'General',
          dueDate: dueDate.toISOString(),
          completed: false,
          time: task.time
        });
      }
      onClose();
    } catch (error) {
      console.error("Error adding plan tasks:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDateForDay = (dayStr) => {
    if (!dayStr) return '';
    const today = new Date();
    const match = dayStr.match(/Day (\d+)/i);
    if (match) {
      const dayOffset = parseInt(match[1]) - 1;
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    return '';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-2xl z-[90] overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                   <span className="material-symbols-outlined text-primary text-2xl">calendar_model</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Generated Plan</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tasks.length} tasks ready to import.</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1C1C1E]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white dark:bg-[#1C1C1E] sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-white/5">
                  <tr>
                    <th className="p-4 pl-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-24">Day</th>
                    <th className="p-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-24">Time</th>
                    <th className="p-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Task Details</th>
                    <th className="p-4 pr-6 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-16 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {tasks.map((task, index) => {
                     const isFirstOfDay = index === 0 || tasks[index - 1].day !== task.day;
                     return (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="p-4 pl-6 align-top">
                            {isFirstOfDay && (
                            <div className="flex flex-col sticky top-16">
                                <span className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">{task.day || 'Today'}</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{getDateForDay(task.day)}</span>
                            </div>
                            )}
                        </td>
                        <td className="p-4 align-top">
                            <div className="inline-flex items-center justify-center px-2 py-1 rounded bg-gray-100 dark:bg-white/5 text-[10px] font-mono text-gray-600 dark:text-gray-300">
                                {task.time || 'Anytime'}
                            </div>
                        </td>
                        <td className="p-4 align-top">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">{task.title}</span>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {task.priority && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                                        task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 
                                        task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' : 
                                        'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                                    }`}>
                                        {task.priority}
                                    </span>
                                    )}
                                    {task.duration && (
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        {task.duration}m
                                    </span>
                                    )}
                                    {task.category && (
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1.5 py-0.5 border border-gray-100 dark:border-white/10 rounded-full">
                                        {task.category}
                                    </span>
                                    )}
                                </div>
                            </div>
                        </td>
                        <td className="p-4 pr-6 align-top text-right">
                            <button 
                            onClick={() => handleRemoveTask(index)}
                            className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Task"
                            >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                        </td>
                        </tr>
                     );
                  })}
                </tbody>
              </table>
              
              {tasks.length === 0 && (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
                  <p>No tasks in this plan.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex gap-4 justify-end bg-gray-50 dark:bg-black/20">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting || tasks.length === 0}
                className="px-6 py-2.5 text-sm font-bold bg-primary text-background-dark rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {isSubmitting ? (
                     <>
                        <span className="w-4 h-4 border-2 border-background-dark border-t-transparent rounded-full animate-spin"/>
                        Adding Tasks...
                     </>
                 ) : (
                     <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Approve & Import
                     </>
                 )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlanConfirmationModal;
