# TASKWISE — Migration Guide
## Sonner Notifications + React Hook Form

> Hand this file to GitHub Copilot in VS Code.  
> Every section lists **exactly** which file to open, what to remove, and what to add.  
> Follow the sections in order — dependencies first, then providers, then forms.

---

## STEP 1 — Install dependencies

Run in the project root:

```bash
npm install sonner react-hook-form
npm uninstall  # nothing to uninstall — NotificationContext stays but its Toast is replaced
```

---

## STEP 2 — Add Sonner `<Toaster>` to `src/main.jsx`

### File: `src/main.jsx`

**REMOVE** nothing structural — just add two lines.

**ADD** at the top:
```jsx
import { Toaster } from 'sonner';
```

**CHANGE** the render block. Find:
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <UserProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
```

**REPLACE WITH:**
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <UserProvider>
          <TaskProvider>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1c2a2b',
                  color: '#ffffff',
                  border: '1px solid #293738',
                  borderRadius: '12px',
                  fontSize: '13px',
                },
                className: 'taskwise-toast',
              }}
              richColors
              closeButton
            />
          </TaskProvider>
        </UserProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
)
```

---

## STEP 3 — Replace the Toast component in `NotificationContext.jsx`

### File: `src/context/NotificationContext.jsx`

**REMOVE** this import at the top:
```jsx
import { AnimatePresence, motion } from 'framer-motion';
```

**ADD** this import at the top instead:
```jsx
import { toast } from 'sonner';
```

**REMOVE** the entire `Toast` component (find and delete everything between these two lines, inclusive):
```jsx
const Toast = ({ notification, onClose }) => {
  // ... entire component body ...
};
```

**FIND** the `addNotification` function:
```jsx
const addNotification = async (notification) => {
    // Show toast immediately for better UX
    setToast({ ...notification, id: Date.now() });
    // ... rest of function
```

**REPLACE** the `setToast(...)` line only with:
```jsx
const addNotification = async (notification) => {
    // Sonner toast — maps type to the correct sonner method
    const toastFn =
      notification.type === 'success' ? toast.success
      : notification.type === 'error' ? toast.error
      : notification.type === 'info'  ? toast.info
      : toast;

    toastFn(notification.title, {
      description: notification.message,
      duration: 5000,
    });
    // ... keep all the existing Firestore addDoc logic below unchanged
```

**FIND** the `useState` for toast and remove it:
```jsx
const [toast, setToast] = useState(null);   // DELETE this line
```

**FIND** the return statement at the bottom of `NotificationProvider`. It currently ends with:
```jsx
      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.id}
            notification={toast}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
```

**REPLACE** that entire `AnimatePresence` block with nothing — delete it. The return becomes:
```jsx
  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
```

---

## STEP 4 — Replace `CreateTaskModal` with react-hook-form

### File: `src/components/dashboard/CreateTaskModal.jsx`

**REPLACE THE ENTIRE FILE** with the following:

```jsx
import React, { useEffect } from 'react';
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
                  {initialData?.id ? 'Edit Task' : initialData ? 'Confirm Task Details' : 'Create New Task'}
                </h3>
                <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Task Name</label>
                  <input
                    {...register('title', { required: 'Task name is required' })}
                    placeholder="e.g. Review Q3 Report"
                    className="w-full bg-[#111717] border border-[#293738] rounded-lg px-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Date + Time */}
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
                        {...register('time')}
                        placeholder="e.g. 2:00 PM"
                        className="w-full bg-[#111717] border border-[#293738] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Category + Recurrence */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">Category</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">folder</span>
                      <input
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

                {/* Priority */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {['High', 'Medium', 'Low'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setValue('priority', p)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                          priority === p
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
                    {initialData?.id ? 'Save Changes' : 'Create Task'}
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
```

---

## STEP 5 — Replace `RegularTaskModal` with react-hook-form

### File: `src/components/dashboard/RegularTaskModal.jsx`

**REPLACE THE ENTIRE FILE** with the following:

