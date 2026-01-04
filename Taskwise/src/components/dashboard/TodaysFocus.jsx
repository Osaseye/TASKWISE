import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailsModal from './TaskDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import QuickActionModal from './QuickActionModal';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { isToday, parseISO, isPast, isSameDay } from 'date-fns';

const TodaysFocus = ({ loading }) => {
  const { tasks, toggleTask, addTask, updateTask, deleteTask } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [quickAction, setQuickAction] = useState(null); // { type: 'date'|'priority', task: task }
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [sortType, setSortType] = useState('default'); // default, priority, time
  const [filterType, setFilterType] = useState('all'); // all, active, completed

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton width={32} height={32} borderRadius={8} />
            <div>
              <Skeleton width={150} height={24} />
              <Skeleton width={100} height={16} />
            </div>
          </div>
          <Skeleton width={120} height={40} borderRadius={8} />
        </div>

        <div className="flex-1 bg-surface-dark border border-[#293738] rounded-2xl p-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#293738] flex justify-between items-center">
            <div className="flex gap-2">
              <Skeleton width={80} height={32} borderRadius={8} />
              <Skeleton width={80} height={32} borderRadius={8} />
            </div>
            <Skeleton width={100} height={32} borderRadius={8} />
          </div>
          
          <div className="p-4 flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#111717] border border-[#293738] p-4 rounded-xl flex items-center gap-4">
                <Skeleton circle width={24} height={24} />
                <div className="flex-1">
                  <Skeleton width="60%" height={20} className="mb-2" />
                  <div className="flex gap-2">
                    <Skeleton width={60} height={16} borderRadius={4} />
                    <Skeleton width={60} height={16} borderRadius={4} />
                  </div>
                </div>
                <Skeleton width={24} height={24} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(taskData);
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleQuickActionConfirm = (value) => {
    if (quickAction) {
      const updates = {};
      if (quickAction.type === 'date') updates.time = value;
      if (quickAction.type === 'priority') updates.priority = value;
      
      updateTask(quickAction.task.id, updates);
      setQuickAction(null);
    }
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Filter and Sort Logic
  const getProcessedTasks = () => {
    let processed = [...tasks];

    // Filter by Date (Today or Overdue)
    processed = processed.filter(t => {
        if (!t.dueDate) return false; // Skip tasks with no due date
        
        const date = typeof t.dueDate === 'string' ? parseISO(t.dueDate) : 
                     t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
        
        // Show if today
        if (isToday(date)) return true;
        
        // Optional: Show overdue tasks if not completed?
        // For "Today's Focus", usually we want to see what we need to do today.
        // If it's overdue and not completed, it should probably be here too.
        if (isPast(date) && !isSameDay(date, new Date()) && !t.completed) return true;

        return false;
    });

    // Filter
    if (filterType === 'active') processed = processed.filter(t => !t.completed);
    if (filterType === 'completed') processed = processed.filter(t => t.completed);

    // Sort
    if (sortType === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      processed.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99));
    } else if (sortType === 'time') {
      // Simple string sort for now, ideally would parse time
      processed.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }

    return processed;
  };

  const processedTasks = getProcessedTasks();

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          Today's Focus
          <span className="text-[10px] bg-[#293738] text-white px-2 py-0.5 rounded-full">{processedTasks.length}</span>
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setEditingTask(null);
              setIsCreateModalOpen(true);
            }}
            className="px-3 py-1.5 bg-primary text-[#111717] text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Task
          </button>
          
          {/* Sort Button */}
          <div className="relative group">
            <button 
              onClick={() => setSortType(prev => prev === 'default' ? 'priority' : prev === 'priority' ? 'time' : 'default')}
              className={`p-1.5 rounded transition-colors ${sortType !== 'default' ? 'bg-primary/20 text-primary' : 'hover:bg-[#293738] text-text-secondary hover:text-white'}`}
              title={`Sort by: ${sortType}`}
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
            </button>
          </div>

          {/* Filter Button */}
          <div className="relative group">
            <button 
              onClick={() => setFilterType(prev => prev === 'all' ? 'active' : prev === 'active' ? 'completed' : 'all')}
              className={`p-1.5 rounded transition-colors ${filterType !== 'all' ? 'bg-primary/20 text-primary' : 'hover:bg-[#293738] text-text-secondary hover:text-white'}`}
              title={`Filter: ${filterType}`}
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {processedTasks.map((task) => (
            <motion.div 
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedTask(task)}
              className={`group flex items-center gap-3 bg-surface-dark p-3 rounded-xl border ${task.completed ? 'border-primary/20 opacity-60' : 'border-[#293738]'} hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md relative`}
            >
              <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <input 
                  className="peer appearance-none w-5 h-5 border-2 border-[#3d5152] rounded checked:bg-primary checked:border-primary cursor-pointer transition-colors" 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="material-symbols-outlined absolute text-[#111717] text-[14px] opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
              </div>
              <div className="flex-1">
                <p className={`text-white font-medium text-sm group-hover:text-primary transition-colors ${task.completed ? 'line-through text-text-secondary' : ''}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                    task.priority === 'High' ? 'text-orange-400 bg-orange-400/10' :
                    task.priority === 'Medium' ? 'text-blue-400 bg-blue-400/10' :
                    'text-green-400 bg-green-400/10'
                  }`}>
                    {task.priority} Priority
                  </span>
                  {task.time && (
                    <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      {task.time}
                    </span>
                  )}
                  {task.category && (
                    <span className="flex items-center gap-1 text-[10px] text-text-secondary">
                      <span className="material-symbols-outlined text-[12px]">folder</span>
                      {task.category}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => toggleDropdown(task.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#293738] rounded-lg text-text-secondary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdownId === task.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 top-full mt-1 w-40 bg-[#1c2a2b] border border-[#3d5152] rounded-xl shadow-xl z-20 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button 
                          onClick={() => {
                            setEditingTask(task);
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#293738] flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                        </button>
                        <button 
                          onClick={() => {
                            setQuickAction({ type: 'date', task });
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#293738] flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[14px]">schedule</span> Change Time
                        </button>
                        <button 
                          onClick={() => {
                            setQuickAction({ type: 'priority', task });
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#293738] flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[14px]">flag</span> Priority
                        </button>
                        <div className="h-px bg-[#293738] my-1"></div>
                        <button 
                          onClick={() => {
                            setDeletingTask(task);
                            setActiveDropdownId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#293738] flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span> Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {processedTasks.length === 0 && (
          <div className="text-center py-10 text-text-secondary text-sm">
            {tasks.length === 0 ? "No tasks for today. Enjoy your free time!" : "No tasks match your filter."}
          </div>
        )}
      </div>

      <CreateTaskModal 
        isOpen={isCreateModalOpen || !!editingTask}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        onConfirm={handleSaveTask}
        initialData={editingTask}
      />

      <TaskDetailsModal 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />

      <DeleteConfirmationModal 
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={deletingTask?.title}
      />

      <QuickActionModal 
        isOpen={!!quickAction}
        onClose={() => setQuickAction(null)}
        onConfirm={handleQuickActionConfirm}
        type={quickAction?.type}
        task={quickAction?.task}
      />
    </div>
  );
};

export default TodaysFocus;
