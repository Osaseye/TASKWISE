import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1c2a2b] border border-[#3d5152] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${task.completed ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {task.completed ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{task.title}</h3>
                    <p className="text-text-secondary text-xs mt-1">Created today</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111717] p-3 rounded-xl border border-[#293738]">
                    <p className="text-xs text-text-secondary mb-1">Time</p>
                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                      <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                      {task.time || 'All Day'}
                    </div>
                  </div>
                  <div className="bg-[#111717] p-3 rounded-xl border border-[#293738]">
                    <p className="text-xs text-text-secondary mb-1">Category</p>
                    <div className="flex items-center gap-2 text-white text-sm font-medium">
                      <span className="material-symbols-outlined text-[16px] text-accent-blue">folder</span>
                      {task.category || 'General'}
                    </div>
                  </div>
                </div>

                <div className="bg-[#111717] p-3 rounded-xl border border-[#293738]">
                  <p className="text-xs text-text-secondary mb-2">Priority</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      task.priority === 'High' ? 'bg-orange-400' :
                      task.priority === 'Medium' ? 'bg-blue-400' :
                      'bg-green-400'
                    }`}></span>
                    <span className="text-white text-sm font-medium">{task.priority} Priority</span>
                  </div>
                </div>

                <div className="bg-[#111717] p-3 rounded-xl border border-[#293738]">
                  <p className="text-xs text-text-secondary mb-2">Description</p>
                  <p className="text-white text-sm leading-relaxed opacity-80">
                    {task.description || "No additional details provided for this task."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-2 pt-4 border-t border-[#293738]">
                <button className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#293738] text-white hover:bg-[#3d5152] transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit
                </button>
                <button 
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                    task.completed 
                      ? 'bg-surface-dark border border-[#3d5152] text-text-secondary hover:text-white' 
                      : 'bg-primary text-[#111717] hover:bg-primary-dark'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {task.completed ? 'undo' : 'check'}
                  </span>
                  {task.completed ? 'Mark Incomplete' : 'Complete Task'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
