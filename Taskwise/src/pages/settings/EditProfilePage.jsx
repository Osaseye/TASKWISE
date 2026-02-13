import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

const EditProfilePage = () => {
  const { userProfile, updateUserProfile } = useUser();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    workStyle: 'Balanced',
    goals: [],
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || currentUser?.displayName || '',
        role: userProfile.role || '',
        workStyle: userProfile.workStyle || 'Balanced',
        goals: userProfile.goals || [],
        avatar: null
      });
      setAvatarPreview(userProfile.photoURL || currentUser?.photoURL || null);
    }
  }, [userProfile, currentUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({ ...prev, avatar: reader.result })); // Storing base64 for now
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, upload avatar to storage here and get URL
      const updates = {
        name: formData.name,
        role: formData.role,
        workStyle: formData.workStyle,
        goals: formData.goals,
        ...(formData.avatar && { photoURL: formData.avatar }) // Saving base64 directly to profile (not ideal prod but works for demo)
      };
      
      await updateUserProfile(updates);
      navigate('/profile');
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoal = (goal) => {
    setFormData(prev => {
      const goals = prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals };
    });
  };

  const availableGoals = ['Productivity', 'Health', 'Learning', 'Career', 'Finance', 'Mindfulness'];

  return (
    <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717] pb-32 md:pb-0">
        <div className="w-full max-w-[1024px] px-8 py-8">
          <Breadcrumbs items={[{ label: 'Profile', path: '/profile' }, { label: 'Edit Profile' }]} />
          
          <div className="max-w-2xl mx-auto mt-6">
            <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="relative w-32 h-32 rounded-full bg-[#1c2a2b] border-4 border-[#293738] overflow-hidden group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-text-subtle">
                            {formData.name.charAt(0) || 'U'}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white">camera_alt</span>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary text-sm font-bold hover:underline">Change Photo</button>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-subtle mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-subtle mb-1.5">Role / Job Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="flex flex-col gap-4">
                <label className="block text-sm font-medium text-text-subtle">Work Style</label>
                <div className="grid grid-cols-3 gap-3">
                    {['Deep Work', 'Balanced', 'Collaborative'].map(style => (
                        <button
                            key={style}
                            type="button"
                            onClick={() => setFormData({...formData, workStyle: style})}
                            className={`px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                                formData.workStyle === style 
                                ? 'bg-primary/20 border-primary text-white' 
                                : 'bg-[#1c2a2b] border-[#293738] text-text-subtle hover:border-text-subtle'
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="block text-sm font-medium text-text-subtle">Focus Goals</label>
                <div className="flex flex-wrap gap-2">
                    {availableGoals.map(goal => (
                        <button
                            key={goal}
                            type="button"
                            onClick={() => toggleGoal(goal)}
                            className={`px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
                                formData.goals.includes(goal)
                                ? 'bg-primary text-[#112021] border-primary' 
                                : 'bg-transparent border-[#293738] text-text-subtle hover:border-text-subtle'
                            }`}
                        >
                            {goal}
                        </button>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="px-6 py-3 rounded-lg border border-[#293738] text-text-subtle font-bold hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-lg bg-primary text-[#112021] font-bold hover:bg-[#1bc0c8] transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
};

export default EditProfilePage;
