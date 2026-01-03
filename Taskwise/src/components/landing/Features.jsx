import React, { useEffect, useRef, useState } from 'react';
import { MdGraphicEq, MdChat, MdInsights } from 'react-icons/md';

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background-dark" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className={`text-3xl font-black tracking-tight text-white sm:text-4xl max-w-lg transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Intelligent Planning built for the modern era.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className={`group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-dark p-8 hover:border-primary/50 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MdGraphicEq className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Natural Language</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Speak or type naturally. We detect dates, times, and categories automatically. No more fiddling with date pickers.
            </p>
          </div>
          {/* Feature 2 */}
          <div className={`group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-dark p-8 hover:border-primary/50 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MdChat className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Conversational AI</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Need to reschedule your whole afternoon? Just ask your AI co-pilot to "move everything after 2pm to tomorrow morning."
            </p>
          </div>
          {/* Feature 3 */}
          <div className={`group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-dark p-8 hover:border-primary/50 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MdInsights className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Productivity Stats</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Visualize your momentum with beautiful teal graphs. Understand your peak productivity hours and task completion rates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
