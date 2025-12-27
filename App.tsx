import React, { useState, useEffect, useRef } from 'react';
import { Tab, Alarm, AppSettings, DEFAULT_SETTINGS } from './types';
import { ClockView } from './components/ClockView';
import { AlarmView } from './components/AlarmView';
import { TimerView } from './components/TimerView';
import { StopwatchView } from './components/StopwatchView';
import { SettingsView } from './components/SettingsView';
import { ClockIcon, AlarmIcon, TimerIcon, StopwatchIcon, CloseIcon, SettingsIcon } from './components/Icons';
import { t } from './utils/translations';
import { getThemeColors, getBackgroundClass } from './utils/theme';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CLOCK);
  
  // Data State
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('pixelclock-alarms');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pixelclock-settings');
    const parsed = saved ? JSON.parse(saved) : {};
    return { ...DEFAULT_SETTINGS, ...parsed };
  });

  // Timer State (Hoisted for persistence)
  const [timerState, setTimerState] = useState({
      timeLeft: 0,
      initialTime: 0,
      isRunning: false,
      inputMinutes: 5
  });
  const timerIntervalRef = useRef<number | null>(null);

  // App Logic State
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);

  const themeColors = getThemeColors(settings.theme);
  const bgClass = getBackgroundClass(settings.background);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('pixelclock-alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const settingsToSave = { ...settings, customSoundUrl: null, customSoundName: null };
    localStorage.setItem('pixelclock-settings', JSON.stringify(settingsToSave));
  }, [settings]);

  // --- Timer Logic ---
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerState(prev => {
            if (prev.timeLeft <= 1) {
                // Timer finished
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/936/936-preview.mp3');
                audio.play();
                return { ...prev, timeLeft: 0, isRunning: false };
            }
            return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
       if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
       if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  }, [timerState.isRunning]);

  const startTimer = (minutes: number) => {
      setTimerState(prev => {
          if (prev.timeLeft === 0) {
               const seconds = minutes * 60;
               return { ...prev, timeLeft: seconds, initialTime: seconds, isRunning: true };
          }
          return { ...prev, isRunning: true };
      });
  };

  const pauseTimer = () => setTimerState(prev => ({ ...prev, isRunning: false }));
  
  const resetTimer = () => {
      setTimerState(prev => ({ ...prev, isRunning: false, timeLeft: 0, initialTime: 0 }));
  };

  const setInputMinutes = (m: number) => setTimerState(prev => ({ ...prev, inputMinutes: m }));


  // --- Alarm Checker Logic ---
  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const currentSeconds = now.getSeconds();

      if (currentSeconds === 0) {
        alarms.forEach(alarm => {
          if (alarm.isActive && alarm.time === currentTime && !ringingAlarm) {
            triggerAlarm(alarm);
          }
        });
      }
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms, ringingAlarm]);

  const triggerAlarm = (alarm: Alarm) => {
    setRingingAlarm(alarm);
    const src = settings.customSoundUrl || 'https://assets.mixkit.co/active_storage/sfx/936/936-preview.mp3';
    
    if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.currentTime = settings.soundStartTime;
        audioRef.current.loop = true;
        
        if (settings.ascendingVolume) {
            audioRef.current.volume = 0;
            audioRef.current.play().catch(e => console.error("Play error", e));
            
            let vol = 0;
            volumeIntervalRef.current = window.setInterval(() => {
                if (audioRef.current && vol < 1) {
                    vol = Math.min(vol + 0.1, 1);
                    audioRef.current.volume = vol;
                }
            }, 1000);
        } else {
            audioRef.current.volume = 1;
            audioRef.current.play().catch(e => console.error("Play error", e));
        }
    }
  };

  const stopAlarm = () => {
    setRingingAlarm(null);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CLOCK: return <ClockView settings={settings} />;
      case Tab.ALARM: return <AlarmView alarms={alarms} setAlarms={setAlarms} settings={settings} />;
      case Tab.TIMER: return (
        <TimerView 
            settings={settings}
            timeLeft={timerState.timeLeft}
            initialTime={timerState.initialTime}
            isRunning={timerState.isRunning}
            inputMinutes={timerState.inputMinutes}
            startTimer={startTimer}
            pauseTimer={pauseTimer}
            resetTimer={resetTimer}
            setInputMinutes={setInputMinutes}
        />
      );
      case Tab.STOPWATCH: return <StopwatchView settings={settings} />;
      case Tab.SETTINGS: return <SettingsView settings={settings} updateSettings={updateSettings} />;
      default: return <ClockView settings={settings} />;
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-0 md:p-8 font-sans selection:bg-white/20 transition-colors duration-700 ${bgClass === 'bg-black' ? 'bg-zinc-950' : 'bg-black'}`}>
      
      <audio ref={audioRef} className="hidden" />

      <div className={`w-full h-screen md:h-[850px] md:w-[410px] ${bgClass} md:border-[8px] ${themeColors.isRgb ? 'border-rgb' : 'md:border-zinc-800'} md:rounded-[3.5rem] relative flex flex-col overflow-hidden shadow-2xl transition-all duration-500`}>
        
        {/* Dynamic Island */}
        <div className="hidden md:flex absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-zinc-950 rounded-b-xl z-20 justify-center items-center">
             <div className="w-16 h-4 bg-black rounded-full border border-zinc-900/50"></div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 pt-12 relative overflow-hidden z-10">
            {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-zinc-950/60 backdrop-blur-md border-t border-white/5 p-2 pb-6 md:pb-2 z-10">
          <ul className="flex justify-around items-center h-16">
            <NavItem 
              active={activeTab === Tab.CLOCK} 
              onClick={() => setActiveTab(Tab.CLOCK)} 
              icon={<ClockIcon />} 
              label={t('clock', settings.language)}
              settings={settings}
              themeColors={themeColors}
            />
            <NavItem 
              active={activeTab === Tab.ALARM} 
              onClick={() => setActiveTab(Tab.ALARM)} 
              icon={<AlarmIcon />} 
              label={t('alarm', settings.language)}
              settings={settings}
              themeColors={themeColors}
            />
            <NavItem 
              active={activeTab === Tab.TIMER} 
              onClick={() => setActiveTab(Tab.TIMER)} 
              icon={<TimerIcon />} 
              label={t('timer', settings.language)}
              settings={settings}
              themeColors={themeColors}
            />
            <NavItem 
              active={activeTab === Tab.STOPWATCH} 
              onClick={() => setActiveTab(Tab.STOPWATCH)} 
              icon={<StopwatchIcon />} 
              label={t('stopwatch', settings.language)}
              settings={settings}
              themeColors={themeColors}
            />
            <NavItem 
              active={activeTab === Tab.SETTINGS} 
              onClick={() => setActiveTab(Tab.SETTINGS)} 
              icon={<SettingsIcon />} 
              label={t('settings', settings.language)}
              settings={settings}
              themeColors={themeColors}
            />
          </ul>
        </nav>

        {/* Alarm Overlay */}
        {ringingAlarm && (
            <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center animate-in zoom-in-90 duration-300 ${themeColors.bg} bg-opacity-95 backdrop-blur-xl`}>
                <div className="animate-bounce mb-8">
                    <AlarmIcon className="w-24 h-24 text-white" />
                </div>
                <h1 className="text-6xl font-bold mb-4 tracking-tighter">{ringingAlarm.time}</h1>
                <p className="text-2xl text-white/80 mb-16">{ringingAlarm.label}</p>
                
                <button 
                    onClick={stopAlarm}
                    className="group relative flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-transform"
                >
                    <CloseIcon className="w-6 h-6" />
                    <span>{t('stopAlarm', settings.language)}</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

