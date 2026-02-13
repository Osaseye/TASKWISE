import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const ContactSupportPage = () => {
  const [formData, setFormData] = useState({ subject: '', description: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Logic to send to backend would accept here
  };

  return (
    <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717] pb-32 md:pb-0">
        <div className="w-full max-w-[1024px] px-8 py-8">
          <Breadcrumbs items={[{ label: 'Settings', path: '/settings' }, { label: 'Report a Bug' }]} />
          
          <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-2">Report a Bug</h1>
            <p className="text-text-subtle mb-6 text-sm">Found an issue? Let us know so we can fix it.</p>

            {submitted ? (
               <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center">
                 <span className="material-symbols-outlined text-4xl text-green-400 mb-2">check_circle</span>
                 <h3 className="text-xl font-bold text-white mb-2">Report Sent</h3>
                 <p className="text-text-subtle mb-6">Thanks for your feedback. We'll look into it shortly.</p>
                 <button onClick={() => setSubmitted(false)} className="text-primary hover:underline">Send another report</button>
               </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-[#1c2a2b] border border-[#293738] rounded-xl p-6 flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-subtle mb-1.5">Subject</label>
                    <input
                    type="text"
                    placeholder="e.g. Calendar not syncing"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[#111717] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-subtle mb-1.5">Description</label>
                    <textarea
                    rows={5}
                    placeholder="Please describe what happened..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#111717] border border-[#293738] rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none resize-none"
                    required
                    />
                </div>
                
                <button
                    type="submit"
                    className="mt-2 bg-primary text-[#112021] font-bold py-3 rounded-lg hover:bg-[#1bc0c8] transition-colors"
                >
                    Submit Report
                </button>
                </form>
            )}
          </div>
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
};

export default ContactSupportPage;
