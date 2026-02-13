import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';
import MobileNavbar from '../components/dashboard/MobileNavbar';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

const ProfilePage = () => {
  const { userProfile, loading: userLoading } = useUser();
  const { currentUser } = useAuth();
  const { tasks } = useTasks();
  const [isLoading, setIsLoading] = useState(true);
  
  // Use profile data or fallbacks
  const user = {
    name: userProfile?.name || currentUser?.displayName || 'User',
    email: userProfile?.email || currentUser?.email || '',
    role: userProfile?.role || 'Not set',
    workStyle: userProfile?.workStyle || 'Not set',
    goals: userProfile?.goals || [],
    timezone: userProfile?.timezone || 'Not set',
    photoURL: userProfile?.photoURL || currentUser?.photoURL
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;

  useEffect(() => {
    if (!userLoading) {
      setIsLoading(false);
    }
  }, [userLoading]);

  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#293738">
      <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717] pb-32 md:pb-0">
          {/* Header Container */}
          <div className="w-full max-w-[1024px] px-8 md:px-12 lg:px-16 py-8 flex flex-col gap-8">
            
            {/* Page Heading */}
            <div className="flex flex-col gap-2 border-b border-[#293738] pb-6">
              <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Profile</h1>
              <p className="text-text-subtle text-base font-normal">Manage your personal identity and preferences.</p>
            </div>

            {/* Profile Header Card */}
            <div className="bg-surface-dark border border-border-dark rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              {/* Decorative background gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1ec9d2]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              {isLoading ? (
                <>
                  <Skeleton circle width={128} height={128} />
                  <div className="flex-1 flex flex-col items-center md:items-start gap-4 w-full">
                    <Skeleton width={200} height={32} />
                    <Skeleton width={250} height={20} />
                  </div>
                  <Skeleton width={140} height={48} borderRadius={8} />
                </>
              ) : (
                <>
                  <div className="relative group">
                    <div 
                      className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-[#112021] shadow-xl flex items-center justify-center bg-[#1c2a2b] text-4xl font-bold text-text-subtle" 
                      style={user.photoURL ? { backgroundImage: `url("${user.photoURL}")` } : {}}
                    >
                        {!user.photoURL && user.name.charAt(0)}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-[#112021]" title="Online"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center md:items-start gap-2 text-center md:text-left z-10">
                    <h2 className="text-white text-3xl font-bold tracking-tight">{user.name}</h2>
                    <p className="text-text-subtle text-lg">{user.email}</p>
                  </div>
                  
                  <Link 
                    to="/profile/edit"
                    className="z-10 flex items-center gap-2 bg-[#1ec9d2] hover:bg-[#1bbdc5] text-[#112021] px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-[#1ec9d2]/10"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                    <span>Edit Profile</span>
                  </Link>
                </>
              )}
            </div>

            {/* Stats / Identity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-4 h-[140px]">
                    <div className="flex justify-between items-start">
                      <Skeleton width={40} height={40} borderRadius={8} />
                    </div>
                    <div>
                      <Skeleton width={100} height={16} className="mb-2" />
                      <Skeleton width={60} height={32} />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {/* Stat 1: Tasks Completed */}
                  <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#293738] p-2 rounded-lg text-white group-hover:text-[#1ec9d2] transition-colors">
                        <span className="material-symbols-outlined">check_circle</span>
                      </div>
                      <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">All Time</span>
                    </div>
                      <p className="text-text-subtle text-sm font-medium">Tasks Completed</p>
                      <p className="text-white text-3xl font-bold mt-1">{completedTasksCount}</p>
                    </div>
                  
                  {/* Stat 2: Role (Identity) */}
                  <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#293738] p-2 rounded-lg text-white group-hover:text-[#1ec9d2] transition-colors">
                        <span className="material-symbols-outlined">badge</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-text-subtle text-sm font-medium">Role</p>
                      <p className="text-white text-2xl font-bold mt-1">{user.role}</p>
                    </div>
                  </div>
                  
                  {/* Stat 3: Work Style (Preferences) */}
                  <div className="bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#293738] p-2 rounded-lg text-white group-hover:text-[#1ec9d2] transition-colors">
                        <span className="material-symbols-outlined">timer</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-text-subtle text-sm font-medium">Work Style</p>
                      <p className="text-white text-2xl font-bold mt-1">{user.workStyle}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Detailed Info Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-white text-lg font-bold px-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Identity & Preferences
              </h2>
              
              <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {isLoading ? (
                  <>
                    <div className="p-6 border-b border-border-dark md:border-r">
                      <Skeleton width={80} height={12} className="mb-2" />
                      <Skeleton width={150} height={24} />
                    </div>
                    <div className="p-6 border-b border-border-dark">
                      <Skeleton width={100} height={12} className="mb-2" />
                      <Skeleton width={200} height={24} />
                    </div>
                    <div className="p-6 border-b border-border-dark md:border-b-0 md:border-r">
                      <Skeleton width={90} height={12} className="mb-2" />
                      <div className="flex gap-2">
                        <Skeleton width={80} height={24} borderRadius={999} />
                        <Skeleton width={80} height={24} borderRadius={999} />
                      </div>
                    </div>
                    <div className="p-6">
                      <Skeleton width={70} height={12} className="mb-2" />
                      <Skeleton width={120} height={24} />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Full Name */}
                    <div className="p-6 border-b border-border-dark md:border-r">
                      <p className="text-text-subtle text-xs font-medium uppercase tracking-wider mb-2">Full Name</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-base font-medium">{user.name}</p>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="p-6 border-b border-border-dark">
                      <p className="text-text-subtle text-xs font-medium uppercase tracking-wider mb-2">Email Address</p>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-text-subtle">mail</span>
                        <p className="text-white text-base font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* Goals */}
                    <div className="p-6 border-b border-border-dark md:border-b-0 md:border-r">
                      <p className="text-text-subtle text-xs font-medium uppercase tracking-wider mb-2">Primary Goals</p>
                      <div className="flex flex-wrap gap-2">
                        {user.goals.map((goal, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Timezone */}
                    <div className="p-6">
                      <p className="text-text-subtle text-xs font-medium uppercase tracking-wider mb-2">Timezone</p>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-text-subtle">schedule</span>
                        <p className="text-white text-base font-medium">{user.timezone}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-text-subtle pb-24">
              <p>Taskwise Profile • Last updated just now</p>
            </div>

          </div>
        </main>

        <MobileNavbar />
        <AIAssistantButton />
      </div>
    </SkeletonTheme>
  );
};

export default ProfilePage;
