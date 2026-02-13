import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
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
    
    // Use a faster interval for smoother typing
    const intervalId = setInterval(() => {
      // Logic changed to use slice instead of charAt to prevent dropped characters
      if (indexRef.current < text.length) {
        indexRef.current += 1;
        setDisplayedText(text.slice(0, indexRef.current));
      } else {
        clearInterval(intervalId);
      }
    }, 10); 

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="text-sm prose dark:prose-invert max-w-none">
      <ReactMarkdown 
        components={{
          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
          code: ({node, inline, className, children, ...props}) => {
            return inline ? 
              <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono dark:bg-gray-700 dark:text-gray-100" {...props}>{children}</code> :
              <div className="bg-gray-200 p-2 rounded-lg my-2 overflow-x-auto dark:bg-gray-800 dark:text-gray-100"><code className="text-xs font-mono" {...props}>{children}</code></div>
          }
        }}
      >
        {displayedText}
      </ReactMarkdown>
    </div>
  );
};

const PlanMessage = ({ planData, onApprove }) => {
  const [tasks, setTasks] = useState(planData || []);
  const [isApproved, setIsApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety check for empty or invalid planData
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/30 text-center mt-2">
              <p className="text-red-800 dark:text-red-200 text-xs">Plan data is unavailable or corrupted.</p>
          </div>
      );
  }

  const handleRemoveTask = (indexToRemove) => {
    const taskToRemove = tasks[indexToRemove];
    const dayToRemove = taskToRemove.day;
    const newTasks = tasks.filter((_, i) => i !== indexToRemove);

    const hasRemainingTasksForDay = newTasks.some(t => t.day === dayToRemove);
    if (!hasRemainingTasksForDay) {
      const match = dayToRemove && dayToRemove.match(/Day (\d+)/i);
      if (match) {
        const removedDayNum = parseInt(match[1]);
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
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    return '';
  };

  if (isApproved) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-green-50/50 dark:bg-green-900/10 rounded-2xl border border-green-200 dark:border-green-500/20 text-center mt-4 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Plan Approved!</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tasks.length} tasks added to your schedule.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-surface-dark rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-white/5 overflow-hidden mt-4 animate-fade-in subpixel-antialiased">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
            </div>
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Action Plan</h3>
                <p className="text-[10px] text-gray-500 font-medium">{tasks.length} Tasks Generated</p>
            </div>
        </div>
      </div>
      
      {/* Table Content */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar bg-white dark:bg-surface-dark">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-white/5 shadow-sm">
            <tr>
              <th className="p-3 pl-5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-24">Day</th>
              <th className="p-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-20">Time</th>
              <th className="p-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Task Details</th>
              <th className="p-3 pr-5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-10 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {tasks.map((task, index) => {
              const isFirstOfDay = index === 0 || tasks[index - 1].day !== task.day;
              
              return (
                <tr key={index} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-3 pl-5 align-top">
                    {isFirstOfDay && (
                      <div className="flex flex-col sticky top-12">
                        <span className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">{task.day || 'Today'}</span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{getDateForDay(task.day)}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 align-top">
                    <div className="inline-flex items-center justify-center px-2 py-1 rounded bg-gray-100 dark:bg-white/5 text-[10px] font-mono text-gray-600 dark:text-gray-300">
                      {task.time || 'Anytime'}
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">{task.title}</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        {task.priority && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                            task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 
                            task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' : 
                            'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                        {task.duration && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {task.duration}m
                          </span>
                        )}
                        {task.category && (
                           <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1.5 py-0.5 border border-gray-100 dark:border-white/10 rounded-full">
                             {task.category}
                           </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 pr-5 align-top text-right pt-3">
                    <button 
                      onClick={() => handleRemoveTask(index)}
                      className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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

      <div className="p-4 border-t border-gray-100 dark:border-white/5 flex gap-3 justify-end bg-gray-50 dark:bg-black/20">
        <button
          onClick={handleApproveClick}
          disabled={isSubmitting || tasks.length === 0}
          className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold bg-primary text-background-dark rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
              <>
                 <span className="w-3 h-3 border-2 border-background-dark border-r-transparent rounded-full animate-spin"/>
                 Adding Tasks...
              </>
          ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Approve & Add to Calendar
              </>
          )}
        </button>
      </div>
    </div>
  );
};

import { chatService } from '../../services/chatService';

const AIAssistantSidebar = () => {
  const { isAIAssistantOpen, closeAIAssistant } = useUI();
  const { currentUser } = useAuth();
  const { addTask } = useTasks();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [view, setView] = useState('chat'); // 'chat' or 'history'
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Load chat history on mount
  useEffect(() => {
    if (currentUser?.uid && view === 'history') {
      const loadHistory = async () => {
        const chats = await chatService.getUserChats(currentUser.uid);
        setHistory(chats);
      };
      loadHistory();
    }
  }, [currentUser, view]);

  // Handle Speech to Text
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }
  
    if (isListening) {
      setIsListening(false);
      return; // The 'end' event will handle cleanup
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
      setInputValue((prev) => prev + (prev ? ' ' : '') + transcript);
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setView('chat');
  };

  const handleToggleHistory = () => {
    setView(prev => prev === 'history' ? 'chat' : 'history');
  };

  const handleLoadHistory = (item) => {
    // Check if messages array exists and has content
    if (item.messages && Array.isArray(item.messages) && item.messages.length > 0) {
      setMessages(item.messages);
    } else {
      // Fallback for old/broken records or empty arrays
      // This prevents the "Greetings" screen from showing up for an empty historical chat
      setMessages([
         { role: 'user', content: item.title || "Previous Chat" }, 
         { role: 'assistant', content: item.preview || "Chat content unavailable." } 
      ]);
    }
    setCurrentChatId(item.id);
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
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsProcessing(true);

    try {
      // 1. Check if we need to create a new chat session in Firestore
      let chatId = currentChatId;
      if (!chatId && currentUser?.uid) {
        chatId = await chatService.createChat(currentUser.uid, userMsg);
        setCurrentChatId(chatId);
      }

      // Check for plan intent
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('plan') || lowerMsg.includes('schedule') || lowerMsg.includes('routine') || lowerMsg.includes('study')) {
         const plan = await aiService.generatePlan(userMsg);
         if (plan && Array.isArray(plan)) {
            const planMsg = {
              role: 'assistant',
              type: 'plan',
              content: plan
            };
            const updatedMessages = [...newMessages, planMsg];
            setMessages(updatedMessages);
            
            // Persist valid response
            if (chatId && currentUser?.uid) {
              await chatService.saveMessages(currentUser.uid, chatId, updatedMessages);
            }
         } else {
            // Fallback to normal chat if plan generation fails or returns text
            const response = await aiService.chat(userMsg, messages);
            const updatedMessages = [...newMessages, { role: 'assistant', content: response }];
            setMessages(updatedMessages);
            if (chatId && currentUser?.uid) {
               await chatService.saveMessages(currentUser.uid, chatId, updatedMessages);
            }
         }
      } else {
         const response = await aiService.chat(userMsg, messages);
         const updatedMessages = [...newMessages, { role: 'assistant', content: response }];
         setMessages(updatedMessages);
         
         // Persist normal chat
         if (chatId && currentUser?.uid) {
           await chatService.saveMessages(currentUser.uid, chatId, updatedMessages);
         }
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
                   <button 
                    onClick={handleVoiceInput}
                    className={`p-2 transition-colors rounded-full ${isListening ? 'text-red-500 animate-pulse bg-red-100 dark:bg-red-900/20' : 'text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-white/5'}`}
                   >
                    <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic_off' : 'mic'}</span>
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
