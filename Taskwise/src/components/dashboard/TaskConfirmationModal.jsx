import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskConfirmationModal = ({ isOpen, onClose, onConfirm, initialData }) => {
  const [taskData, setTaskData] = useState(initialData || {
    title: '',
    time: '',
    priority: 'Medium',
    category: 'General'
  });

  useEffect(() => {
    if (initialData) {
      setTaskData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(taskData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#1c2a2b] border border-[#3d5152] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Task Detected</h3>
                  <p className="text-text-secondary text-xs">AI parsed the following details</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Task Name</label>
                  <input
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleChange}
                    className="w-full bg-[#111717] border border-[#293738] rounded-lg px-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Time</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">schedule</span>
                      <input
                        type="text"
                        name="time"
                        value={taskData.time}
                        onChange={handleChange}
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Category</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">folder</span>
                      <input
                        type="text"
                        name="category"
                        value={taskData.category}
                        onChange={handleChange}
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {['High', 'Medium', 'Low'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTaskData(prev => ({ ...prev, priority: p }))}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                          taskData.priority === p
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-[#111717] border-[#293738] text-text-secondary hover:border-[#3d5152]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-4 border-t border-[#293738]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-[#293738] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-[#111717] hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                  >
                    Confirm Task
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskConfirmationModal;
