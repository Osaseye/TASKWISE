import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { aiService } from '../services/aiService';
import { isToday, isTomorrow, isThisWeek, isPast, parseISO } from 'date-fns';
import Sidebar from '../components/dashboard/Sidebar';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';
import MobileNavbar from '../components/dashboard/MobileNavbar';
import CreateTaskModal from '../components/dashboard/CreateTaskModal';
import TaskDetailsModal from '../components/dashboard/TaskDetailsModal';
import DeleteConfirmationModal from '../components/dashboard/DeleteConfirmationModal';
import QuickActionModal from '../components/dashboard/QuickActionModal';
import RecurringTaskModal from '../components/dashboard/RecurringTaskModal';
import RegularTaskModal from '../components/dashboard/RegularTaskModal';

const MyTasksPage = () => {
  // Use global task context
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const { currentUser } = useAuth();
  const { userProfile } = useUser();

  const [newTaskInput, setNewTaskInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  const [isListening, setIsListening] = useState(false);

  // Modal & Action States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showRegularModal, setShowRegularModal] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [quickAction, setQuickAction] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  
  // Filter & Sort States
  const [sortType, setSortType] = useState('default'); // default, priority, time
  const [filterType, setFilterType] = useState('all'); // all, active, completed
  const [dateFilter, setDateFilter] = useState('all'); // all, today, tomorrow, week, overdue
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Loading Text Animation
  useEffect(() => {
    let interval;
    if (isProcessing) {
      const texts = ['Analyzing request...', 'Extracting details...', 'Scheduling task...'];
      let i = 0;
      setLoadingText(texts[0]);
      interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Handle Speech to Text
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewTaskInput((prev) => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleAddTaskInput = async () => {
    if (!newTaskInput.trim()) return;

    setIsProcessing(true);
    
    try {
      const parsed = await aiService.parseTaskCommand(newTaskInput);
      setParsedData(parsed);
      
      if (parsed.recurrence && parsed.recurrence.type && parsed.recurrence.type !== 'none') {
        setShowRecurringModal(true);
      } else {
        setShowRegularModal(true);
      }
      setNewTaskInput('');
    } catch (error) {
      console.error("AI parsing failed", error);
      // Fallback to simple create logic if AI fails
      setParsedData({ title: newTaskInput });
      setShowRegularModal(true);
      setNewTaskInput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveVerifiedTask = (taskData) => {
      addTask({
        ...taskData,
        completed: false
      });
      setShowRegularModal(false);
      setShowRecurringModal(false);
      setParsedData(null);
  };

  const handleSaveSimpleTask = (taskData) => {
    if (editingTask && editingTask.id) {
       updateTask(editingTask.id, taskData);
       setEditingTask(null);
    } else {
      addTask({ ...taskData, completed: false });
      setIsCreateModalOpen(false);
    }
  };

  // toggleTask is now from context

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleQuickActionConfirm = (value) => {
    if (quickAction) {
      if (quickAction.type === 'date') updateTask(quickAction.task.id, { time: value });
      if (quickAction.type === 'priority') updateTask(quickAction.task.id, { priority: value });
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

    // Filter by Date
    if (dateFilter !== 'all') {
        processed = processed.filter(t => {
            if (!t.dueDate) return false;
            const date = typeof t.dueDate === 'string' ? parseISO(t.dueDate) : new Date(t.dueDate);
            
            if (dateFilter === 'today') return isToday(date);
            if (dateFilter === 'tomorrow') return isTomorrow(date);
            if (dateFilter === 'week') return isThisWeek(date);
            if (dateFilter === 'overdue') return isPast(date) && !isToday(date);
            return true;
        });
    }
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

  const displayName = userProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const greetingName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Derive unique categories from tasks
  const uniqueCategories = ['All', ...new Set(tasks.map(t => t.category || 'General'))].sort();

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
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 md:pb-0">
          <div className="max-w-[1024px] mx-auto px-6 py-8 md:px-10 md:py-10 flex flex-col gap-8">
            
            {/* Page Heading */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">My Tasks</h1>
                <p className="text-text-secondary text-sm md:text-base">
                  Good morning, {greetingName}. You have <span className="text-primary font-bold">{tasks.filter(t => !t.completed).length} pending tasks</span> today.
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
              <div className="relative flex items-center bg-[#1c2a2b] rounded-xl p-2 shadow-xl border border-[#3d5152]/50">
                <div className="pl-4 pr-2 text-text-secondary">
                  {isProcessing ? (
                    <span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
                  ) : (
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  )}
                </div>
                <input 
                  className="flex-1 bg-transparent border-none text-white placeholder:text-text-secondary/50 focus:ring-0 text-base py-3 outline-none font-medium" 
                  placeholder={isProcessing ? loadingText : "Ask AI to create a task (or tap mic)..."}
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTaskInput()}
                  disabled={isProcessing}
                  autoFocus
                />
                <div className="flex items-center gap-1 pr-1">
                  {/* Microphone Button */}
                  <button 
                    onClick={handleVoiceInput}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                       isListening 
                       ? 'bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_10px_rgba(248,113,113,0.3)]' 
                       : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                    title="Voice Input"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {isListening ? 'mic' : 'mic_none'}
                    </span>
                  </button>

                  <div className="w-px h-6 bg-[#3d5152] mx-1"></div>

                  <button 
                    onClick={handleAddTaskInput}
                    disabled={!newTaskInput.trim() || isProcessing}
                    className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-background-dark transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary/10 disabled:hover:text-primary" 
                    title="Send to AI"
                  >
                    <span className="material-symbols-outlined text-[22px] filled">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Improved Filters Toolbar */}
            <div className="bg-[#1c2a2b]/50 backdrop-blur-sm p-3 rounded-xl border border-[#3d5152]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Status Toggle */}
                <div className="flex bg-[#111717] rounded-lg p-1 border border-[#3d5152]">
                  {['all', 'active', 'completed'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all capitalize ${
                        filterType === type 
                          ? 'bg-[#293738] text-white shadow-sm' 
                          : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="w-px h-6 bg-[#3d5152] hidden md:block"></div>

                {/* Date Filter Dropdown Style */}
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-[#111717] text-text-secondary text-xs rounded-lg px-3 py-2 border border-[#3d5152] focus:border-primary focus:outline-none cursor-pointer hover:border-primary/50 transition-colors appearance-none min-w-[100px]"
                >
                  <option value="all">Any Date</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                  <option value="overdue">Overdue</option>
                </select>

                {/* Category Filter Dropdown Style */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#111717] text-text-secondary text-xs rounded-lg px-3 py-2 border border-[#3d5152] focus:border-primary focus:outline-none cursor-pointer hover:border-primary/50 transition-colors appearance-none min-w-[100px]"
                >
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </select>

              </div>

              {/* Sort/Clear Actions */}
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => setSortType(prev => prev === 'default' ? 'priority' : prev === 'priority' ? 'time' : 'default')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                    sortType !== 'default' 
                     ? 'bg-primary/20 border-primary/50 text-white' 
                     : 'bg-transparent border-[#3d5152] text-text-secondary hover:border-white/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">sort</span>
                  <span className="text-xs font-medium">
                     {sortType === 'default' ? 'Default' : sortType === 'priority' ? 'By Priority' : 'By Time'}
                  </span>
                </button>

                {(filterType !== 'all' || sortType !== 'default' || categoryFilter !== 'All' || dateFilter !== 'all') && (
                  <button 
                    onClick={() => { setFilterType('all'); setSortType('default'); setCategoryFilter('All'); setDateFilter('all'); }}
                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    Clear
                  </button>
                )}
              </div>
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
                        {task.recurrence && (
                          <span className="flex items-center gap-1 text-[10px] text-text-secondary" title={`Repeats ${task.recurrence.type}`}>
                            <span className="material-symbols-outlined text-[12px]">repeat</span>
                            {task.recurrence.type}
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
      <MobileNavbar />
      <AIAssistantButton />

      {/* Modals */}
      
      {/* 1. Manual Creation Modal (via Top Button) */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleSaveSimpleTask}
        initialData={null}
      />

      {/* 2. AI Verified Regular Task Modal */}
      <RegularTaskModal 
        isOpen={showRegularModal}
        onClose={() => setShowRegularModal(false)}
        onConfirm={handleSaveVerifiedTask}
        initialData={parsedData}
      />

      {/* 3. AI Verified Recurring Task Modal */}
      <RecurringTaskModal 
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onConfirm={handleSaveVerifiedTask}
        initialData={parsedData}
      />

      {/* 4. Edit Existing Task Modal */}
      <CreateTaskModal 
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onConfirm={handleSaveSimpleTask}
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
