import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import AIAssistantButton from '../components/dashboard/AIAssistantButton';
import MobileNavbar from '../components/dashboard/MobileNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek'; 
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { addDays, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasks } from '../context/TaskContext';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
  const { tasks } = useTasks();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventData, setNewEventData] = useState({ title: '', type: 'medium', category: 'Work' });
  const [date, setDate] = useState(new Date()); // Start on Today
  const [view, setView] = useState('week');

  // Map tasks to calendar events
  useEffect(() => {
    const mappedEvents = tasks.map(task => {
      // Determine start date: prefer dueDate, fallback to createdAt, then today
      let startDate = new Date();
      if (task.dueDate) {
        startDate = new Date(task.dueDate);
      } else if (task.createdAt) {
        startDate = task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt);
      }

      let endDate = new Date(startDate);
      let isAllDay = true;

      // Check if task has specific time
      if (task.time && task.time.includes(':')) {
          isAllDay = false;
          const [h, m] = task.time.split(':');
          startDate.setHours(parseInt(h), parseInt(m), 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(startDate.getHours() + 1);
      } else if (startDate.getHours() !== 0 || startDate.getMinutes() !== 0) {
          // If the date object itself has time info (and it's not midnight)
          isAllDay = false;
          endDate = new Date(startDate);
          endDate.setHours(startDate.getHours() + 1);
      }

      return {
        id: task.id,
        title: task.title,
        start: startDate,
        end: endDate, 
        type: task.priority?.toLowerCase() || 'medium',
        allDay: isAllDay,
        recurrence: task.recurrence 
      };
    });
    setEvents(mappedEvents);
  }, [tasks]);

  // Mobile Calendar Logic
  const [mobileSelectedDate, setMobileSelectedDate] = useState(new Date());
  const scrollRef = useRef(null);

  // Generate 30 days around today for mobile view
  const mobileDates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i - 2));

  useEffect(() => {
    // Center the selected date on mount
    if (scrollRef.current) {
      const selectedIndex = mobileDates.findIndex(d => isSameDay(d, mobileSelectedDate));
      if (selectedIndex !== -1) {
        const itemWidth = 70; // Approx width of date item + gap
        const containerWidth = scrollRef.current.offsetWidth;
        scrollRef.current.scrollLeft = (selectedIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
      }
    }
  }, []);

  const mobileEvents = events.filter(event => isSameDay(event.start, mobileSelectedDate));

  const handleEventClick = (event) => {
    const timeString = `${format(event.start, 'h:mm')} - ${format(event.end, 'h:mm a')}`;
    setSelectedEvent({ ...event, time: timeString });
    setIsModalOpen(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    // Prevent selecting past dates/times
    if (start < new Date()) return;
    
    setNewEventData({ title: '', type: 'medium', category: 'Work', start, end });
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = () => {
    // In a real app, this would call addTask from TaskContext
    // For now, we just close the modal as we are focusing on empty state
    setIsCreateModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleEditEvent = () => {
    setNewEventData(selectedEvent);
    setIsModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleNavigate = (action) => {
    let newDate = new Date(date);
    if (action === 'TODAY') newDate = new Date();
    else if (action === 'PREV') {
        if (view === 'month') newDate.setMonth(newDate.getMonth() - 1);
        else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
        else newDate.setDate(newDate.getDate() - 1);
    } else if (action === 'NEXT') {
        if (view === 'month') newDate.setMonth(newDate.getMonth() + 1);
        else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
        else newDate.setDate(newDate.getDate() + 1);
    }
    setDate(newDate);
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: 'transparent',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };

    if (event.type === 'high') {
      style.borderLeft = '4px solid #ef4444';
      style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
      style.color = '#f87171';
    } else if (event.type === 'medium') {
      style.borderLeft = '4px solid #f59e0b';
      style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
      style.color = '#fbbf24';
    } else if (event.type === 'low') {
      style.borderLeft = '4px solid #1ec9d2';
      style.backgroundColor = 'rgba(30, 201, 210, 0.2)';
      style.color = '#1ec9d2';
    }

    return {
      style: style,
    };
  };

  const CustomEvent = ({ event }) => {
    return (
      <div className="custom-event-container h-full w-full p-1.5 flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-1">
          <span className="font-bold text-xs truncate leading-tight">{event.title}</span>
          {event.category && (
            <span className="custom-event-category text-[8px] uppercase tracking-wider opacity-75 bg-black/20 px-1 rounded-[2px]">{event.category}</span>
          )}
        </div>
        <div className="custom-event-time text-[10px] opacity-80 truncate flex items-center gap-1">
          <span className="material-symbols-outlined text-[10px]">schedule</span>
          {format(event.start, 'h:mm')} - {format(event.end, 'h:mm a')}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background-light dark:bg-background-dark text-[#111717] dark:text-white font-display overflow-hidden h-screen flex"
    >
      <style>{`
        .rbc-calendar { font-family: inherit; }
        .rbc-header { border-bottom: 1px solid #1a2324 !important; padding: 8px 0; font-size: 12px; font-weight: 500; color: #9eb6b7; text-transform: uppercase; }
        .rbc-day-bg { border-left: 1px solid #1a2324 !important; }
        .rbc-day-bg:hover { background-color: #1a2324; }
        .rbc-time-view { border: none !important; }
        .rbc-time-header { border-bottom: 1px solid #1a2324 !important; }
        .rbc-time-content { border-top: none !important; border-left: none !important; }
        .rbc-timeslot-group { border-bottom: 1px solid #1a2324 !important; min-height: 80px; }
        .rbc-time-gutter .rbc-timeslot-group { border-bottom: none !important; }
        .rbc-label { color: #5f7475; font-size: 12px; }
        .rbc-today { background-color: #151f20; }
        .rbc-event { border-radius: 4px; }
        .rbc-current-time-indicator { background-color: #1ec9d2; height: 2px; }
        .rbc-current-time-indicator::before { content: ''; display: block; width: 8px; height: 8px; background-color: #1ec9d2; border-radius: 50%; position: absolute; left: -4px; top: -3px; box-shadow: 0 0 5px rgba(30,201,210,0.8); }
        .rbc-time-column { border-left: 1px solid #1a2324 !important; border-right: none !important; }
        .rbc-day-slot { border-left: 1px solid #1a2324 !important; border-right: none !important; }
        .rbc-time-gutter { border-right: 1px solid #1a2324 !important; }
        .rbc-header + .rbc-header { border-left: 1px solid #1a2324 !important; }
        .rbc-allday-cell { display: none !important; }
        .rbc-time-slot { border-top: 1px solid #1a2324 !important; }
        .rbc-month-view { border: 1px solid #1a2324 !important; }
        .rbc-month-row + .rbc-month-row { border-top: 1px solid #1a2324 !important; }
        .rbc-off-range-bg { background-color: #161e1f !important; } 
        .rbc-today { background-color: #151f20 !important; }
        .rbc-today .rbc-button-link { 
          background-color: #1ec9d2; 
          color: #111717; 
          border-radius: 50%; 
          width: 24px; 
          height: 24px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 4px auto;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #111717; }
        ::-webkit-scrollbar-thumb { background: #293738; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #5f7475; }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        /* Month View Specifics */
        .rbc-month-view .rbc-event {
          padding: 0 !important;
          min-height: 0 !important;
        }
        .rbc-month-view .custom-event-container {
          padding: 2px 4px !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 4px !important;
        }
        .rbc-month-view .custom-event-time {
          display: none !important;
        }
        .rbc-month-view .custom-event-category {
          display: none !important;
        }
        
        /* Popup Styling */
        .rbc-overlay {
          background-color: #161e1f !important;
          border: 1px solid #293738 !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
          padding: 8px !important;
          z-index: 100 !important;
        }
        .rbc-overlay-header {
          border-bottom: 1px solid #293738 !important;
          margin-bottom: 8px !important;
          padding-bottom: 4px !important;
          color: #white !important;
          font-weight: bold !important;
        }
      `}</style>
      <Sidebar />
      
      {/* Main Content */}
      <main 
        className="flex-1 flex flex-col h-full overflow-hidden relative"
      >
        {/* Mobile View */}
        <div className="md:hidden flex flex-col h-full bg-background-dark relative">
            {/* Header Section */}
            <header className="flex flex-col px-6 pt-6 pb-4 bg-background-dark z-10 sticky top-0">
                {/* NLP Input */}
                <div className="mb-6 relative z-40">
                    <div className="bg-[#1A2627] border border-gray-700/50 shadow-lg rounded-2xl p-1.5 flex items-center gap-2 backdrop-blur-md">
                        <button className="size-10 rounded-xl bg-[#293738] flex items-center justify-center text-primary shrink-0 hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </button>
                        <input className="flex-1 bg-transparent border-none focus:ring-0 outline-none focus:outline-none text-white placeholder-[#9eb6b7] text-sm h-10 px-2" placeholder="Ask AI or Add Task..." type="text"/>
                        <button className="size-10 rounded-xl bg-primary text-background-dark font-bold flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined">arrow_upward</span>
                        </button>
                    </div>
                </div>

                {/* Month Selector */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setMobileSelectedDate(subMonths(mobileSelectedDate, 1))} className="text-[#9eb6b7] hover:text-white p-1">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-white text-2xl font-bold">{format(mobileSelectedDate, 'MMMM yyyy')}</h1>
                        <button onClick={() => setMobileSelectedDate(addMonths(mobileSelectedDate, 1))} className="text-[#9eb6b7] hover:text-white p-1">
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                    <div className="flex bg-[#293738] rounded-lg p-0.5">
                        <button 
                            onClick={() => setMobileSelectedDate(addDays(mobileSelectedDate, -1))}
                            className="p-1.5 hover:bg-white/10 rounded-md text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                        </button>
                        <button 
                            onClick={() => setMobileSelectedDate(new Date())}
                            className="px-3 py-1 text-xs font-medium text-white"
                        >
                            Today
                        </button>
                        <button 
                            onClick={() => setMobileSelectedDate(addDays(mobileSelectedDate, 1))}
                            className="p-1.5 hover:bg-white/10 rounded-md text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Week Strip (Chips) */}
                <div 
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 snap-x"
                >
                    {mobileDates.map((d, i) => {
                        const isSelected = isSameDay(d, mobileSelectedDate);
                        return (
                            <div 
                                key={i}
                                onClick={() => setMobileSelectedDate(d)}
                                className={`flex flex-col min-w-[64px] h-[84px] shrink-0 items-center justify-center gap-1 rounded-2xl snap-start border transition-all cursor-pointer ${
                                    isSelected 
                                        ? 'bg-primary shadow-[0_0_20px_rgba(30,201,210,0.3)] border-transparent' 
                                        : 'bg-[#293738] border-transparent'
                                }`}
                            >
                                <p className={`text-xs font-medium ${isSelected ? 'text-background-dark' : 'text-[#9eb6b7]'}`}>{format(d, 'EEE')}</p>
                                <p className={`text-lg font-black ${isSelected ? 'text-background-dark' : 'text-white'}`}>{format(d, 'd')}</p>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-background-dark mt-1"></div>}
                            </div>
                        );
                    })}
                </div>
            </header>

            {/* Main Timeline Content */}
            <main className="flex-1 overflow-y-auto relative px-6 pb-40">
                {/* Timeline Grid */}
                <div className="grid grid-cols-[50px_1fr] gap-x-4">
                    {Array.from({ length: 24 }, (_, i) => i).map(hour => {
                        const hourEvents = mobileEvents.filter(event => event.start.getHours() === hour);
                        const now = new Date();
                        const isCurrentHour = isToday(mobileSelectedDate) && now.getHours() === hour;

                        return (
                            <React.Fragment key={hour}>
                                <div className="pt-2 text-right">
                                    <span className={`text-xs font-medium ${isCurrentHour ? 'text-primary font-bold' : 'text-[#9eb6b7]'}`}>
                                        {format(new Date().setHours(hour, 0), 'HH:mm')}
                                    </span>
                                </div>
                                <div 
                                    className="min-h-[60px] border-b border-[#293738]/50 relative py-1"
                                    onClick={() => handleSelectSlot({ 
                                        start: new Date(new Date(mobileSelectedDate).setHours(hour, 0)), 
                                        end: new Date(new Date(mobileSelectedDate).setHours(hour + 1, 0)) 
                                    })}
                                >
                                    {isCurrentHour && (
                                        <div 
                                            className="absolute w-full h-[1px] bg-primary z-10 flex items-center"
                                            style={{ top: `${(now.getMinutes() / 60) * 100}%` }}
                                        >
                                            <div className="size-2 bg-primary rounded-full -ml-1.5 shadow-[0_0_8px_rgba(30,201,210,0.8)]"></div>
                                        </div>
                                    )}
                                    {hourEvents.map(event => (
                                        <div 
                                            key={event.id}
                                            onClick={() => handleEventClick(event)}
                                            className={`w-full transition-colors border-l-[3px] rounded-r-xl rounded-l-sm p-3 cursor-pointer group mb-2 relative z-20 ${
                                                event.type === 'high' ? 'bg-red-900/20 hover:bg-red-900/30 border-red-500' :
                                                event.type === 'medium' ? 'bg-amber-900/20 hover:bg-amber-900/30 border-amber-500' :
                                                'bg-[#293738] hover:bg-[#293738]/80 border-primary'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-white text-sm font-semibold">{event.title}</h3>
                                                <span className="material-symbols-outlined text-[#9eb6b7] text-[16px] group-hover:text-primary">more_horiz</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#9eb6b7] text-xs">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {format(event.start, 'hh:mm')} - {format(event.end, 'hh:mm a')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </main>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-col h-full overflow-hidden">
        {/* Header Section */}
        <header className="bg-background-dark border-b border-[#293738] p-4 pb-0 z-20">
          {/* Top Row: NLP Search & Actions */}
          <div className="flex items-center justify-between gap-6 mb-4">
            <div className="flex-1 max-w-2xl mx-auto w-full relative group">
              {/* NLP Input */}
              <div className="flex w-full items-stretch rounded-full h-12 bg-surface-dark border border-[#293738] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-md">
                <div className="text-primary flex items-center justify-center pl-4 pr-2">
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <input 
                  className="w-full bg-transparent border-none text-white placeholder-[#5f7475] focus:ring-0 text-sm h-full outline-none" 
                  placeholder="Ask AI to 'Schedule a design review for next Tuesday at 2pm'..."
                />
                <button className="text-[#9eb6b7] hover:text-white flex items-center justify-center pr-4 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom Row: Calendar Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleNavigate('PREV')}
                  className="p-1 hover:bg-[#293738] rounded-full text-[#9eb6b7] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
                <h2 className="text-white text-2xl font-bold tracking-tight px-2">
                  {format(date, 'MMMM yyyy')}
                </h2>
                <button 
                  onClick={() => handleNavigate('NEXT')}
                  className="p-1 hover:bg-[#293738] rounded-full text-[#9eb6b7] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </button>
              </div>
              <button 
                onClick={() => handleNavigate('TODAY')}
                className="px-4 py-1.5 text-sm font-medium text-white bg-surface-dark border border-[#293738] rounded-md hover:bg-[#293738] transition-colors"
              >
                Today
              </button>
            </div>
            <div className="flex bg-surface-dark p-1 rounded-lg border border-[#293738]">
              <button 
                onClick={() => setView('month')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'month' ? 'bg-background-dark text-white shadow-sm border border-[#293738]' : 'text-[#9eb6b7] hover:text-white'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'week' ? 'bg-background-dark text-white shadow-sm border border-[#293738]' : 'text-[#9eb6b7] hover:text-white'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setView('day')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'day' ? 'bg-background-dark text-white shadow-sm border border-[#293738]' : 'text-[#9eb6b7] hover:text-white'}`}
              >
                Day
              </button>
            </div>
          </div>
        </header>

        {/* Calendar Component */}
        <div className="flex-1 relative bg-background-dark min-h-0">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            toolbar={false}
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent,
            }}
            step={60}
            timeslots={1}
            selectable
            popup
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventClick}
          />
        </div>
        </div> {/* End Desktop View */}
        
        <MobileNavbar />

        {/* Task Details Modal */}
        <AnimatePresence>
          {isModalOpen && selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-dark border border-[#293738] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col w-full max-w-md"
              >
                {/* Modal Header */}
                <div className="p-6 pb-0 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl h-fit ${
                      selectedEvent.type === 'high' ? 'bg-[#ef4444]/20 text-[#ef4444]' :
                      selectedEvent.type === 'medium' ? 'bg-[#f59e0b]/20 text-[#fbbf24]' :
                      'bg-[#1ec9d2]/20 text-[#1ec9d2]'
                    }`}>
                      <span className="material-symbols-outlined text-xl">
                        {selectedEvent.type === 'high' ? 'priority_high' :
                         selectedEvent.type === 'medium' ? 'remove' : 'low_priority'}
                      </span>
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${
                        selectedEvent.type === 'high' ? 'text-[#ef4444]' :
                        selectedEvent.type === 'medium' ? 'text-[#fbbf24]' :
                        'text-[#1ec9d2]'
                      }`}>
                        {selectedEvent.type === 'high' ? 'High Priority' :
                         selectedEvent.type === 'medium' ? 'Medium Priority' : 'Low Priority'}
                      </span>
                      <h3 className="text-white text-xl font-bold leading-tight">{selectedEvent.title}</h3>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-[#5f7475] hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Date & Time */}
                  <div className="flex items-center gap-6 text-[#9eb6b7]">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                        <span className="text-sm font-medium text-white">{format(selectedEvent.start, 'EEE, MMM d')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">schedule</span>
                        <span className="text-sm font-medium text-white">{selectedEvent.time}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-[10px] font-bold text-[#5f7475] uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-sm text-[#9eb6b7] leading-relaxed">
                      Reviewing the Q4 marketing assets and the new landing page wireframes with the product team.
                    </p>
                  </div>
                  
                  {/* AI Suggestions */}
                  <div className="bg-[#111717] rounded-xl p-4 border border-[#293738]">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Suggestions</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[#5f7475] text-sm mt-0.5">check_circle</span>
                            <span className="text-sm text-white">Prepare Figma prototype link</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[#5f7475] text-sm mt-0.5">check_circle</span>
                            <span className="text-sm text-white">Send meeting agenda to attendees</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 px-6 border-t border-[#293738] flex justify-between items-center bg-[#161e1f]">
                  <div className="flex -space-x-2">
                      <img src="https://i.pravatar.cc/150?u=1" alt="User" className="w-8 h-8 rounded-full border-2 border-[#161e1f]" />
                      <img src="https://i.pravatar.cc/150?u=2" alt="User" className="w-8 h-8 rounded-full border-2 border-[#161e1f]" />
                      <div className="w-8 h-8 rounded-full border-2 border-[#161e1f] bg-[#293738] flex items-center justify-center text-xs text-white font-medium">+3</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleDeleteEvent}
                      className="text-[#ef4444] hover:text-[#f87171] transition-colors p-2 rounded-lg hover:bg-[#ef4444]/10"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                    <button 
                      onClick={handleEditEvent}
                      className="text-primary hover:text-primary-dark transition-colors p-2 rounded-lg hover:bg-primary/10"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Event Modal */}
        <AnimatePresence>
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-dark border border-[#293738] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col w-full max-w-md"
              >
                <div className="p-4 border-b border-[#293738] flex justify-between items-center bg-surface-hover/50">
                  <h3 className="text-white text-lg font-bold">Create New Event</h3>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-[#9eb6b7] hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5f7475] uppercase mb-1">Event Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-background-dark border border-[#293738] rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="e.g., Team Sync"
                      value={newEventData.title}
                      onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#5f7475] uppercase mb-1">Date</label>
                    <div className="text-white text-sm bg-background-dark border border-[#293738] rounded-lg px-3 py-2">
                      {newEventData.start && format(newEventData.start, 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#5f7475] uppercase mb-1">Start Time</label>
                      <div className="text-white text-sm bg-background-dark border border-[#293738] rounded-lg px-3 py-2">
                        {newEventData.start && format(newEventData.start, 'h:mm a')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5f7475] uppercase mb-1">End Time</label>
                      <div className="text-white text-sm bg-background-dark border border-[#293738] rounded-lg px-3 py-2">
                        {newEventData.end && format(newEventData.end, 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5f7475] uppercase mb-1">Category</label>
                    <input 
                      type="text" 
                      className="w-full bg-background-dark border border-[#293738] rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="e.g., Work, Personal, Meeting"
                      value={newEventData.category || ''}
                      onChange={(e) => setNewEventData({...newEventData, category: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5f7475] uppercase mb-1">Priority</label>
                    <div className="flex gap-2">
                      {['high', 'medium', 'low'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setNewEventData({...newEventData, type})}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase border transition-all ${
                            newEventData.type === type 
                              ? type === 'high' ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]' 
                              : type === 'medium' ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fbbf24]'
                              : 'bg-[#1ec9d2]/20 border-[#1ec9d2] text-[#1ec9d2]'
                              : 'bg-transparent border-[#293738] text-[#5f7475] hover:border-[#5f7475]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[#293738] flex justify-end gap-3 bg-surface-hover/30">
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[#9eb6b7] hover:text-white hover:bg-[#293738] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateEvent}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-[#111717] hover:bg-primary-hover transition-colors shadow-[0_0_15px_rgba(30,201,210,0.3)]"
                  >
                    Create Event
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
      <AIAssistantButton />
    </motion.div>
  );
};

export default CalendarPage;
