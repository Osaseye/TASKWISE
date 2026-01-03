import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuickActionModal = ({ isOpen, onClose, onConfirm, type, task }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen && task) {
      if (type === 'date') {
        setValue(task.time || '');
      } else if (type === 'priority') {
        setValue(task.priority || 'Medium');
      }
    }
  }, [isOpen, task, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(value);
  };

  const getTitle = () => {
    if (type === 'date') return 'Change Date/Time';
    if (type === 'priority') return 'Set Priority';
    return 'Edit';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#1c2a2b] border border-[#3d5152] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{getTitle()}</h3>
                <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {type === 'date' && (
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">New Time</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">schedule</span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. 2:00 PM"
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {type === 'priority' && (
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Select Priority</label>
                    <div className="flex gap-2">
                      {['High', 'Medium', 'Low'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setValue(p)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                            value === p
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-[#111717] border-[#293738] text-text-secondary hover:border-[#3d5152]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6 pt-4 border-t border-[#293738]">
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
                    Save
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

export default QuickActionModal;
