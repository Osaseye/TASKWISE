import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  
  useEffect(() => {
    if (!text) return;
    setDisplayedText('');
    indexRef.current = 0;
    
    const intervalId = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(indexRef.current));
        indexRef.current += 1;
      } else {
        clearInterval(intervalId);
      }
    }, 20); // Adjusted speed for better reliability

    return () => clearInterval(intervalId);
  }, [text]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

const PlanMessage = ({ planData, onApprove }) => {
  const [tasks, setTasks] = useState(planData);
  const [isApproved, setIsApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRemoveTask = (indexToRemove) => {
    const taskToRemove = tasks[indexToRemove];
    const dayToRemove = taskToRemove.day;

    // Remove the task
    const newTasks = tasks.filter((_, i) => i !== indexToRemove);

    // Check if any tasks remain for this day
    const hasRemainingTasksForDay = newTasks.some(t => t.day === dayToRemove);

    if (!hasRemainingTasksForDay) {
      // Extract the number from "Day X"
      const match = dayToRemove && dayToRemove.match(/Day (\d+)/i);
      if (match) {
        const removedDayNum = parseInt(match[1]);
        
        // Shift subsequent days
        const renumberedTasks = newTasks.map(t => {
          const tMatch = t.day && t.day.match(/Day (\d+)/i);
          if (tMatch) {
            const tDayNum = parseInt(tMatch[1]);
            if (tDayNum > removedDayNum) {
              return { ...t, day: `Day ${tDayNum - 1}` };
            }
          }
          return t;
        });
        setTasks(renumberedTasks);
        return;
      }
    }
    
    setTasks(newTasks);
  };

  const handleApproveClick = async () => {
    setIsSubmitting(true);
    await onApprove(tasks);
    setIsSubmitting(false);
    setIsApproved(true);
  };

  const getDateForDay = (dayStr) => {
    if (!dayStr) return '';
    const today = new Date();
    const match = dayStr.match(/Day (\d+)/i);
    if (match) {
      const dayOffset = parseInt(match[1]) - 1;
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return '';
  };

  if (isApproved) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/30 text-center mt-2 animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">check_circle</span>
          <p className="text-green-800 dark:text-green-200 font-medium">Plan added to your tasks!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-border-dark overflow-hidden mt-2 animate-fade-in">
      <div className="p-4 border-b border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-surface-dark-lighter flex justify-between items-center">
        <h3 className="font-bold text-gray-900 dark:text-white">Generated Plan</h3>
        <span className="text-xs text-gray-500 dark:text-text-secondary">{tasks.length} tasks</span>
      </div>
      
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-surface-dark-lighter border-b border-gray-200 dark:border-border-dark">
            <tr>
              <th className="p-3 text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase whitespace-nowrap w-24">Day</th>
              <th className="p-3 text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase whitespace-nowrap w-20">Time</th>
              <th className="p-3 text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase w-full">Task</th>
              <th className="p-3 text-xs font-semibold text-gray-500 dark:text-text-secondary uppercase whitespace-nowrap w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
            {tasks.map((task, index) => {
              // Check if this is the first task of the day
              const isFirstOfDay = index === 0 || tasks[index - 1].day !== task.day;
              
              return (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors group">
                  <td className="p-3 align-top">
                    {isFirstOfDay && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">{task.day || 'Today'}</span>
                        <span className="text-[10px] text-gray-400 dark:text-text-secondary">{getDateForDay(task.day)}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-xs text-gray-500 dark:text-text-secondary font-mono whitespace-nowrap align-top pt-3.5">{task.time}</td>
                  <td className="p-3 text-sm text-gray-900 dark:text-white align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{task.title}</span>
                      <div className="flex gap-2 items-center">
                        {task.priority && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 
                            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                        {task.duration && (
                          <span className="text-[10px] text-gray-400 dark:text-text-secondary flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[10px]">schedule</span>
                            {task.duration}m
                          </span>
                        )}
                        {task.category && (
                           <span className="text-[10px] text-gray-400 dark:text-text-secondary border border-gray-200 dark:border-border-dark px-1.5 py-0.5 rounded-full">
                             {task.category}
                           </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-top pt-3">
                    <button 
                      onClick={() => handleRemoveTask(index)}
                      className="p-1.5 text-gray-400 dark:text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove Task"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-border-dark flex gap-3 justify-end bg-gray-50 dark:bg-surface-dark-lighter">
        <button
          className="px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors border border-gray-300 dark:border-border-dark"
        >
          Review
        </button>
        <button
          onClick={handleApproveClick}
          disabled={isSubmitting || tasks.length === 0}
          className="px-4 py-2 text-xs font-medium bg-primary text-background-dark rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? 'Processing...' : 'Approve'}
        </button>
      </div>
    </div>
  );
};

const AIAssistantSidebar = () => {
  const { isAIAssistantOpen, closeAIAssistant } = useUI();
  const { currentUser } = useAuth();
  const { addTask } = useTasks();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [view, setView] = useState('chat'); // 'chat' or 'history'
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Mock History Data
  const [history] = useState([
    { id: 1, title: "Python Study Plan", date: "Today, 10:23 AM", preview: "I've drafted a 4-hour Python study block..." },
    { id: 2, title: "Weekly Review", date: "Yesterday, 4:15 PM", preview: "Here's a summary of your completed tasks..." },
    { id: 3, title: "Debug React Component", date: "Jan 2, 11:00 AM", preview: "The issue seems to be in the useEffect hook..." },
  ]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleNewChat = () => {
    setMessages([]);
    setView('chat');
  };

  const handleToggleHistory = () => {
    setView(prev => prev === 'history' ? 'chat' : 'history');
  };

  const handleLoadHistory = (item) => {
    // In a real app, this would load the actual messages
    setMessages([
      { role: 'user', content: `Load chat: ${item.title}` },
      { role: 'assistant', content: item.preview }
    ]);
    setView('chat');
  };

  const handleApprovePlan = async (tasks) => {
    try {
      const today = new Date();
      let startDay = new Date(today);

      // Check if the first task of Day 1 has passed
      const day1Tasks = tasks.filter(t => t.day === "Day 1" || t.day === "Day 01");
      if (day1Tasks.length > 0) {
          // Sort by time to find the earliest task
          day1Tasks.sort((a, b) => {
              if (!a.time) return 1;
              if (!b.time) return -1;
              return a.time.localeCompare(b.time);
          });

          const firstTask = day1Tasks[0];
          if (firstTask.time && firstTask.time.includes(':')) {
              const [hours, minutes] = firstTask.time.split(':');
              const firstTaskTime = new Date(today);
              firstTaskTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
              
              // If the time has passed, start the plan tomorrow
              if (firstTaskTime < today) {
                  startDay.setDate(today.getDate() + 1);
                  // Reset time to start of day for the base date
                  startDay.setHours(0, 0, 0, 0);
              }
          }
      }
      
      for (const task of tasks) {
        // Calculate due date based on "day" field if present
        let dueDate = new Date(startDay);
        
        if (task.day) {
            // Simple logic: if "Day 1", add 0 days. "Day 2", add 1 day.
            const dayMatch = task.day.match(/Day (\d+)/i);
            if (dayMatch) {
                const dayOffset = parseInt(dayMatch[1]) - 1;
                dueDate.setDate(startDay.getDate() + dayOffset);
            }
        }

        if (task.time && task.time.includes(':')) {
            const [hours, minutes] = task.time.split(':');
            dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            // Default to 9 AM if no time specified, or keep as 00:00 if you prefer all-day
            // But for sorting, having a time is useful. Let's keep it as is (00:00) if no time.
        }

        await addTask({
          title: task.title,
          priority: task.priority || 'Medium',
          category: task.category || 'General',
          dueDate: dueDate.toISOString(),
          completed: false,
          time: task.time // Store the time string explicitly as well for display
        });
      }
    } catch (error) {
      console.error("Error adding plan tasks:", error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    try {
      // Check for plan intent
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('plan') || lowerMsg.includes('schedule') || lowerMsg.includes('routine') || lowerMsg.includes('study')) {
         const plan = await aiService.generatePlan(userMsg);
         if (plan && Array.isArray(plan)) {
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              type: 'plan',
              content: plan 
            }]);
         } else {
            // Fallback to normal chat if plan generation fails or returns text
            const response = await aiService.chat(userMsg, messages);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
         }
      } else {
         const response = await aiService.chat(userMsg, messages);
         setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getGreeting = () => {
    const date = new Date();
    const hour = date.getHours();
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const name = currentUser?.displayName?.split(' ')[0] || "User";

    // Fixed Date Holidays
    if (month === 0 && day === 1) return `Happy New Year, ${name}!`;
    if (month === 1 && day === 14) return `Happy Valentine's Day, ${name}!`;
    if (month === 2 && day === 8) return `Happy International Women's Day, ${name}!`;
    if (month === 2 && day === 17) return `Happy St. Patrick's Day, ${name}!`;
    if (month === 3 && day === 22) return `Happy Earth Day, ${name}!`;
    if (month === 6 && day === 4) return `Happy Independence Day, ${name}!`;
    if (month === 9 && day === 31) return `Happy Halloween, ${name}!`;
    if (month === 10 && day === 11) return `Happy Veterans Day, ${name}!`;
    if (month === 11 && day === 24) return `Merry Christmas Eve, ${name}!`;
    if (month === 11 && day === 25) return `Merry Christmas, ${name}!`;
    if (month === 11 && day === 31) return `Happy New Year's Eve, ${name}!`;

    // Dynamic Holidays
    // Thanksgiving (US): 4th Thursday in November
    if (month === 10 && dayOfWeek === 4 && day >= 22 && day <= 28) return `Happy Thanksgiving, ${name}!`;
    // Mother's Day (US): 2nd Sunday in May
    if (month === 4 && dayOfWeek === 0 && day >= 8 && day <= 14) return `Happy Mother's Day, ${name}!`;
    // Father's Day (US): 3rd Sunday in June
    if (month === 5 && dayOfWeek === 0 && day >= 15 && day <= 21) return `Happy Father's Day, ${name}!`;
    // Labor Day (US): 1st Monday in September
    if (month === 8 && dayOfWeek === 1 && day <= 7) return `Happy Labor Day, ${name}!`;

    // Time of Day
    if (hour < 12) return `Good Morning, ${name}`;
    if (hour < 18) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  };

  return (
    <AnimatePresence>
      {isAIAssistantOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAIAssistant}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer Container */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-background-light dark:bg-background-dark shadow-2xl flex flex-col border-l border-white/10 z-[70]"
          >
            {/* Header */}
            <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/5 bg-background-light/50 dark:bg-background-dark/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                {/* Taskwise Icon */}
                <img src="/Taskwise-icon.png" alt="Taskwise AI" className="w-8 h-8 object-contain" />
                <h3 className="text-gray-900 dark:text-white text-lg font-bold tracking-tight">TASKWISE Assistant</h3>
              </div>
              <div className="flex items-center gap-1">
                 {/* History Button */}
                 <button 
                  onClick={handleToggleHistory}
                  className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 transition-colors ${view === 'history' ? 'bg-gray-200 dark:bg-white/10 text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                  title="History"
                >
                  <span className="material-symbols-outlined text-[20px]">history</span>
                </button>
                {/* New Chat Button */}
                <button 
                  onClick={handleNewChat}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors" 
                  title="New Chat"
                >
                  <span className="material-symbols-outlined text-[20px]">add_comment</span>
                </button>
                {/* Close Button */}
                <button 
                  onClick={closeAIAssistant}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors" 
                  title="Close"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar">
              {view === 'history' ? (
                /* History View */
                <div className="flex flex-col gap-4 animate-fade-in-up">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Recent Chats</h3>
                  <div className="flex flex-col gap-2">
                    {history.map(item => (
                      <button 
                        key={item.id}
                        onClick={() => handleLoadHistory(item)}
                        className="flex flex-col gap-1 p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 hover:border-primary/50 hover:shadow-md transition-all text-left group"
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{item.title}</span>
                          <span className="text-[10px] text-gray-400">{item.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.preview}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Chat View */
                <>
                  {messages.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{getGreeting()}</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">How can I help you?</p>
                      
                      {/* Quick Starters */}
                      <div className="flex flex-wrap justify-center gap-2 w-full max-w-sm mt-6">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                          Plan my day
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span className="material-symbols-outlined text-[18px]">school</span>
                          Study plan
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                          Brainstorm
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Messages List */
                    <>
                      {/* Date Separator */}
                      <div className="flex justify-center mb-6">
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">Today</span>
                      </div>
                      
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                          <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                            
                            {/* Icon */}
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/10">
                              {msg.role === 'user' ? (
                                <div className="w-full h-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold">
                                  {currentUser?.displayName?.[0] || 'U'}
                                </div>
                              ) : (
                                <img src="/Taskwise-icon.png" alt="AI" className="w-full h-full object-contain bg-white dark:bg-black/20 p-1" />
                              )}
                            </div>

                            {/* Message Content */}
                            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
                              <span className="text-[10px] text-gray-400 mb-1 px-1">
                                {msg.role === 'user' ? 'You' : 'TaskWise'}
                              </span>
                              
                              {msg.role === 'user' ? (
                                <div className="bg-primary text-background-dark px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow-sm font-medium">
                                  {msg.content}
                                </div>
                              ) : (
                                <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed pt-1 w-full">
                                   {msg.type === 'plan' ? (
                                     <PlanMessage planData={msg.content} onApprove={handleApprovePlan} />
                                   ) : (
                                     <Typewriter text={msg.content} />
                                   )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Thinking Indicator */}
                      {isProcessing && (
                        <div className="flex w-full justify-start mb-6">
                          <div className="flex max-w-[90%] flex-row gap-3">
                             <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/10">
                                <img src="/Taskwise-icon.png" alt="AI" className="w-full h-full object-contain bg-white dark:bg-black/20 p-1" />
                             </div>
                             <div className="flex flex-col items-start">
                                <span className="text-[10px] text-gray-400 mb-1 px-1">TaskWise</span>
                                <div className="flex items-center gap-1 h-6 px-2">
                                  <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                    className="w-1.5 h-1.5 bg-primary rounded-full"
                                  />
                                  <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    className="w-1.5 h-1.5 bg-primary rounded-full"
                                  />
                                  <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                    className="w-1.5 h-1.5 bg-primary rounded-full"
                                  />
                                </div>
                             </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </>
              )}
            </div>

            {/* Footer Input Area */}
            <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-background-light dark:bg-background-dark shrink-0 flex flex-col gap-4">
              {/* Input Field - Redesigned */}
              <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-gray-100 dark:bg-white/5 transition-all">
                
                {/* Textarea */}
                <textarea 
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 outline-none text-sm py-2 px-2 max-h-32 resize-none leading-relaxed no-scrollbar" 
                  placeholder="Ask anything..." 
                  rows={1}
                  style={{ minHeight: '24px' }}
                ></textarea>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 mb-0.5">
                   {/* Mic Button */}
                   <button className="p-2 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                  {/* Send Button */}
                  <button 
                    onClick={handleSend}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      inputValue.trim() && !isProcessing
                        ? 'bg-primary text-background-dark shadow-md shadow-primary/20 hover:bg-primary/90' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!inputValue.trim() || isProcessing}
                  >
                    <span className="material-symbols-outlined text-[20px] flex">arrow_upward</span>
                  </button>
                </div>
              </div>
              <p className="text-center text-[10px] text-gray-400 dark:text-gray-600">TASKWISE AI can make mistakes. Verify important info.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantSidebar;