const NavItem = ({ active, onClick, icon, label, settings, themeColors }: any) => {
    // If RGB mode is active, the pill background is animate-rgb and icon is white.
    // If not RGB, pill uses theme lightBg and icon uses theme primary color.
    
    let containerClass = '';
    let iconClass = '';
    let textClass = '';

    if (active) {
        if (themeColors.isRgb) {
            containerClass = 'animate-rgb scale-110';
            iconClass = 'text-white drop-shadow-sm'; // Ensure icon stays white in RGB mode
            textClass = 'text-white font-bold text-shadow-sm'; // Text white with shadow
        } else {
            containerClass = `${themeColors.lightBg} scale-110`;
            iconClass = themeColors.primary;
            textClass = themeColors.primary;
        }
    } else {
        containerClass = '';
        iconClass = 'text-zinc-500';
        textClass = 'text-zinc-500';
    }

    return (
      <li className="flex-1">
        <button 
          onClick={onClick}
          className={`w-full flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300 group`}
        >
          <div className={`p-1.5 rounded-full transition-all duration-300 ${containerClass}`}>
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 transition-colors ${iconClass} group-hover:text-zinc-300` })}
          </div>
          <span className={`text-[10px] font-medium tracking-wide transition-colors ${textClass} group-hover:text-zinc-300`}>{label}</span>
        </button>
      </li>
    );
};