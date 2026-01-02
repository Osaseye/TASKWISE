import React from 'react';

const PWASection = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="pwa">
      <div className="absolute inset-0 bg-surface-dark/50 skew-y-3 transform origin-bottom-right scale-110 -z-10"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-surface-border group">
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-60 z-10"></div>
              {/* Abstract PWA representation */}
              <div className="w-full bg-center bg-cover bg-no-repeat aspect-video" data-alt="Abstract gradient illustration representing web app installation" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYaMtXJM-6zb6W2hBhF3grxwE6m6VXwjMR4269i5PTlmtt9oZpMMH3EneezqyyAeh27Cx4Z8jz_HVvM6BlFbREeuXVqOsRoEh7G0M8gDopCthOYAXOPo9KbCkZX0f-vmrappJXHeq_7-_tIirULaGUqG4xd4paYL-TaDR5yN-tCVF1MdHryfiHeySUGDNPNUy21QEVtSqccOAT4AGNvQmIEPtWpCvxQU87Kv_07dDFg-daYXHwIuCccVwJ-RBxKBnLvf0ALZUIH1TL")' }}></div>
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
