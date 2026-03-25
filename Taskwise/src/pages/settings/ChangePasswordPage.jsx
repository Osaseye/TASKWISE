import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const ChangePasswordPage = () => {
  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (data.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(data.newPassword);
      toast.success('Password updated successfully');
      setTimeout(() => navigate('/settings'), 1000);
    } catch {
      toast.error('Failed to update password. Please log out and back in.');
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-subtle mb-1.5">New Password</label>
                <input
                  type="password"
                  {...register('newPassword', { required: true })}
                  className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                />
                {errors.newPassword && <span className="text-red-500 text-xs">New Password is required</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-subtle mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', { required: true })}
                  className="w-full bg-[#1c2a2b] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                />
                {errors.confirmPassword && <span className="text-red-500 text-xs">Confirm Password is required</span>}
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