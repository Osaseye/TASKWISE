import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';

const PlanConfirmationModal = ({ isOpen, onClose, planData }) => {
  const { addTask } = useTasks();
  const [tasks, setTasks] = useState(planData || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update tasks when planData changes
  React.useEffect(() => {
    if (planData) {
      setTasks(planData);
    }
  }, [planData]);

  if (!isOpen) return null;

  const handleRemoveTask = (index) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const today = new Date();
      
      for (const task of tasks) {
        // Calculate due date based on "day" field if present
        let dueDate = new Date(today);
        
        if (task.day) {
            // Simple logic: if "Day 1", add 0 days. "Day 2", add 1 day.
            const dayMatch = task.day.match(/Day (\d+)/i);
            if (dayMatch) {
                const dayOffset = parseInt(dayMatch[1]) - 1;
                dueDate.setDate(today.getDate() + dayOffset);
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
          completed: false
        });
      }
      onClose();
    } catch (error) {
      console.error("Error adding plan tasks:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Plan Confirmation</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review the generated schedule before adding it to your tasks.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 dark:bg-white/5 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10">Day</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10">Time</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10 w-1/3">Task</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10">Duration</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10">Priority</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10">Category</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-white/10">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                  {tasks.map((task, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-sm text-gray-900 dark:text-white font-medium">{task.day || 'Today'}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{task.time}</td>
                      <td className="p-4 text-sm text-gray-900 dark:text-white font-medium">{task.title}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{task.duration} min</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 
                            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{task.category}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleRemoveTask(index)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Task"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {tasks.length === 0 && (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
                  <p>No tasks in this plan.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex gap-4 justify-end bg-gray-50 dark:bg-white/5">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-colors border border-gray-300 dark:border-white/10"
              >
                Review / Edit
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting || tasks.length === 0}
                className="px-6 py-2.5 text-sm font-medium bg-primary text-background-dark rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                    <>
                        <span className="w-4 h-4 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Confirm Plan
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
