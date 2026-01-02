import React from 'react';

const MobileShowcase = () => {
  return (
    <section className="py-20 bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Designed for your thumb</h2>
          <p className="text-gray-400 mt-2">Mobile-first interactions that feel magical.</p>
        </div>
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory px-4 lg:justify-center">
          {/* Card 1 */}
          <div className="snap-center shrink-0 w-[280px] flex flex-col gap-4">
            <div className="w-full aspect-[9/16] rounded-2xl bg-surface-dark border border-surface-border overflow-hidden relative group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Mobile app screen showing calendar view" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWbLZNZuAoDaKoMWMpE_2KTihM69sdPLq_HvBucLR24l_edjUXRfiQMa_ETMpMadKbLrbVx3sks5LE3Dp5BAE59VKfu9bT0cGL8Pm8D3zl3llTgNMStNyH9OUGbWr75UXHasDEuBlq2Fa6ab2Mcs-hOL5nZYbOwsjKVGYtoAhoR9Uot3ZGF2GcQu75ILBoROY1zB9uOrmRxvutPjW1_b5219pztVVRLbWF2-GfD33XHIJ9GnEK3O3gSGjO-90FvevQAhs7vNBiDASc')" }}>
                <div className="absolute inset-0 bg-background-dark/30"></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background-dark to-transparent">
                <span className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-2 shadow-lg">
                  <span className="material-symbols-outlined text-background-dark">calendar_month</span>
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Smart Schedule</h3>
              <p className="text-gray-500 text-sm">Drag and drop to replan instantly.</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="snap-center shrink-0 w-[280px] flex flex-col gap-4">
            <div className="w-full aspect-[9/16] rounded-2xl bg-surface-dark border border-surface-border overflow-hidden relative group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Mobile app screen showing chat interface" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYhAVBBnnnnLWliJ6pNoBwVVJHpKr428I6xzNg1pTBXcPixAf7gvxfE4pBOu4U76-M1OCZrNiZQjXCxU6ORbLsSuak9maTNU0Dph3bT346TCfNrccsycMOHTAqwH3ueiq8E_wqtqAQWyH44n1-b63dOC-TMfsXDiODvHTzXaa05RhrAWyjrdyIK8Eyh44XENm-C9HXxgrx5cKRz3Z3pkaP2TJ0BCWp5kLo5WpsUDtxNUQ_omlgzARf0Yj3wjvZJ2TcFQtuErbjFgo4')" }}>
                <div className="absolute inset-0 bg-background-dark/30"></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background-dark to-transparent">
                <span className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-2 shadow-lg">
                  <span className="material-symbols-outlined text-background-dark">smart_toy</span>
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">AI Assistant</h3>
              <p className="text-gray-500 text-sm">Always there to help you prioritize.</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="snap-center shrink-0 w-[280px] flex flex-col gap-4">
            <div className="w-full aspect-[9/16] rounded-2xl bg-surface-dark border border-surface-border overflow-hidden relative group">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" data-alt="Mobile app screen showing dark mode settings" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDipKlh0MqjEH-d9_wkCLb1NQWPEFd2hCfi6PSLmE-poysP4EJSxGpIE3AfPOZ7KlfW4UZSB1uj_mw3vp-fxrDv1rC3UXJ1jHij04GKuBahmnU9wulxZm1Ub53l_wVJUpU11nArDIfHIJDWeZGeKloQu16CEySwvubFHaKB77JbeOjhYQuIBCI8apDdQkYGBS7TYNo61EeJf1Lv1ldDlIU3akj5jkGHgrwUOKtSv01Le2f74iOsPw7ma1v4Z-DkEIoXr7lRs-n0noDX')" }}>
                <div className="absolute inset-0 bg-background-dark/30"></div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background-dark to-transparent">
                <span className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mb-2 shadow-lg">
                  <span className="material-symbols-outlined text-background-dark">dark_mode</span>
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">True Dark Mode</h3>
              <p className="text-gray-500 text-sm">Easy on the eyes, day or night.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileShowcase;
