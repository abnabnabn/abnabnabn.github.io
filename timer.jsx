
import React, { useState, useEffect } from 'react';
import { Play, Clock, Settings, Type, Monitor, X, MessageSquare } from 'lucide-react';

const MeetingTimer = () => {
  // State
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [targetTimeStr, setTargetTimeStr] = useState('');
  const [title, setTitle] = useState('Meeting Starting');
  const [footerMessage, setFooterMessage] = useState('');
  const [targetDate, setTargetDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [now, setNow] = useState(new Date());
  const [isOvertime, setIsOvertime] = useState(false);

  // Initialize default time to next 15 min interval for convenience
  useEffect(() => {
    const d = new Date();
    const minutes = d.getMinutes();
    const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
    d.setMinutes(nextQuarter);
    d.setSeconds(0);
    
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    setTargetTimeStr(`${hh}:${mm}`);
  }, []);

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);

      if (targetDate) {
        const diff = targetDate - currentTime;
        
        if (diff < 0) {
          setIsOvertime(true);
          setTimeLeft(Math.abs(diff));
        } else {
          setIsOvertime(false);
          setTimeLeft(diff);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Handlers
  const handleStart = (e) => {
    e.preventDefault();
    if (!targetTimeStr) return;

    const [hours, minutes] = targetTimeStr.split(':');
    const target = new Date();
    target.setHours(parseInt(hours));
    target.setMinutes(parseInt(minutes));
    target.setSeconds(0);
    
    setTargetDate(target);
    setIsConfiguring(false);
  };

  const handleStop = () => {
    setIsConfiguring(true);
    setTargetDate(null);
    setIsOvertime(false);
  };

  // Formatters
  const formatTimeLeft = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const formatTargetDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        
        {isConfiguring ? (
          /* Configuration Screen */
          <div className="w-full max-w-md animate-fade-in">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-4">
                  <Monitor size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-100">Meeting Timer</h1>
                <p className="text-slate-400 mt-2">Set up your waiting screen</p>
              </div>

              <form onSubmit={handleStart} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <Clock size={16} /> Target Time
                  </label>
                  <input
                    type="time"
                    required
                    value={targetTimeStr}
                    onChange={(e) => setTargetTimeStr(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-2xl font-mono text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <Type size={16} /> Display Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Weekly Sync"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} /> Footer Message (Optional)
                  </label>
                  <input
                    type="text"
                    value={footerMessage}
                    onChange={(e) => setFooterMessage(e.target.value)}
                    placeholder="e.g. Board link: http://..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-white placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                >
                  <Play size={20} /> Start Timer
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Countdown Screen */
          <div className="w-full h-full flex flex-col items-center justify-between max-w-6xl mx-auto animate-fade-in py-12">
            {/* Top Info Bar */}
            <div className="w-full px-8 flex justify-between items-center text-slate-400">
              <div className="flex items-center gap-2 text-sm font-medium tracking-wider uppercase bg-slate-800/40 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/30">
                <Clock size={14} />
                <span>Current Time: {now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <button 
                onClick={handleStop}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-300"
                title="Stop Timer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Content */}
            <div className="text-center relative flex-1 flex flex-col justify-center">
              {/* Status Pill */}
              <div className="mb-8 flex justify-center">
                <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase border backdrop-blur-md transition-colors duration-500 ${
                  isOvertime 
                    ? 'bg-red-500/20 border-red-500/30 text-red-200 animate-pulse' 
                    : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isOvertime ? 'bg-red-500' : 'bg-indigo-400'}`} />
                  {isOvertime ? 'Starting Now' : `Starts at ${formatTargetDisplay(targetDate)}`}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl px-4">
                {title}
              </h1>

              {/* Big Countdown Timer */}
              <div className={`font-mono font-bold tracking-tighter leading-none transition-colors duration-300 ${
                isOvertime 
                  ? 'text-red-500' 
                  : timeLeft < 60000 && timeLeft > 0 ? 'text-amber-400' : 'text-slate-100'
              }`}
              style={{ fontSize: 'clamp(6rem, 20vw, 14rem)' }}
              >
                 {isOvertime && '+'}
                 {formatTimeLeft(timeLeft)}
              </div>

              {/* Subtext */}
              <p className={`text-xl md:text-2xl mt-4 font-medium transition-colors ${
                isOvertime ? 'text-red-400/80' : 'text-slate-400'
              }`}>
                {isOvertime ? 'Meeting in progress' : 'until we begin'}
              </p>

            </div>

            {/* Footer Message */}
            {footerMessage && (
                <div className="w-full flex justify-center px-8 mt-8">
                    <div className="max-w-3xl text-center bg-slate-800/60 backdrop-blur-md border border-slate-700/50 px-8 py-4 rounded-2xl shadow-lg animate-fade-in">
                        <p className="text-xl md:text-2xl font-medium text-indigo-200 tracking-wide">
                            {footerMessage}
                        </p>
                    </div>
                </div>
            )}

            {/* Progress Bar (Visual cue only when not overtime) */}
            {!isOvertime && (
              <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-800/50">
                 <div className="h-full w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 animate-progress-slide" />
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-slide {
          animation: progress-slide 3s infinite linear;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MeetingTimer;
