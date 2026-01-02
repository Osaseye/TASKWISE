import React from 'react';

const CTA = () => {
  return (
    <section className="py-24 bg-surface-dark border-t border-surface-border">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-8">
          Ready to declutter your mind?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto h-14 px-10 rounded-xl bg-primary text-background-dark text-lg font-bold hover:bg-primary-dark transition-all shadow-[0_0_30px_-5px_rgba(30,201,210,0.4)]">
            Get Started for Free
          </button>
          <button className="w-full sm:w-auto h-14 px-10 rounded-xl bg-transparent border border-gray-600 text-white text-lg font-bold hover:bg-white/5 transition-all">
            View Pricing
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500">No credit card required. Free plan available forever.</p>
      </div>
    </section>
  );
};

export default CTA;
