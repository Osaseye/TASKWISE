import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Morning Standup", time: "10:00 AM • Zoom", completed: false },
    { id: 2, title: "Review Q3 Roadmap", time: "1:00 PM • Office", completed: false },
  ]);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    // Animation sequence
    const sequence = async () => {
      // 1. Wait a bit
      await new Promise(r => setTimeout(r, 1500));
      
      // 2. Mark first task as completed
      setTasks(prev => prev.map(t => t.id === 1 ? { ...t, completed: true } : t));
      
      // 3. Wait
      await new Promise(r => setTimeout(r, 1500));
      
      // 4. Add a new task
      setTasks(prev => [
        ...prev, 
        { id: 3, title: "Client Call", time: "3:00 PM • Google Meet", completed: false }
      ]);
      
      // 5. Wait
      await new Promise(r => setTimeout(r, 1500));
      
      // 6. Show AI Suggestion
      setShowSuggestion(true);
    };

    sequence();
  }, []);

  return (
    <section className="relative pt-20 pb-6 lg:pt-8 lg:pb-8 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]"></div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Organize Life at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Speed of Thought</span>
            </h1>
            <p className="animate-fade-in-up delay-200 text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Meet TASKWISE. The AI planner that turns your messy, unstructured thoughts into actionable, organized plans instantly. No more manual entry.
            </p>
            <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button className="h-12 px-8 rounded-lg bg-primary text-background-dark font-bold text-base hover:bg-primary-dark transition-all shadow-[0_0_20px_-5px_rgba(30,201,210,0.3)]">
                Try for Free
              </button>
              <button className="h-12 px-8 rounded-lg bg-surface-dark border border-surface-border text-white font-bold text-base hover:bg-surface-border transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">install_mobile</span>
                Open Web App
              </button>
            </div>
            <div className="animate-fade-in-up delay-300 pt-6 hidden lg:flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-gray-600 bg-cover bg-center" data-alt="User avatar 1" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA41xEzDz6acvRVYDwe8xOx3GZPgSTK59AJ6V0YBDeIuFAWaQpUgqO0cSQy_ABxmKa6lCe09n0qZQI2Ug5-4H_Jc8NNvQY_pO_tk3kfmST-EUT1nhKqssKIlLNkx95anZ1rN0xVsA9UXOI0MyevTgvS9kPFobNXV-ZecjuExlXp4OfxqqDZVt3Lgzw_sntWGuvecwcam_A65zRZCa_hnp1yonyuoQJSyAFpL7JFu3AaNtbostxyjRm0wK1jz37jdtKG9re0oeyGxd1R')" }}></div>
                <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-gray-600 bg-cover bg-center" data-alt="User avatar 2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQOS9jk9yr0XpK7_Eln3Mq3JMHr1tmyQNofFxt0FBQ-wPWTlSP4Mi2gH-YD7SeoPa2VYLONdTTuuzeRimoAUA-JMdDLX7exEpFSt3RAWDmLgAuSOfHP8T0QHdsNlE-PLkxc7XF_eApNRNJ2hCoeifMeZXHTd34wcXxkrICuUIpVGtBGI72hSnBqOZNdteqx9diYXFx2yqStPXsruMumrMm6fUki5Q3Q1cMx8Jg6pOfl49sC-etT6CUqTf-d9tSt8V4jTZ2F_UlVf3l')" }}></div>
                <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-gray-600 bg-cover bg-center" data-alt="User avatar 3" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfop7nr9xZ1OfGEU-QGXaS-AIw1ShumHhg6oeo-XbyWlRz9izV0gsTiY3SYn9JxLUWCWEDU9JGgsgBkWLWJUKMmuIiaGLrmu0y-3h51dDgCyTOSQU5-bg_QS9VdN8yPYlAdOXD8xnq-WFmZ0U3CUFnPjWjtY5qD7FuELJvqGGA5JgIpkijDt24oxdbJisHDi5UKGCgdeLf8F7o9dw9VERfWQ5ZVBAg0OgBDDFc-CmKzg64fkzcKfwLCUlKS-oi3w6VxBgVy7y8KFxo')" }}></div>
              </div>
              <p>Trusted by 10,000+ planners</p>
            </div>
          </div>
          {/* Hero Visual / Mockup */}
          <div className="animate-fade-in-right delay-200 relative lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full max-w-[300px] h-[600px] border-8 border-gray-900 rounded-[3rem] bg-gray-900 shadow-2xl overflow-hidden z-20 mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              {/* Screen Content */}
              <div className="w-full h-full bg-surface-dark flex flex-col relative">
                <div className="absolute top-0 inset-x-0 h-6 bg-black z-30 rounded-b-xl mx-10"></div>
                {/* App Header */}
                <div className="pt-10 px-6 pb-4 flex justify-between items-center bg-background-dark">
                  <h3 className="text-white font-bold text-lg">Today</h3>
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-sm">account_circle</span>
                  </div>
                </div>
                {/* App Content */}
                <div className="flex-1 px-4 space-y-3 overflow-hidden bg-background-dark">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                      className={`p-4 rounded-xl bg-surface-dark border border-surface-border transition-all duration-500 cursor-pointer hover:border-primary/50 ${task.completed ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors duration-300 ${task.completed ? 'bg-primary border-primary' : 'border-primary/50'}`}>
                          {task.completed && <span className="material-symbols-outlined text-[14px] text-background-dark">check</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium text-white transition-all duration-300 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                          <p className="text-xs text-gray-500">{task.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* AI Suggestion */}
                  <div className={`mt-6 p-3 rounded-lg bg-primary/10 border border-primary/20 transition-all duration-700 transform ${showSuggestion ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex gap-2 items-start">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5 animate-pulse">auto_awesome</span>
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">AI Suggestion</p>
                        <p className="text-xs text-gray-300">It looks like you have a gap between 2 PM and 4 PM. Want to schedule "Deep Work"?</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating Action Button */}
                <div className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform cursor-pointer">
                  <span className="material-symbols-outlined text-2xl">add</span>
                </div>
              </div>
            </div>
            {/* Background Glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-[60px] -z-10"></div>
          </div>
          
          {/* Mobile Only: Trusted By Section (Moved after Visual Demo) */}
          <div className="animate-fade-in-up delay-300 pt-6 flex lg:hidden items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-gray-600 bg-cover bg-center" data-alt="User avatar 1" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA41xEzDz6acvRVYDwe8xOx3GZPgSTK59AJ6V0YBDeIuFAWaQpUgqO0cSQy_ABxmKa6lCe09n0qZQI2Ug5-4H_Jc8NNvQY_pO_tk3kfmST-EUT1nhKqssKIlLNkx95anZ1rN0xVsA9UXOI0MyevTgvS9kPFobNXV-ZecjuExlXp4OfxqqDZVt3Lgzw_sntWGuvecwcam_A65zRZCa_hnp1yonyuoQJSyAFpL7JFu3AaNtbostxyjRm0wK1jz37jdtKG9re0oeyGxd1R')" }}></div>
              <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-gray-600 bg-cover bg-center" data-alt="User avatar 2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQOS9jk9yr0XpK7_Eln3Mq3JMHr1tmyQNofFxt0FBQ-wPWTlSP4Mi2gH-YD7SeoPa2VYLONdTTuuzeRimoAUA-JMdDLX7exEpFSt3RAWDmLgAuSOfHP8T0QHdsNlE-PLkxc7XF_eApNRNJ2hCoeifMeZXHTd34wcXxkrICuUIpVGtBGI72hSnBqOZNdteqx9diYXFx2yqStPXsruMumrMm6fUki5Q3Q1cMx8Jg6pOfl49sC-etT6CUqTf-d9tSt8V4jTZ2F_UlVf3l')" }}></div>
              <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-gray-600 bg-cover bg-center" data-alt="User avatar 3" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfop7nr9xZ1OfGEU-QGXaS-AIw1ShumHhg6oeo-XbyWlRz9izV0gsTiY3SYn9JxLUWCWEDU9JGgsgBkWLWJUKMmuIiaGLrmu0y-3h51dDgCyTOSQU5-bg_QS9VdN8yPYlAdOXD8xnq-WFmZ0U3CUFnPjWjtY5qD7FuELJvqGGA5JgIpkijDt24oxdbJisHDi5UKGCgdeLf8F7o9dw9VERfWQ5ZVBAg0OgBDDFc-CmKzg64fkzcKfwLCUlKS-oi3w6VxBgVy7y8KFxo')" }}></div>
            </div>
            <p>Trusted by 10,000+ planners</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