```jsx
import React, { useEffect } from 'react';
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
      dueDate = `${data.startDate}T${data.startTime}`;
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
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white [color-scheme:dark]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Time
                </label>
                <input
                  type="time"
                  {...register('startTime')}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white [color-scheme:dark]"
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
                  {...register('category')}
                  placeholder="e.g. Work"
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
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
```

---

## STEP 6 — Replace `RecurringTaskModal` with react-hook-form

### File: `src/components/dashboard/RecurringTaskModal.jsx`

**REPLACE THE ENTIRE FILE** with the following:

```jsx
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
                  <Calendar className="w-3.5 h-3.5" /> Start Date
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white [color-scheme:dark]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Time
                </label>
                <input
                  type="time"
                  {...register('startTime')}
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white [color-scheme:dark]"
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
                  {...register('category')}
                  placeholder="e.g. Work"
                  className="w-full px-4 py-2.5 bg-[#111717] border border-[#293738] rounded-xl focus:border-primary/50 outline-none transition-colors text-white"
                />
              </div>
            </div>

            {/* Recurring toggle */}
            <div className="pt-4 border-t border-[#293738]">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-primary" /> Recurring Task
                </label>
                <Controller
                  name="isRecurring"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${field.value ? 'bg-primary' : 'bg-[#111717]'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${field.value ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  )}
                />
              </div>

              {isRecurring && (
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
                        {...register('recurrenceType')}
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
                        {...register('recurrenceInterval', { min: 1 })}
                        className="w-full px-3 py-2 bg-[#111717] border border-[#293738] rounded-lg focus:border-primary/50 outline-none transition-colors text-sm text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      <CalendarRange className="w-3.5 h-3.5" /> End Date (Optional)
                    </label>
                    <input
                      type="date"
                      {...register('recurrenceEndDate')}
                      className="w-full px-3 py-2 bg-[#111717] border border-[#293738] rounded-lg focus:border-primary/50 outline-none transition-colors text-sm text-white [color-scheme:dark]"
                    />
                  </div>
                </motion.div>
              )}
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
```

---

## STEP 7 — Update `ChangePasswordPage` with react-hook-form

### File: `src/pages/settings/ChangePasswordPage.jsx`

**REMOVE** these existing state declarations:
```jsx
const [passwords, setPasswords] = useState({ new: '', confirm: '' });
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState({ type: '', text: '' });
```

**REPLACE** the import block at the top with:
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
```

**REPLACE** the component body with:
```jsx
const ChangePasswordPage = () => {
  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateUserPassword(data.newPassword);
      toast.success('Password updated successfully');
      setTimeout(() => navigate('/settings'), 1000);
    } catch {
      toast.error('Failed to update password. Please log out and back in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717] pb-32 md:pb-0">
        <div className="w-full max-w-[1024px] px-8 py-8">
          <Breadcrumbs items={[{ label: 'Settings', path: '/settings' }, { label: 'Change Password' }]} />
          <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-subtle mb-1.5">New Password</label>
                <input
                  type="password"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                />
                {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-subtle mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('newPassword') || 'Passwords do not match',
                  })}
                  className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                />
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-primary text-[#112021] font-bold py-3 rounded-lg hover:bg-[#1bc0c8] transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
};

export default ChangePasswordPage;
```

---

## STEP 8 — Update `ContactSupportPage` with react-hook-form

### File: `src/pages/settings/ContactSupportPage.jsx`

**REPLACE** the import block:
```jsx
import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
```

**REPLACE** the component body (the useState + handleSubmit block) with:
```jsx
const ContactSupportPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // send data to backend here
    setSubmitted(true);
    toast.success('Bug report sent. Thanks!');
  };

  // ... rest of the JSX stays the same, just replace:
  //   <form onSubmit={handleSubmit}>
  //   with:
  //   <form onSubmit={handleSubmit(onSubmit)}>
  //
  //   and replace all value/onChange inputs with {...register('fieldName', { required: true })}
  //   Add {errors.fieldName && <p>...</p>} below each required field
