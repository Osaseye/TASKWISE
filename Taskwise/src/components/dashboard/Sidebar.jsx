import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar } = useUI();
  const { currentUser, logout } = useAuth();
  const { userProfile } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'calendar_month', label: 'Calendar', path: '/calendar' },
    { icon: 'check_circle', label: 'My Tasks', path: '/tasks' },
    { icon: 'bar_chart', label: 'Analytics', path: '/analytics' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;
  
  const displayName = userProfile?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <motion.aside 
      initial={{ width: "16rem" }}
      animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full flex flex-col border-r border-[#293738] bg-[#111717] hidden md:flex shrink-0 z-20 overflow-hidden"
    >
      <div className={`p-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} relative`}>
        <div className="flex items-center gap-2">
          <img src="/Taskwise-icon.png" alt="Taskwise" className="w-8 h-8 object-contain" />
          {!isSidebarCollapsed && (
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
        
        {!isSidebarCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">menu_open</span>
          </button>
        )}
      </div>

      {/* Collapsed State Toggle Button (Centered when collapsed) */}
      {isSidebarCollapsed && (
        <button 
          onClick={toggleSidebar}
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
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title={isSidebarCollapsed ? item.label : ''}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {!isSidebarCollapsed && (
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
        <div className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#293738] cursor-pointer transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-primary flex items-center justify-center text-white text-xs font-bold border border-white/10 shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col overflow-hidden"
            >
              <p className="text-white text-sm font-medium leading-none truncate">{displayName}</p>
            </motion.div>
          )}
          {!isSidebarCollapsed && (
            <button onClick={handleLogout} className="ml-auto text-text-secondary hover:text-red-400 transition-colors" title="Logout">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          )}
        </div>
        {isSidebarCollapsed && (
           <button onClick={handleLogout} className="mt-2 w-full flex justify-center text-text-secondary hover:text-red-400 transition-colors" title="Logout">
             <span className="material-symbols-outlined text-[18px]">logout</span>
           </button>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
