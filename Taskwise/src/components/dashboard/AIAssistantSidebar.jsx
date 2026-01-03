import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '../../context/UIContext';

const AIAssistantSidebar = () => {
  const { isAIAssistantOpen, closeAIAssistant } = useUI();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [view, setView] = useState('chat'); // 'chat' or 'history'
  const textareaRef = useRef(null);

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

  const getGreeting = () => {
    const date = new Date();
    const hour = date.getHours();
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const name = "Alex";

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
                      <div className="flex justify-center">
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">Today</span>
                      </div>
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-1`}>
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mx-1">{msg.role === 'user' ? 'You' : 'TASKWISE AI'}</span>
                          <div className={`${msg.role === 'user' ? 'bg-gray-200 dark:bg-[#2A3435] text-gray-900 dark:text-white rounded-tr-none' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none'} px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
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
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      inputValue.trim() 
                        ? 'bg-primary text-background-dark shadow-md shadow-primary/20 hover:bg-primary/90' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!inputValue.trim()}
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
