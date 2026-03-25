const fs = require('fs');

const createModal = `import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';

const CreateTaskModal = ({ isOpen, onClose, onConfirm, initialData = null }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      priority: 'Medium',
      category: 'General',
      recurrence: 'none',
    },
  });

  const priority = watch('priority');

  useEffect(() => {
    if (isOpen && initialData) {
      reset({
        title: initialData.title || '',
        date: initialData.date || initialData.startDate || new Date().toISOString().split('T')[0],
        time: initialData.time || initialData.startTime || '',
        priority: initialData.priority || 'Medium',
        category: initialData.category || 'General',
        recurrence: initialData.recurrence?.type || 'none',
      });
    } else if (isOpen && !initialData) {
      reset({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        priority: 'Medium',
        category: 'General',
        recurrence: 'none',
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data) => {
    const submissionData = {
      ...data,
      recurrence: data.recurrence === 'none' ? null : { type: data.recurrence, interval: 1 },
    };
    onConfirm(submissionData);
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">
                  {initialData && !initialData.id ? 'Confirm Task Details' : initialData ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button type="button" onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Task Name</label>
                  <input
                    type="text"
                    {...register('title', { required: true })}
                    placeholder="e.g. Review Q3 Report"
                    className="w-full bg-[#111717] border border-[#293738] rounded-lg px-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                  {errors.title && <span className="text-red-500 text-xs">Title is required</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Date</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">calendar_today</span>
                      <input
                        type="date"
                        {...register('date')}
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Time</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">schedule</span>
                      <input
                        type="text"
                        {...register('time')}
                        placeholder="e.g. 2:00 PM"
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Category</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">folder</span>
                      <input
                        type="text"
                        {...register('category')}
                        placeholder="e.g. Work"
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Recurrence</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">repeat</span>
                      <select
                        {...register('recurrence')}
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors appearance-none"
                      >
                        <option value="none">None</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px] pointer-events-none">expand_more</span>
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
                        onClick={() => setValue('priority', p)}
                        className={\`flex-1 py-2 rounded-lg text-xs font-medium border transition-all \${
                          priority === p
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-[#111717] border-[#293738] text-text-secondary hover:border-[#3d5152]'
                        }\`}
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
                    {initialData ? 'Save Changes' : 'Create Task'}
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

export default CreateTaskModal;
`;

const regularModal = `import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Check, Calendar, Clock, Type, AlignLeft, Flag, Folder } from 'lucide-react';

export default function RegularTaskModal({ isOpen, onClose, taskData, onConfirm }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '',
      priority: 'Medium',
      category: 'General',
    },
  });

  useEffect(() => {
    if (taskData) {
      reset({
        title: taskData.title || '',
        description: taskData.description || '',
        startDate: taskData.startDate || new Date().toISOString().split('T')[0],
        startTime: taskData.startTime || '',
        priority: taskData.priority || 'Medium',
        category: taskData.category || 'General',
      });
    }
  }, [taskData, reset]);

  const onSubmit = (data) => {
    let dueDate = data.startDate;
    if (data.startDate && data.startTime) {
      dueDate = \`\${data.startDate}T\${data.startTime}\`;
    }
    onConfirm({ ...data, dueDate, recurrence: null });
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
          <div className="flex items-center justify-between p-5 border-b border-[#293738]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Check className="w-4 h-4" />
              </div>
              Confirm Task
            </h3>
            <button onClick={onClose} className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-[#293738] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Type className="w-3.5 h-3.5" /> Title
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="Task title"
                className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white placeholder-gray-500"
              />
              {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5" /> Description
              </label>
              <textarea
                {...register('description')}
                rows="3"
                placeholder="Add details..."
                className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white resize-none placeholder-gray-500"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Time
                </label>
                <input
                  type="time"
                  {...register('startTime')}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                />
              </div>
            </div>

            {/* Priority + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5" /> Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5" /> Category
                </label>
                <input
                  type="text"
                  {...register('category')}
                  placeholder="e.g. Work"
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-[#293738] transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-[#111717] hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                Create Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
`;

fs.writeFileSync('c:/Users/User/OneDrive/Desktop/TASKWISE/TASKWISE/Taskwise/src/components/dashboard/CreateTaskModal.jsx', createModal);
fs.writeFileSync('c:/Users/User/OneDrive/Desktop/TASKWISE/TASKWISE/Taskwise/src/components/dashboard/RegularTaskModal.jsx', regularModal);
console.log('Done');
