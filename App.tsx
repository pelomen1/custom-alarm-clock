import React, { useState, useEffect, useRef } from 'react';
import { Tab, Alarm, AppSettings, DEFAULT_SETTINGS } from './types';
import { ClockView } from './components/ClockView';
import { AlarmView } from './components/AlarmView';
import { TimerView } from './components/TimerView';
import { StopwatchView } from './components/StopwatchView';
import { SettingsView } from './components/SettingsView';
import { InstallerView } from './components/InstallerView';
import { ClockIcon, AlarmIcon, TimerIcon, StopwatchIcon, SettingsIcon } from './components/Icons';
import { t } from './utils/translations';
import { getThemeColors, getBackgroundClass } from './utils/theme';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CLOCK);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstaller, setShowInstaller] = useState(false);

  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('pixelclock-alarms');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pixelclock-settings');
    const parsed = saved ? JSON.parse(saved) : {};
    return { ...DEFAULT_SETTINGS, ...parsed };
  });

  const [timerState, setTimerState] = useState({
      timeLeft: 0,
      initialTime: 0,
      isRunning: false
  });
  
  const timerIntervalRef = useRef<number | null>(null);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vibrationIntervalRef = useRef<number | null>(null);

  const themeColors = getThemeColors(settings.theme);
  const bgClass = getBackgroundClass(settings.background);

  useEffect(() => {
    // Проверка, запущено ли приложение как PWA
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone 
                         || document.referrer.includes('android-app://');
    
    setIsStandalone(checkStandalone);
    if (!checkStandalone) {
      setShowInstaller(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pixelclock-alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem('pixelclock-settings', JSON.stringify({ ...settings, customSoundUrl: null }));
  }, [settings]);

  // --- Vibration ---
  const startVibration = () => {
    vibrationIntervalRef.current = window.setInterval(() => {
      Haptics.vibrate();
    }, 1000);
  };
  const stopVibration = () => {
    if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current);
  };

  // --- Timer ---
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerState(prev => {
            if (prev.timeLeft <= 1) {
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                triggerTimerEnd();
                return { ...prev, timeLeft: 0, isRunning: false };
            }
            return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); }
  }, [timerState.isRunning]);

  const triggerTimerEnd = () => {
    triggerAlarm({ id: 'timer', time: '00:00', label: t('timer', settings.language), isActive: true });
  };

  const startTimer = (seconds: number) => {
      setTimerState({ timeLeft: seconds, initialTime: seconds, isRunning: true });
      Haptics.impact({ style: ImpactStyle.Heavy });
  };

  const pauseTimer = () => setTimerState(prev => ({ ...prev, isRunning: false }));
  const resetTimer = () => setTimerState({ timeLeft: 0, initialTime: 0, isRunning: false });

  // --- Alarms ---
  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      if (now.getSeconds() === 0) {
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
    startVibration();
    const src = settings.customSoundUrl || 'https://assets.mixkit.co/active_storage/sfx/936/936-preview.mp3';
    if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.loop = true;
        audioRef.current.play();
    }
  };

  const stopAlarm = () => {
    setRingingAlarm(null);
    stopVibration();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CLOCK: return <ClockView settings={settings} />;
      case Tab.ALARM: return <AlarmView alarms={alarms} setAlarms={setAlarms} settings={settings} />;
      case Tab.TIMER: return <TimerView settings={settings} {...timerState} startTimer={startTimer} pauseTimer={pauseTimer} resetTimer={resetTimer} />;
      case Tab.STOPWATCH: return <StopwatchView settings={settings} />;
      case Tab.SETTINGS: return <SettingsView settings={settings} updateSettings={(s) => setSettings(prev => ({ ...prev, ...s }))} />;
    }
  };

  return (
    <div className={`fixed inset-0 flex flex-col overflow-hidden ${bgClass}`}>
      <audio ref={audioRef} className="hidden" />
      
      {showInstaller && !isStandalone && (
        <InstallerView settings={settings} onContinue={() => setShowInstaller(false)} />
      )}

      <main className="flex-1 relative overflow-y-auto px-6 pt-12 pb-24">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-3xl border-t border-white/5 px-2 safe-area-bottom z-40">
        <ul className="flex justify-around items-center h-20">
          <NavItem active={activeTab === Tab.CLOCK} onClick={() => setActiveTab(Tab.CLOCK)} icon={<ClockIcon />} label={t('clock', settings.language)} themeColors={themeColors} />
          <NavItem active={activeTab === Tab.ALARM} onClick={() => setActiveTab(Tab.ALARM)} icon={<AlarmIcon />} label={t('alarm', settings.language)} themeColors={themeColors} />
          <NavItem active={activeTab === Tab.TIMER} onClick={() => setActiveTab(Tab.TIMER)} icon={<TimerIcon />} label={t('timer', settings.language)} themeColors={themeColors} />
          <NavItem active={activeTab === Tab.STOPWATCH} onClick={() => setActiveTab(Tab.STOPWATCH)} icon={<StopwatchIcon />} label="Сек." themeColors={themeColors} />
          <NavItem active={activeTab === Tab.SETTINGS} onClick={() => setActiveTab(Tab.SETTINGS)} icon={<SettingsIcon />} label="Настр." themeColors={themeColors} />
        </ul>
      </nav>

      {ringingAlarm && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${themeColors.bg} bg-opacity-95 backdrop-blur-3xl`}>
            <div className="animate-bounce mb-8"><AlarmIcon className="w-24 h-24 text-white" /></div>
            <h1 className="text-7xl font-black mb-16 text-white">{ringingAlarm.time}</h1>
            <button onClick={stopAlarm} className="bg-white text-black px-12 py-5 rounded-full font-black text-2xl shadow-2xl active:scale-90 transition-all">
                {t('stopAlarm', settings.language)}
            </button>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ active, onClick, icon, label, themeColors }: any) => (
  <li className="flex-1">
    <button onClick={() => { onClick(); Haptics.impact({ style: ImpactStyle.Light }); }} className="w-full flex flex-col items-center justify-center gap-1">
      <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? (themeColors.isRgb ? 'animate-rgb scale-110' : `${themeColors.lightBg} scale-110`) : ''}`}>
        {React.cloneElement(icon, { className: `w-6 h-6 ${active ? (themeColors.isRgb ? 'text-white' : themeColors.primary) : 'text-zinc-600'}` })}
      </div>
      <span className={`text-[9px] font-extrabold uppercase tracking-tight ${active ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
    </button>
  </li>
);
