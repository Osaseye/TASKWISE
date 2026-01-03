import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'border-b border-surface-border bg-background-dark/80 backdrop-blur-md' 
        : 'border-b border-transparent bg-transparent'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <img src="/Taskwise-icon.png" alt="Taskwise Logo" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-white">TASKWISE</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:block text-sm font-medium text-white hover:text-primary transition-colors">Log In</Link>
          <Link to="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-all hover:bg-primary-dark hover:shadow-[0_0_20px_-5px_rgba(30,201,210,0.5)]">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
