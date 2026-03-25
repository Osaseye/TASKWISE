import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { X, Check, Calendar, Clock, Repeat, Type, AlignLeft, CalendarRange, Flag, Folder } from 'lucide-react';

export default function TaskConfirmationModal({ isOpen, onClose, taskData, onConfirm }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '',
      priority: 'Medium',
      category: 'General',
      isRecurring: false,
      recurrenceType: 'daily',
      recurrenceInterval: 1,
      recurrenceEndDate: '',
    },
  });

  const isRecurring = watch('isRecurring');

  useEffect(() => {
    if (taskData) {
      const r = taskData.recurrence || {};
      reset({
        title: taskData.title || '',
        description: taskData.description || '',
        startDate: taskData.startDate || new Date().toISOString().split('T')[0],
        startTime: taskData.startTime || '',
        priority: taskData.priority || 'Medium',
        category: taskData.category || 'General',
        isRecurring: !!r.type && r.type !== 'none',
        recurrenceType: r.type || 'daily',
        recurrenceInterval: r.interval || 1,
        recurrenceEndDate: r.endDate || '',
      });
    }
  }, [taskData, reset]);

  const onSubmit = (data) => {
    let dueDate = data.startDate;
    if (data.startDate && data.startTime) {
      dueDate = `${data.startDate}T${data.startTime}`;
    }
    const finalTask = {
      ...data,
      dueDate,
      recurrence: data.isRecurring
        ? { type: data.recurrenceType, interval: Number(data.recurrenceInterval), endDate: data.recurrenceEndDate || null }
        : null,
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

            {/* Recurring toggle */}
            <div className="pt-4 border-t border-[#293738]">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-primary" />
                  Make this a recurring task
                </label>
                <Controller
                  name="isRecurring"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <button
                      type="button"
                      onClick={() => onChange(!value)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-primary' : 'bg-[#293738]'}`}
                    >
                      <motion.div
                        animate={{ x: value ? 24 : 2 }}
                        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                      />
                    </button>
                  )}
                />
              </div>

              <AnimatePresence>
                {isRecurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 bg-[#111717] p-4 rounded-xl border border-[#293738]">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Repeats Every</label>
                        <select
                          {...register('recurrenceType')}
                          className="w-full px-3 py-2 bg-[#1c2a2b] border border-[#3d5152] rounded-lg focus:border-primary/50 outline-none transition-colors text-white text-sm"
                        >
                          <option value="daily">Day(s)</option>
                          <option value="weekly">Week(s)</option>
                          <option value="monthly">Month(s)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">Interval</label>
                        <input
                          type="number"
                          min="1"
                          {...register('recurrenceInterval')}
                          className="w-full px-3 py-2 bg-[#1c2a2b] border border-[#3d5152] rounded-lg focus:border-primary/50 outline-none transition-colors text-white text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5">
                          <CalendarRange className="w-3.5 h-3.5" /> End Date (Optional)
                        </label>
                        <input
                          type="date"
                          {...register('recurrenceEndDate')}
                          className="w-full px-3 py-2 bg-[#1c2a2b] border border-[#3d5152] rounded-lg focus:border-primary/50 outline-none transition-colors text-white text-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-[#293738] transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary text-[#111717] hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                Confirm Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
