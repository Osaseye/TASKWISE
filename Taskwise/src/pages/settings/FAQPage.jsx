import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import MobileNavbar from '../../components/dashboard/MobileNavbar';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#293738] last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-medium text-white group-hover:text-primary transition-colors">{question}</span>
        <span className={`material-symbols-outlined text-text-subtle transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-text-subtle text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  const faqs = [
    {
      question: "How does the AI scheduling work?",
      answer: "Our AI analyzes your natural language input (e.g., 'Meeting with John tomorrow at 2pm') and automatically extracts the date, time, and recurrence logic. It then checks your existing schedule to prevent conflicts."
    },
    {
      question: "Can I sync with Google Calendar?",
      answer: "Not yet, but we are working on Google Calendar and Outlook integration for the next major release."
    },
    {
      question: "How do I reset my password?",
      answer: "You can change your password in the Settings > Security section. If you've forgotten it, use the 'Forgot Password' link on the login page."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption for all data in transit and at rest. Your personal information is never shared with third parties."
    }
  ];

  return (
    <div className="flex h-screen bg-[#111717] text-white overflow-hidden font-display">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col items-center bg-[#111717] pb-32 md:pb-0">
        <div className="w-full max-w-[1024px] px-8 py-8">
          <Breadcrumbs items={[{ label: 'Settings', path: '/settings' }, { label: 'Help Center' }]} />
          
          <div className="max-w-2xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-2">Help Center</h1>
            <p className="text-text-subtle mb-8 text-sm">Frequently asked questions and support resources.</p>
            
            <div className="bg-[#1c2a2b] border border-[#293738] rounded-xl px-6 py-2">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 text-center">
              <p className="text-white font-medium mb-2">Still need help?</p>
              <p className="text-text-subtle text-sm mb-4">Our support team is available 24/7 to assist you.</p>
              <a href="mailto:support@taskwise.com" className="inline-block bg-[#111717] text-white px-4 py-2 rounded-lg border border-[#293738] hover:border-primary transition-colors text-sm font-bold">Contact Support</a>
            </div>
          </div>
        </div>
      </main>
      <MobileNavbar />
    </div>
  );
};

export default FAQPage;
