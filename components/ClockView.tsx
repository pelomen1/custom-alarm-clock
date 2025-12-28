import React from 'react';
import { formatDate, formatTime, formatSeconds } from '../utils/time';
import { AppSettings } from '../types';
import { t } from '../utils/translations';
import { getThemeColors } from '../utils/theme';

interface ClockViewProps {
  settings: AppSettings;
}

export const ClockView: React.FC<ClockViewProps> = ({ settings }) => {
  const [now, setNow] = React.useState(new Date());
  const themeColors = getThemeColors(settings.theme);

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-700">
      <div className="text-zinc-500 text-sm md:text-lg mb-4 tracking-[0.3em] uppercase font-extrabold opacity-60">
        {formatDate(now, settings.language)}
      </div>
      
      <div className="relative flex items-baseline">
        {/* Main Time */}
        <h1 className={`text-[5.5rem] leading-none md:text-9xl font-black tracking-tighter tabular-nums transition-all duration-500 ${themeColors.isRgb ? 'text-rgb' : themeColors.primary} drop-shadow-2xl`}>
          {formatTime(now, settings.is24Hour)}
        </h1>
        
        {/* Seconds - Now aligned properly */}
        <div className={`ml-2 text-3xl md:text-4xl font-bold tabular-nums opacity-40 ${themeColors.isRgb ? 'text-white' : themeColors.primary}`}>
          {formatSeconds(now)}
        </div>
      </div>
      
      <div className="mt-16 flex flex-col items-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] px-8 py-4 flex flex-col items-center shadow-2xl">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">{t('timezone', settings.language)}</span>
            <span className="text-zinc-200 font-bold text-lg">{t('local', settings.language)}</span>
        </div>
      </div>
    </div>
  );
};