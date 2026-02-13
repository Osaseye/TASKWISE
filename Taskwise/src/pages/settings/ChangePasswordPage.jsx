import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';

const ChangePasswordPage = () => {
  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUserPassword(passwords.new);
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setTimeout(() => navigate('/settings'), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password. Please log out and back in.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717] pb-32 md:pb-0">
        <div className="w-full max-w-[1024px] px-8 py-8">
          <Breadcrumbs items={[{ label: 'Settings', path: '/settings' }, { label: 'Change Password' }]} />
          
          <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6">Change Password</h1>
            
            {message.text && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-subtle mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-subtle mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-primary text-[#112021] font-bold py-3 rounded-lg hover:bg-[#1bc0c8] transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
};

export default ChangePasswordPage;