```

> **Tip for Copilot:** open the file, select the form JSX, and prompt  
> `"Convert this form to react-hook-form using register, handleSubmit, and errors"`

---

## STEP 9 — Quick-action chips fix in `AIAssistantSidebar.jsx`

### File: `src/components/dashboard/AIAssistantSidebar.jsx`

**FIND** the three starter buttons in the empty state (search for `Plan my day`):
```jsx
<button className="flex items-center gap-2 px-4 py-2 ...">
  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
  Plan my day
</button>
<button className="flex items-center gap-2 px-4 py-2 ...">
  <span className="material-symbols-outlined text-[18px]">school</span>
  Study plan
</button>
<button className="flex items-center gap-2 px-4 py-2 ...">
  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
  Brainstorm
</button>
```

**ADD** `onClick` handlers to each:
```jsx
<button onClick={() => { setInputValue('Plan my day'); }} ...>Plan my day</button>
<button onClick={() => { setInputValue('Create a study plan for me'); }} ...>Study plan</button>
<button onClick={() => { setInputValue('Help me brainstorm ideas'); }} ...>Brainstorm</button>
```

---

## STEP 10 — Fix non-functional buttons in `TaskDetailsModal.jsx`

### File: `src/components/dashboard/TaskDetailsModal.jsx`

**FIND** the Edit button near the bottom:
```jsx
<button className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#293738] text-white ...">
  <span className="material-symbols-outlined text-[18px]">edit</span>
  Edit
</button>
```

**REPLACE** with (pass `onEdit` prop down from parent, or use `onClose` + trigger edit):
```jsx
// Add onEdit prop to component signature:
// const TaskDetailsModal = ({ isOpen, onClose, task, onEdit }) => {

<button
  onClick={() => { onClose(); if (onEdit) onEdit(task); }}
  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#293738] text-white hover:bg-[#3d5152] transition-colors flex items-center justify-center gap-2"
>
  <span className="material-symbols-outlined text-[18px]">edit</span>
  Edit
</button>
```

**FIND** the Complete Task button:
```jsx
<button className={`flex-1 py-2.5 rounded-xl ...`}>
  ...
  {task.completed ? 'Mark Incomplete' : 'Complete Task'}
</button>
```

**ADD** the missing `onClick`:
```jsx
// Add toggleTask from useTasks() at the top of the component:
// const { toggleTask } = useTasks();

<button
  onClick={() => { toggleTask(task.id); onClose(); }}
  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
    task.completed
      ? 'bg-surface-dark border border-[#3d5152] text-text-secondary hover:text-white'
      : 'bg-primary text-[#111717] hover:bg-primary-dark'
  }`}
>
```

---

## Summary of all files changed

| File | Change type |
|---|---|
| `src/main.jsx` | Add `<Toaster>` from sonner |
| `src/context/NotificationContext.jsx` | Replace internal Toast with `toast()` from sonner |
| `src/components/dashboard/CreateTaskModal.jsx` | Full rewrite with react-hook-form |
| `src/components/dashboard/RegularTaskModal.jsx` | Full rewrite with react-hook-form |
| `src/components/dashboard/RecurringTaskModal.jsx` | Full rewrite with react-hook-form + Controller |
| `src/components/dashboard/AIAssistantSidebar.jsx` | Add onClick to quick-action chips |
| `src/components/dashboard/TaskDetailsModal.jsx` | Wire up Edit + Complete buttons |
| `src/pages/settings/ChangePasswordPage.jsx` | Rewrite form with react-hook-form + sonner |
| `src/pages/settings/ContactSupportPage.jsx` | Rewrite form with react-hook-form + sonner |

---

## Notes for Copilot

- `register` replaces every manual `value` + `onChange` pair on native inputs.
- `handleSubmit(onSubmit)` replaces every `e.preventDefault()` + manual state read.
- `errors.fieldName` gives you per-field validation messages — always render them below the input.
- `Controller` is only needed for non-native inputs (the custom toggle in RecurringTaskModal). All regular `<input>`, `<select>`, and `<textarea>` elements use `register` directly.
- Sonner's `toast.success / toast.error / toast.info` replace every `addNotification({ type, title, message })` call pattern.
- The `NotificationContext` still exists for the bell-icon history panel — only the visual Toast pop-up is replaced by sonner.
