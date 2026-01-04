import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import MobileNavbar from '../components/dashboard/MobileNavbar';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';

const initialNotifications = [
  {
    id: 1,
    title: 'Team Sync starting in 15 mins',
    message: 'Your weekly sync with the design team is about to start.',
    time: '15 mins ago',
    type: 'reminder',
    read: false,
  },
  {
    id: 2,
    title: 'New Task Assigned',
    message: 'Sarah assigned you to "Update Landing Page Hero".',
    time: '1 hour ago',
    type: 'assignment',
    read: false,
  },
  {
    id: 3,
    title: 'System Update',
    message: 'Taskwise has been updated to version 2.0! Check out the new features.',
    time: '1 day ago',
    type: 'system',
    read: true,
  },
  {
    id: 4,
    title: 'Goal Achieved!',
    message: 'You completed all your high priority tasks for the week. Great job!',
    time: '2 days ago',
    type: 'achievement',
    read: true,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all'); // all, unread

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const getIcon = (type) => {
    switch (type) {
      case 'reminder': return 'schedule';
      case 'assignment': return 'assignment_ind';
      case 'system': return 'update';
      case 'achievement': return 'emoji_events';
      default: return 'notifications';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'reminder': return 'text-orange-400 bg-orange-400/10';
      case 'assignment': return 'text-blue-400 bg-blue-400/10';
      case 'system': return 'text-purple-400 bg-purple-400/10';
      case 'achievement': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background-light dark:bg-background-dark text-[#111717] dark:text-white font-display overflow-hidden h-screen flex"
    >
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="bg-background-dark border-b border-[#293738] p-6 z-20 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-[#9eb6b7] text-sm">Stay updated with your tasks and team</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-[#293738] text-white' : 'text-[#9eb6b7] hover:text-white'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-[#293738] text-white' : 'text-[#9eb6b7] hover:text-white'}`}
                >
                    Unread
                </button>
            </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
            <div className="max-w-3xl mx-auto space-y-4">
                {notifications.some(n => !n.read) && (
                    <div className="flex justify-end mb-2">
                        <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:underline font-medium">
                            Mark all as read
                        </button>
                    </div>
                )}

                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => (
                        <motion.div 
                            layout
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`p-4 rounded-xl border transition-all group relative ${
                                notification.read 
                                    ? 'bg-transparent border-[#293738] opacity-75 hover:opacity-100' 
                                    : 'bg-[#1A2627] border-primary/30 shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                            }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getColor(notification.type)}`}>
                                    <span className="material-symbols-outlined">{getIcon(notification.type)}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold text-base mb-1 ${notification.read ? 'text-[#9eb6b7]' : 'text-white'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-[#5f7475] whitespace-nowrap">{notification.time}</span>
                                    </div>
                                    <p className="text-sm text-[#9eb6b7] leading-relaxed mb-2">
                                        {notification.message}
                                    </p>
                                    {!notification.read && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                                <button 
                                    onClick={() => handleDelete(notification.id)}
                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-[#5f7475] hover:text-[#ef4444] transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                            {!notification.read && (
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(30,201,210,0.8)]"></div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#1A2627] flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[#5f7475] text-4xl">notifications_off</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">No notifications</h3>
                        <p className="text-[#9eb6b7]">You're all caught up! Check back later.</p>
                    </div>
                )}
            </div>
        </div>

        <MobileNavbar />
      </main>
      <AIAssistantButton />
    </motion.div>
  );
};

export default NotificationsPage;
