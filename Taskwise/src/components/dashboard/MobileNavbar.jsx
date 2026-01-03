import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileNavbar = () => {
  const location = useLocation();

  const navItems = [
    { icon: 'dashboard', label: 'Home', path: '/dashboard' },
    { icon: 'calendar_month', label: 'Calendar', path: '/calendar' },
    { icon: 'check_circle', label: 'Tasks', path: '/tasks' },
    { icon: 'bar_chart', label: 'Analytics', path: '/analytics' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 md:hidden pointer-events-none">
      <div className="bg-[#1e293b]/90 backdrop-blur-md border border-[#293738] rounded-full px-6 py-3 shadow-2xl shadow-black/50 pointer-events-auto flex items-center gap-6 sm:gap-8">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="relative flex flex-col items-center justify-center w-10 h-10"
          >
            {isActive(item.path) && (
              <motion.div
                layoutId="mobile-nav-active"
                className="absolute inset-0 bg-primary/10 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span 
              className={`material-symbols-outlined text-[24px] transition-colors z-10 ${
                isActive(item.path) ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              {item.icon}
            </span>
            {isActive(item.path) && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
