import React from 'react';

const VisualDemo = () => {
  return (
    <section className="py-20 bg-surface-dark border-y border-surface-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">From Chaos to Clarity</h2>
          <p className="mt-4 text-lg text-gray-400">Don't worry about dates or folders. Just dump your thoughts, and TASKWISE structures everything for you.</p>
        </div>
        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center max-w-5xl mx-auto">
          {/* Input State */}
          <div className="rounded-2xl bg-background-dark p-6 border border-surface-border shadow-lg relative group">
            <div className="absolute -top-3 -left-3 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center border-4 border-surface-dark">
              <span className="material-symbols-outlined text-gray-300 text-sm">mic</span>
            </div>
            <p className="font-mono text-sm text-gray-400 mb-2">You say:</p>
            <div className="text-lg text-white font-medium italic">
              "Remind me to buy groceries for the party tomorrow at 5pm and email Sarah about the project deadline next Monday"
            </div>
          </div>
          {/* Arrow */}
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>
          {/* Output State */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-background-dark p-4 border-l-4 border-primary shadow-lg flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">shopping_cart</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Buy Groceries</h4>
                <p className="text-xs text-gray-400">Tomorrow, 5:00 PM • Shopping</p>
              </div>
            </div>
            <div className="rounded-xl bg-background-dark p-4 border-l-4 border-blue-500 shadow-lg flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Email Sarah</h4>
                <p className="text-xs text-gray-400">Next Mon, 9:00 AM • Work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualDemo;
