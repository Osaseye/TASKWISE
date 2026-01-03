import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'calendar_month', label: 'Calendar', path: '/calendar' },
    { icon: 'check_circle', label: 'My Tasks', path: '/tasks' },
    { icon: 'view_kanban', label: 'Projects', path: '/projects' },
    { icon: 'bar_chart', label: 'Analytics', path: '/analytics' },
    { icon: 'smart_toy', label: 'AI Insights', path: '/ai-insights' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside 
      initial={{ width: "16rem" }}
      animate={{ width: isCollapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full flex flex-col border-r border-[#293738] bg-[#111717] hidden md:flex shrink-0 z-20 overflow-hidden"
    >
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative`}>
        <div className="flex items-center gap-2">
          <img src="/Taskwise-icon.png" alt="Taskwise" className="w-8 h-8 object-contain" />
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white text-lg font-bold tracking-tight whitespace-nowrap"
            >
              TASKWISE
            </motion.h1>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">menu_open</span>
          </button>
        )}
      </div>

      {/* Collapsed State Toggle Button (Centered when collapsed) */}
      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mb-4 text-text-secondary hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
      )}

      <div className="px-3 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              to={item.path} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                ? 'bg-primary/10 text-primary' 
                : 'text-text-secondary hover:bg-[#293738] hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[#293738]">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#293738] cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-primary flex items-center justify-center text-white text-xs font-bold border border-white/10 shrink-0">AL</div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col overflow-hidden"
            >
              <p className="text-white text-sm font-medium leading-none truncate">Alex Doe</p>
            </motion.div>
          )}
          {!isCollapsed && <span className="material-symbols-outlined text-text-secondary ml-auto text-[18px]">settings</span>}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
