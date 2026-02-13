import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const ActiveSessionsPage = () => {
  const sessions = [
    { id: 1, device: 'Windows PC (Chrome)', location: 'Lagos, Nigeria', lastActive: 'Current Session', current: true },
    { id: 2, device: 'iPhone 13 (Safari)', location: 'Lagos, Nigeria', lastActive: '2 days ago', current: false },
    { id: 3, device: 'MacBook Pro (Firefox)', location: 'Abuja, Nigeria', lastActive: '1 week ago', current: false },
  ];

  return (
    <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717] pb-32 md:pb-0">
        <div className="w-full max-w-[1024px] px-8 py-8">
          <Breadcrumbs items={[{ label: 'Settings', path: '/settings' }, { label: 'Active Sessions' }]} />
          
          <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-2">Active Sessions</h1>
            <p className="text-text-subtle mb-6 text-sm">Manage devices where your account is currently logged in.</p>

            <div className="flex flex-col gap-4">
              {sessions.map(session => (
                <div key={session.id} className="bg-[#1c2a2b] border border-[#293738] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#111717] flex items-center justify-center">
                      <span className="material-symbols-outlined text-text-subtle">
                        {session.device.toLowerCase().includes('phone') ? 'smartphone' : 'computer'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{session.device}</p>
                      <p className="text-xs text-text-subtle">{session.location} • {session.lastActive}</p>
                    </div>
                  </div>
                  {session.current ? (
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded font-medium">Current</span>
                  ) : (
                    <button className="text-sm text-red-400 hover:text-red-300">Revoke</button>
                  )}
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full py-3 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium">
              Log Out of All Other Sessions
            </button>
          </div>
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
};

export default ActiveSessionsPage;
