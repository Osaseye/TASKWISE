import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  Repeat, 
  Type, 
  AlignLeft,
  CalendarRange,
  Flag,
  Folder
} from 'lucide-react';

export default function TaskConfirmationModal({ isOpen, onClose, taskData, onConfirm }) {
  const [editedTask, setEditedTask] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    priority: 'Medium',
    category: 'General',
    isRecurring: false,
    recurrence: {
      type: 'daily',
      interval: 1,
      endDate: ''
    }
  });

  useEffect(() => {
    if (taskData) {
      const recurrenceData = taskData.recurrence || {};
      
      setEditedTask({
        title: taskData.title || '',
        description: taskData.description || '',
        startDate: taskData.startDate || new Date().toISOString().split('T')[0],
        startTime: taskData.startTime || '',
        priority: taskData.priority || 'Medium',
        category: taskData.category || 'General',
        isRecurring: !!recurrenceData.type && recurrenceData.type !== 'none',
        recurrence: {
          type: recurrenceData.type || 'daily',
          interval: recurrenceData.interval || 1,
          endDate: recurrenceData.endDate || ''
        }
      });
    }
  }, [taskData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct dueDate from startDate and startTime for compatibility
    let dueDate = editedTask.startDate;
    if (editedTask.startDate && editedTask.startTime) {
        dueDate = `${editedTask.startDate}T${editedTask.startTime}`;
    }

    // Construct the final task object
    const finalTask = {
      ...editedTask,
      dueDate: dueDate,
      recurrence: editedTask.isRecurring ? editedTask.recurrence : null
    };

    onConfirm(finalTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[#1c2a2b] border border-[#3d5152] rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#293738]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Check className="w-4 h-4" />
              </div>
              Confirm Task
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-[#293738] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Type className="w-3.5 h-3.5" />
                Title
              </label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white placeholder-gray-500"
                placeholder="Task title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5" />
                Description
              </label>
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white resize-none placeholder-gray-500"
                rows="3"
                placeholder="Add details..."
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={editedTask.startDate}
                  onChange={(e) => setEditedTask({ ...editedTask, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Time
                </label>
                <input
                  type="time"
                  value={editedTask.startTime}
                  onChange={(e) => setEditedTask({ ...editedTask, startTime: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                />
              </div>
            </div>

            {/* Priority & Category Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5" />
                  Priority
                </label>
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5" />
                  Category
                </label>
                <input
                  type="text"
                  value={editedTask.category}
                  onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                  placeholder="e.g. Work"
                />
              </div>
            </div>

            {/* Recurrence Selection */}
            <div className="pt-4 border-t border-[#293738]">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-primary" />
                  Recurring Task
                </label>
                <button
                  type="button"
                  onClick={() => setEditedTask(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#1c2a2b] ${
                    editedTask.isRecurring ? 'bg-primary' : 'bg-[#111717]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editedTask.isRecurring ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {editedTask.isRecurring && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 pl-4 border-l-2 border-[#293738]"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Frequency</label>
                      <select
                        value={editedTask.recurrence.type}
                        onChange={(e) => setEditedTask(prev => ({
                          ...prev,
                          recurrence: { ...prev.recurrence, type: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-[#111717] border border-[#293738] rounded-lg focus:border-primary/50 outline-none transition-colors text-sm text-white"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Interval</label>
                      <input
                        type="number"
                        min="1"
                        value={editedTask.recurrence.interval}
                        onChange={(e) => setEditedTask(prev => ({
                          ...prev,
                          recurrence: { ...prev.recurrence, interval: parseInt(e.target.value) || 1 }
                        }))}
                        className="w-full px-3 py-2 bg-[#111717] border border-[#293738] rounded-lg focus:border-primary/50 outline-none transition-colors text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      <CalendarRange className="w-3.5 h-3.5" />
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={editedTask.recurrence.endDate}
                      onChange={(e) => setEditedTask(prev => ({
                        ...prev,
                        recurrence: { ...prev.recurrence, endDate: e.target.value }
                      }))}
                      min={editedTask.startDate}
                      className="w-full px-3 py-2 bg-[#111717] border border-[#293738] rounded-lg focus:border-primary/50 outline-none transition-colors text-sm text-white"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
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
                Create Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
