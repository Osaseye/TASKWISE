import React from 'react';

const PWASection = () => {
  return (
    <section className="relative pt-10 pb-20" id="pwa">
      {/* Full width slanted container - Hidden on mobile */}
      <div className="hidden lg:block absolute inset-0 w-full h-full bg-surface-dark/30" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }}></div>
      {/* Mobile background - Straight */}
      <div className="block lg:hidden absolute inset-0 w-full h-full bg-surface-dark/30"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-12">
        <div className="rounded-3xl bg-surface-dark border border-surface-border p-8 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <div>
              <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Progressive Web App</span>
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">Native Power, <br />No Download Required.</h2>
            </div>
            <p className="text-lg text-gray-400">
              Enjoy a seamless, app-like experience directly from your browser. Install TASKWISE to your home screen for instant access without the app store clutter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background-dark border border-surface-border w-full sm:w-auto">
                <span className="material-symbols-outlined text-primary text-3xl">offline_bolt</span>
                <div>
                  <h4 className="font-bold text-white">Offline Mode</h4>    
                  <p className="text-xs text-gray-500">Works without internet</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background-dark border border-surface-border w-full sm:w-auto">
                <span className="material-symbols-outlined text-primary text-3xl">devices</span>
                <div>
                  <h4 className="font-bold text-white">Cross Platform</h4>
                  <p className="text-xs text-gray-500">iOS, Android, Desktop</p>
                </div>
              </div>
            </div>
            <button className="flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors">
              Learn how to install
            </button>
          </div>
          <div className="flex-1 w-full max-w-md lg:max-w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-surface-border group h-full min-h-[300px] lg:min-h-[400px] flex items-center justify-center bg-gray-900">
              {/* Spotlight Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-gray-900 to-gray-900"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent opacity-50"></div>
              
              {/* App Icon with Glow */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"></div>
                  <img 
                    src="/Taskwise-icon.png" 
                    alt="Taskwise App Icon" 
                    className="relative z-10 w-24 h-24 lg:w-32 lg:h-32 object-contain drop-shadow-[0_0_30px_rgba(30,201,210,0.6)] transform group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-background-dark/90 backdrop-blur border border-surface-border rounded-lg p-4 flex items-center gap-4 max-w-xs shadow-xl transform group-hover:scale-105 transition-transform">
                  <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-background-dark">add_to_home_screen</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Add to Home Screen</p>
                    <p className="text-gray-400 text-xs">Tap share, then add to home</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PWASection;
