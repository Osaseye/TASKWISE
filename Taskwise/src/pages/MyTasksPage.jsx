import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';
import CreateTaskModal from '../components/dashboard/CreateTaskModal';
import TaskDetailsModal from '../components/dashboard/TaskDetailsModal';
import DeleteConfirmationModal from '../components/dashboard/DeleteConfirmationModal';
import QuickActionModal from '../components/dashboard/QuickActionModal';

const MyTasksPage = () => {
  // Local state for tasks (simulating context for this page)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Q3 Financial Reports', priority: 'High', category: 'Work', completed: false, time: '10:00 AM' },
    { id: 2, title: 'Schedule Dentist Appointment', priority: 'Low', category: 'Personal', completed: false, time: '2:00 PM' },
    { id: 3, title: 'Draft Project Proposal', priority: 'Medium', category: 'Work', completed: false, time: '11:30 AM' },
    { id: 4, title: 'Morning Standup Meeting', priority: 'None', category: 'Work', completed: true, time: '9:00 AM' },
  ]);

  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Modal & Action States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [quickAction, setQuickAction] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  
  // Filter & Sort States
  const [sortType, setSortType] = useState('default'); // default, priority, time
  const [filterType, setFilterType] = useState('all'); // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddTaskInput = async () => {
    if (!newTaskInput.trim()) return;

    setIsAiProcessing(true);
    
    // Simulate AI NLP processing
    setTimeout(() => {
      setIsAiProcessing(false);
      // Open modal with "parsed" data
      setEditingTask({
        title: newTaskInput,
        priority: 'Medium', // Simulated default/inferred
        category: 'Work',   // Simulated default/inferred
        time: '',
      });
      setNewTaskInput('');
    }, 1500);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask && editingTask.id) {
      // Update existing
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
      setEditingTask(null);
    } else {
      // Create new
      const newTask = {
        id: Date.now(),
        completed: false,
        ...taskData
      };
      setTasks([newTask, ...tasks]);
      setEditingTask(null);
      setIsCreateModalOpen(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      setTasks(tasks.filter(t => t.id !== deletingTask.id));
      setDeletingTask(null);
    }
  };

  const handleQuickActionConfirm = (value) => {
    if (quickAction) {
      setTasks(tasks.map(t => {
        if (t.id === quickAction.task.id) {
          if (quickAction.type === 'date') return { ...t, time: value };
          if (quickAction.type === 'priority') return { ...t, priority: value };
        }
        return t;
      }));
      setQuickAction(null);
    }
  };

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  const getProcessedTasks = () => {
    let processed = [...tasks];

    // Filter by Status
    if (filterType === 'active') processed = processed.filter(t => !t.completed);
    if (filterType === 'completed') processed = processed.filter(t => t.completed);

    // Filter by Category
    if (categoryFilter !== 'All') processed = processed.filter(t => t.category === categoryFilter);

    // Sort
    if (sortType === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3, 'None': 4 };
      processed.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99));
    } else if (sortType === 'time') {
      processed.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }

    return processed;
  };

  const processedTasks = getProcessedTasks();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden h-screen flex"
    >
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-full flex flex-col relative overflow-hidden bg-background-dark">
        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1024px] mx-auto px-6 py-8 md:px-10 md:py-10 flex flex-col gap-8">
            
            {/* Page Heading */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">My Tasks</h1>
                <p className="text-text-secondary text-sm md:text-base">
                  Good morning, Alex. You have <span className="text-primary font-bold">{tasks.filter(t => !t.completed).length} pending tasks</span> today.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-white font-medium text-lg">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-text-secondary uppercase tracking-widest">Today</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="hidden sm:flex h-10 items-center justify-center px-4 bg-primary hover:bg-[#1bc0c8] text-background-dark text-sm font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-[20px] mr-1">add</span>
                  Add Task
                </button>
              </div>
            </header>

            {/* AI Command Input */}
            <div className="relative group/composer z-10">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-30 group-hover/composer:opacity-75 transition duration-500"></div>
              <div className="relative flex items-center bg-surface-hover rounded-lg p-2 shadow-lg">
                <div className="pl-4 pr-2 text-text-secondary">
                  {isAiProcessing ? (
                    <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                  ) : (
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  )}
                </div>
                <input 
                  className="flex-1 bg-transparent border-none text-white placeholder:text-text-secondary focus:ring-0 text-base py-3 outline-none" 
                  placeholder={isAiProcessing ? "AI is processing your request..." : "Ask AI to create a task (e.g., 'Remind me to call John tomorrow at 2pm')"}
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTaskInput()}
                  disabled={isAiProcessing}
                />
                <div className="flex items-center gap-2 pr-2">
                  <button 
                    onClick={handleAddTaskInput}
                    disabled={!newTaskInput.trim() || isAiProcessing}
                    className="p-2 text-primary hover:text-white hover:bg-primary/20 transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed" 
                    title="Send to AI"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filters (Chips) */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setFilterType(prev => prev === 'all' ? 'active' : prev === 'active' ? 'completed' : 'all')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all group ${filterType !== 'all' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-hover border-transparent text-text-secondary hover:text-white'}`}
              >
                <span className="text-xs font-medium">Status: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}</span>
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
              </button>

              <button 
                onClick={() => setSortType(prev => prev === 'default' ? 'priority' : prev === 'priority' ? 'time' : 'default')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all group ${sortType !== 'default' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-hover border-transparent text-text-secondary hover:text-white'}`}
              >
                <span className="text-xs font-medium">Sort: {sortType.charAt(0).toUpperCase() + sortType.slice(1)}</span>
                <span className="material-symbols-outlined text-[16px]">sort</span>
              </button>

              <button 
                onClick={() => setCategoryFilter(prev => prev === 'All' ? 'Work' : prev === 'Work' ? 'Personal' : 'All')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all group ${categoryFilter !== 'All' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-hover border-transparent text-text-secondary hover:text-white'}`}
              >
                <span className="text-xs font-medium">Category: {categoryFilter}</span>
                <span className="material-symbols-outlined text-[16px]">folder</span>
              </button>
              
              {(filterType !== 'all' || sortType !== 'default' || categoryFilter !== 'All') && (
                <>
                  <div className="h-4 w-px bg-[#3d5152] mx-1"></div>
                  <button 
                    onClick={() => { setFilterType('all'); setSortType('default'); setCategoryFilter('All'); }}
                    className="text-xs font-medium text-primary hover:text-white transition-colors"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-3 pb-20">
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
                          task.priority === 'Low' ? 'text-green-400 bg-green-400/10' :
                          'text-text-secondary bg-[#293738]'
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
                  {tasks.length === 0 ? "No tasks found. Add one to get started!" : "No tasks match your filters."}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
      <AIAssistantButton />

      {/* Modals */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleSaveTask}
        initialData={null}
      />

      {/* Edit/AI Confirmation Modal */}
      <CreateTaskModal 
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
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
    </motion.div>
  );
};

export default MyTasksPage;
