import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="relative py-32 overflow-hidden border-t border-surface-border">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/50 via-transparent to-background-dark"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-8 drop-shadow-lg">
          Ready to declutter your mind?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto h-14 px-10 rounded-xl bg-primary text-background-dark text-lg font-bold hover:bg-primary-dark transition-all shadow-[0_0_30px_-5px_rgba(30,201,210,0.4)] hover:scale-105 flex items-center justify-center">
            Get Started for Free
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-400 font-medium">No credit card required. Free plan available forever.</p>
      </div>
    </section>
  );
};

export default CTA;
