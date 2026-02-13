import { useTasks } from '../../context/TaskContext.jsx';
import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { aiService } from '../../services/aiService';
import RecurringTaskModal from './RecurringTaskModal';
import RegularTaskModal from './RegularTaskModal';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { addTask, tasks } = useTasks();
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  const { currentUser } = useAuth();
  const { userProfile } = useUser();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showRegularModal, setShowRegularModal] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingText, setLoadingText] = useState('Processing...');
  const [isListening, setIsListening] = useState(false);

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  const displayName = userProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const greetingName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // ... (keeping existing useEffect for loading text)

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

  const handleNLP = async () => {
    if (!inputValue.trim()) return;

    setIsProcessing(true);
    
    try {
      // Call actual AI Service
      const parsed = await aiService.parseTaskCommand(inputValue);
      
      if (parsed) {
        setParsedData(parsed);
        setIsProcessing(false);
        
        if (parsed.recurrence && parsed.recurrence.type && parsed.recurrence.type !== 'none') {
          setShowRecurringModal(true);
        } else {
          setShowRegularModal(true);
        }
      } else {
        // Fallback for empty/invalid response
        throw new Error("Failed to parse");
      }
    } catch (error) {
      console.error("NLP Error:", error);
      // Fallback manual entry
      setParsedData({
        title: inputValue,
        priority: 'Medium',
        category: 'General',
        startDate: new Date().toISOString().split('T')[0],
        startTime: ''
      });
      setIsProcessing(false);
      setShowRegularModal(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      handleNLP();
    }
  };

  const handleConfirm = (data) => {
    addTask(data);
    setShowRecurringModal(false);
    setShowRegularModal(false);
    setInputValue('');
    setParsedData(null);
  };

  return (
    <header className="pt-6 px-6 pb-4 md:px-8 flex flex-col gap-4 shrink-0 z-10 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Good Morning, {greetingName}</h2>
          <p className="text-text-secondary text-sm">You have {pendingTasksCount} tasks pending today. Stay focused.</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-[#293738] hover:bg-[#3d5152] flex items-center justify-center text-white transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-primary border border-[#293738]"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-[#1c2a2b] border border-[#3d5152] rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-[#293738] flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadNotificationsCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] text-primary hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-3 hover:bg-[#293738]/50 transition-colors cursor-pointer border-b border-[#293738]/50 ${!notification.read ? 'bg-[#293738]/20' : ''}`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                            notification.type === 'success' ? 'bg-primary' :
                            notification.type === 'error' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className={`text-xs font-medium ${!notification.read ? 'text-white' : 'text-[#9eb6b7]'}`}>{notification.title}</p>
                            <p className="text-[10px] text-text-secondary mt-0.5">{notification.message} • {notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-xs text-[#5f7475]">No notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* NLP Input */}
      <div className="w-full max-w-3xl mx-auto relative group z-0">
        <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-blue/20 to-primary/20 rounded-xl blur opacity-30 transition-opacity ${isProcessing ? 'animate-pulse opacity-80' : 'group-hover:opacity-60'}`}></div>
        <div className={`relative bg-[#1c2a2b] border ${isProcessing ? 'border-primary/50' : 'border-[#3d5152]'} rounded-xl flex items-center shadow-lg focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden`}>
          
          {/* Loading Progress Bar */}
          {isProcessing && (
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent-blue to-primary w-full"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          )}

          <div className={`pl-4 text-primary ${isProcessing ? 'animate-spin' : 'animate-pulse'}`}>
            <span className="material-symbols-outlined text-[20px]">
              {isProcessing ? 'sync' : 'auto_awesome'}
            </span>
          </div>
          <input 
            className="w-full bg-transparent border-none text-white placeholder-text-secondary/70 px-4 py-3 focus:ring-0 text-sm md:text-base font-light outline-none" 
            placeholder={isProcessing ? loadingText : "What would you like to achieve today? Type 'Meeting with team at 2pm'..."}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <div className="pr-2 flex items-center gap-1">
            <button 
              onClick={handleVoiceInput}
              disabled={isProcessing}
              className={`p-1.5 rounded-lg transition-colors ${
                isListening 
                  ? 'text-red-500 bg-red-100 dark:bg-red-900/20 animate-pulse' 
                  : 'text-text-secondary hover:text-white hover:bg-[#293738]'
              }`}
              title="Voice Input"
            >
              <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic_off' : 'mic'}</span>
            </button>
            <button 
              onClick={handleNLP}
              disabled={!inputValue.trim() || isProcessing}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                !inputValue.trim() || isProcessing 
                  ? 'bg-[#293738] text-text-secondary cursor-not-allowed' 
                  : 'bg-[#293738] hover:bg-primary hover:text-[#111717] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

      <RecurringTaskModal 
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onConfirm={handleConfirm}
        taskData={parsedData}
      />

      <RegularTaskModal 
        isOpen={showRegularModal}
        onClose={() => setShowRegularModal(false)}
        onConfirm={handleConfirm}
        taskData={parsedData}
      />
    </header>
  );
};

export default Header;
