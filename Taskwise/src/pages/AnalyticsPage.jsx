import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import Sidebar from '../components/dashboard/Sidebar';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTimeDetailsModal, setShowTimeDetailsModal] = useState(false);
  const [aiInsightDismissed, setAiInsightDismissed] = useState(false);

  // Mock Data for different time ranges
  const analyticsData = {
    today: {
      stats: {
        productivity: { value: 92, trend: '+5%', trendUp: true },
        completed: { value: 8, unit: 'tasks', trend: '+2', trendUp: true },
        completionRate: { value: '100%', sub: 'on time', trend: '+0%', trendUp: true },
        streak: { value: 5, unit: 'days', sub: 'Best: 12 days' }
      },
      chartData: [
        { name: '9 AM', completion: 20 },
        { name: '12 PM', completion: 45 },
        { name: '3 PM', completion: 70 },
        { name: '6 PM', completion: 85 },
        { name: '9 PM', completion: 100 },
      ],
      categories: [
        { name: 'Work Project', color: 'bg-blue-500', time: '4h 30m', percent: 60 },
        { name: 'Meetings', color: 'bg-orange-500', time: '2h 15m', percent: 30 },
        { name: 'Admin', color: 'bg-gray-500', time: '45m', percent: 10 },
      ],
      timeDistribution: [
        { name: 'Deep Work', value: 60, color: '#3b82f6' },
        { name: 'Meetings', value: 30, color: '#f97316' },
        { name: 'Breaks', value: 10, color: '#22c55e' },
      ],
      aiUsage: {
        interactions: 12,
        suggestionsApplied: 5,
        timeSaved: '45m',
        sentiment: 95
      }
    },
    week: {
      stats: {
        productivity: { value: 85, trend: '+12%', trendUp: true },
        completed: { value: 42, unit: 'tasks', trend: '+8%', trendUp: true },
        completionRate: { value: '92%', sub: 'on time', trend: '+5%', trendUp: true },
        streak: { value: 5, unit: 'days', sub: 'Best: 12 days' }
      },
      chartData: [
        { name: 'Mon', completion: 40 },
        { name: 'Tue', completion: 30 },
        { name: 'Wed', completion: 85 },
        { name: 'Thu', completion: 65 },
        { name: 'Fri', completion: 75 },
        { name: 'Sat', completion: 20 },
        { name: 'Sun', completion: 15 },
      ],
      categories: [
        { name: 'Work Project', color: 'bg-blue-500', time: '12h 30m', percent: 65 },
        { name: 'Personal Growth', color: 'bg-purple-500', time: '5h 15m', percent: 35 },
        { name: 'Health', color: 'bg-green-500', time: '3h 45m', percent: 20 },
      ],
      timeDistribution: [
        { name: 'Work', value: 35, color: '#3b82f6' },
        { name: 'Personal', value: 25, color: '#8b5cf6' },
        { name: 'Health', value: 20, color: '#22c55e' },
        { name: 'Learning', value: 20, color: '#f59e0b' },
      ],
      aiUsage: {
        interactions: 45,
        suggestionsApplied: 18,
        timeSaved: '3h 20m',
        sentiment: 88
      }
    },
    month: {
      stats: {
        productivity: { value: 78, trend: '-2%', trendUp: false },
        completed: { value: 156, unit: 'tasks', trend: '+15%', trendUp: true },
        completionRate: { value: '88%', sub: 'on time', trend: '-1%', trendUp: false },
        streak: { value: 12, unit: 'days', sub: 'Best: 12 days' }
      },
      chartData: [
        { name: 'Week 1', completion: 65 },
        { name: 'Week 2', completion: 75 },
        { name: 'Week 3', completion: 55 },
        { name: 'Week 4', completion: 82 },
      ],
      categories: [
        { name: 'Work Project', color: 'bg-blue-500', time: '45h 30m', percent: 55 },
        { name: 'Learning', color: 'bg-yellow-500', time: '20h 15m', percent: 25 },
        { name: 'Health', color: 'bg-green-500', time: '15h 45m', percent: 20 },
      ],
      timeDistribution: [
        { name: 'Work', value: 50, color: '#3b82f6' },
        { name: 'Personal', value: 20, color: '#8b5cf6' },
        { name: 'Health', value: 15, color: '#22c55e' },
        { name: 'Social', value: 15, color: '#ec4899' },
      ],
      aiUsage: {
        interactions: 180,
        suggestionsApplied: 65,
        timeSaved: '12h 45m',
        sentiment: 92
      }
    },
    custom: {
      stats: {
        productivity: { value: 82, trend: '--', trendUp: true },
        completed: { value: 24, unit: 'tasks', trend: '--', trendUp: true },
        completionRate: { value: '90%', sub: 'on time', trend: '--', trendUp: true },
        streak: { value: 5, unit: 'days', sub: 'Best: 12 days' }
      },
      chartData: [
        { name: 'Day 1', completion: 50 },
        { name: 'Day 2', completion: 60 },
        { name: 'Day 3', completion: 40 },
        { name: 'Day 4', completion: 70 },
        { name: 'Day 5', completion: 80 },
      ],
      categories: [
        { name: 'Custom Cat 1', color: 'bg-blue-500', time: '8h 00m', percent: 50 },
        { name: 'Custom Cat 2', color: 'bg-purple-500', time: '8h 00m', percent: 50 },
      ],
      timeDistribution: [
        { name: 'Category A', value: 50, color: '#3b82f6' },
        { name: 'Category B', value: 50, color: '#8b5cf6' },
      ],
      aiUsage: {
        interactions: 30,
        suggestionsApplied: 10,
        timeSaved: '2h 00m',
        sentiment: 90
      }
    }
  };

  const currentData = analyticsData[timeRange] || analyticsData.week;

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const confirmSchedule = () => {
    setShowScheduleModal(false);
    setAiInsightDismissed(true);
  };

  return (
    <div className="flex h-screen bg-background-dark overflow-hidden font-sans text-white selection:bg-primary/30 selection:text-primary-light">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-8 border-b border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-2xl font-heading font-semibold text-white">Analytics Overview</h1>
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-dark p-1 rounded-lg border border-border-dark">
              {['Today', 'Week', 'Month'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range.toLowerCase())}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    timeRange === range.toLowerCase()
                      ? 'bg-surface-dark-lighter text-white shadow-sm border border-border-dark/50'
                      : 'text-text-secondary hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
              <button 
                onClick={() => setShowCustomDateModal(true)}
                className="px-4 py-1.5 text-sm font-medium rounded-md text-text-secondary hover:text-white transition-colors flex items-center gap-1"
              >
                Custom <span className="material-symbols-outlined text-sm">calendar_today</span>
              </button>
            </div>
            <div className="h-6 w-px bg-border-dark mx-2"></div>
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/5"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export Report
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-grid-pattern">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Productivity Score */}
              <div className="bg-surface-dark rounded-xl p-5 border border-border-dark shadow-sm hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <span className="material-symbols-outlined">shutter_speed</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${currentData.stats.productivity.trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    <span className="material-symbols-outlined text-xs">{currentData.stats.productivity.trendUp ? 'trending_up' : 'trending_down'}</span> {currentData.stats.productivity.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-text-secondary text-sm font-medium">Productivity Score</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white font-heading">{currentData.stats.productivity.value}</span>
                    <span className="text-sm text-text-secondary mb-1">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="bg-surface-dark rounded-xl p-5 border border-border-dark shadow-sm hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined">check_box</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${currentData.stats.completed.trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    <span className="material-symbols-outlined text-xs">{currentData.stats.completed.trendUp ? 'trending_up' : 'trending_down'}</span> {currentData.stats.completed.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-text-secondary text-sm font-medium">Tasks Completed</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white font-heading">{currentData.stats.completed.value}</span>
                    <span className="text-sm text-text-secondary mb-1">{currentData.stats.completed.unit}</span>
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="bg-surface-dark rounded-xl p-5 border border-border-dark shadow-sm hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                    <span className="material-symbols-outlined">percent</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${currentData.stats.completionRate.trendUp ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    <span className="material-symbols-outlined text-xs">{currentData.stats.completionRate.trendUp ? 'trending_up' : 'trending_down'}</span> {currentData.stats.completionRate.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-text-secondary text-sm font-medium">Completion Rate</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white font-heading">{currentData.stats.completionRate.value}</span>
                    <span className="text-sm text-text-secondary mb-1">{currentData.stats.completionRate.sub}</span>
                  </div>
                </div>
              </div>

              {/* Current Streak */}
              <div className="bg-surface-dark rounded-xl p-5 border border-border-dark shadow-sm hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    <span className="material-symbols-outlined">local_fire_department</span>
                  </div>
                  <span className="text-xs font-medium text-text-secondary bg-surface-dark-lighter px-2 py-1 rounded-full">
                    {currentData.stats.streak.sub}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-text-secondary text-sm font-medium">Current Streak</span>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white font-heading">{currentData.stats.streak.value}</span>
                    <span className="text-sm text-text-secondary mb-1">{currentData.stats.streak.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Completion Trends */}
              <div className="lg:col-span-2 bg-surface-dark rounded-xl border border-border-dark p-6 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-lg font-heading font-semibold text-white">Task Completion Trends</h2>
                    <p className="text-sm text-text-secondary">Performance over time</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-dark-lighter rounded-md border border-border-dark/50">
                      <div className="size-2 rounded-full bg-primary"></div>
                      <span className="text-xs text-text-secondary">Completion</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentData.chartData}>
                      <defs>
                        <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1ec9d2" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#1ec9d2" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#293738" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A2627', borderColor: '#293738', color: '#fff' }}
                        itemStyle={{ color: '#1ec9d2' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completion" 
                        stroke="#1ec9d2" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorCompletion)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: AI & Categories */}
              <div className="flex flex-col gap-6">
                {/* TaskWise AI */}
                {!aiInsightDismissed && (
                  <div className="bg-gradient-to-br from-surface-dark-lighter to-[#111717] rounded-xl p-6 border border-primary/20 relative overflow-hidden group shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                      <span className="material-symbols-outlined text-8xl text-primary">auto_awesome</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 relative z-10">
                      <div className="p-1.5 rounded bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      </div>
                      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">TaskWise AI</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed relative z-10">
                      You've missed your <span className="text-white font-semibold">"Reading"</span> goal 3 days in a row. Based on your calendar, Tuesday evenings at 8 PM are usually free.
                    </p>
                    <div className="mt-4 flex gap-3 relative z-10">
                      <button 
                        onClick={handleSchedule}
                        className="px-3 py-1.5 bg-primary text-background-dark text-xs font-bold rounded hover:bg-primary-dark transition-colors"
                      >
                        Schedule for 8 PM
                      </button>
                      <button 
                        onClick={() => setAiInsightDismissed(true)}
                        className="px-3 py-1.5 bg-transparent border border-slate-600 text-slate-300 text-xs font-medium rounded hover:border-slate-400 hover:text-white transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Top Categories */}
                <div className="flex-1 bg-surface-dark rounded-xl border border-border-dark p-6 shadow-sm flex flex-col">
                  <h3 className="text-base font-heading font-semibold text-white mb-4">Top Categories</h3>
                  <div className="space-y-4 flex-1">
                    {currentData.categories.map((cat, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${cat.color}`}></div>
                            <span className="text-sm text-slate-300">{cat.name}</span>
                          </div>
                          <span className="text-sm font-medium text-white">{cat.time}</span>
                        </div>
                        <div className="w-full bg-surface-dark-lighter rounded-full h-1.5">
                          <div className={`${cat.color} h-1.5 rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowCategoriesModal(true)}
                    className="w-full mt-4 py-2 text-xs text-text-secondary hover:text-white border border-border-dark rounded hover:bg-surface-dark-lighter transition-colors"
                  >
                    View All Categories
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
              {/* Time Distribution (Replaced Active Goals) */}
              <div className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-heading font-semibold text-white">Time Distribution</h2>
                  <button 
                    onClick={() => setShowTimeDetailsModal(true)}
                    className="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    Details
                  </button>
                </div>
                <div className="flex items-center justify-center h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentData.timeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {currentData.timeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A2627', borderColor: '#293738', color: '#fff' }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ paddingLeft: "20px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Assistant Impact (Replaced Time by Tag) */}
              <div className="bg-surface-dark rounded-xl border border-border-dark p-6 shadow-sm overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-heading font-semibold text-white">AI Assistant Impact</h2>
                  <button className="size-8 flex items-center justify-center rounded hover:bg-surface-dark-lighter text-text-secondary transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background-dark p-4 rounded-lg border border-border-dark">
                      <div className="text-text-secondary text-xs font-medium mb-1">Total Interactions</div>
                      <div className="text-2xl font-bold text-white">{currentData.aiUsage.interactions}</div>
                    </div>
                    <div className="bg-background-dark p-4 rounded-lg border border-border-dark">
                      <div className="text-text-secondary text-xs font-medium mb-1">Time Saved</div>
                      <div className="text-2xl font-bold text-primary">{currentData.aiUsage.timeSaved}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Suggestions Applied</span>
                        <span className="text-sm font-medium text-white">{currentData.aiUsage.suggestionsApplied} / {currentData.aiUsage.interactions}</span>
                      </div>
                      <div className="w-full bg-surface-dark-lighter rounded-full h-2">
                        <div 
                          className="bg-accent-purple h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${(currentData.aiUsage.suggestionsApplied / currentData.aiUsage.interactions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Satisfaction Score</span>
                        <span className="text-sm font-medium text-white">{currentData.aiUsage.sentiment}%</span>
                      </div>
                      <div className="w-full bg-surface-dark-lighter rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${currentData.aiUsage.sentiment}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modals */}
        {showCustomDateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-xl w-96 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Select Custom Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Start Date</label>
                  <input type="date" className="w-full bg-background-dark border border-border-dark rounded-lg p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">End Date</label>
                  <input type="date" className="w-full bg-background-dark border border-border-dark rounded-lg p-2 text-white" />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setShowCustomDateModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-white">Cancel</button>
                  <button onClick={() => setShowCustomDateModal(false)} className="px-4 py-2 text-sm bg-primary text-background-dark font-bold rounded-lg">Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-xl w-96 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Export Report</h3>
              <p className="text-text-secondary text-sm mb-6">Choose the format you want to export your analytics report.</p>
              <div className="space-y-2">
                <button className="w-full p-3 flex items-center gap-3 bg-background-dark hover:bg-surface-dark-lighter border border-border-dark rounded-lg transition-colors text-left">
                  <span className="material-symbols-outlined text-red-400">picture_as_pdf</span>
                  <span className="text-white text-sm">Export as PDF</span>
                </button>
                <button className="w-full p-3 flex items-center gap-3 bg-background-dark hover:bg-surface-dark-lighter border border-border-dark rounded-lg transition-colors text-left">
                  <span className="material-symbols-outlined text-green-400">table_view</span>
                  <span className="text-white text-sm">Export as CSV</span>
                </button>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-white">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showCategoriesModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-xl w-[500px] shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">All Categories</h3>
                <button onClick={() => setShowCategoriesModal(false)} className="text-text-secondary hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {currentData.categories.map((cat, i) => (
                  <div key={i} className="p-2.5 bg-background-dark rounded-lg border border-border-dark">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`size-2.5 rounded-full ${cat.color}`}></div>
                        <span className="font-medium text-white text-sm truncate">{cat.name}</span>
                      </div>
                      <span className="text-xs text-text-secondary">{cat.time}</span>
                    </div>
                    <div className="w-full bg-surface-dark rounded-full h-1.5">
                      <div className={`${cat.color} h-1.5 rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-xl w-96 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">event</span>
                </div>
                <h3 className="text-lg font-bold text-white">Confirm Schedule</h3>
              </div>
              <p className="text-text-secondary text-sm mb-6">
                Are you sure you want to schedule <span className="text-white font-medium">"Reading"</span> for <span className="text-white font-medium">Tuesday at 8:00 PM</span>?
              </p>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowScheduleModal(false)} 
                  className="px-4 py-2 text-sm text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSchedule} 
                  className="px-4 py-2 text-sm bg-primary text-background-dark font-bold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {showTimeDetailsModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-xl w-[600px] shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Time Distribution Details</h3>
                <button onClick={() => setShowTimeDetailsModal(false)} className="text-text-secondary hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-text-secondary text-sm">
                  Here is a detailed breakdown of how you spent your time this week across different categories.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {currentData.timeDistribution.map((item, index) => (
                    <div key={index} className="bg-background-dark p-4 rounded-lg border border-border-dark flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{item.value}%</div>
                        <div className="text-xs text-text-secondary">of total time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <AIAssistantButton />
      </main>
    </div>
  );
};

export default AnalyticsPage;
