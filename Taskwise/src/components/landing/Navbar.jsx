import React from 'react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <img src="/Taskwise-icon.png" alt="Taskwise Logo" className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-white">TASKWISE</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm font-medium text-white hover:text-primary transition-colors">Log In</button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-all hover:bg-primary-dark hover:shadow-[0_0_20px_-5px_rgba(30,201,210,0.5)]">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
