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
    <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
      <div className="text-zinc-400 text-lg mb-2 tracking-wide uppercase font-medium">
        {formatDate(now, settings.language)}
      </div>
      <div className="relative">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white tabular-nums">
          {formatTime(now, settings.is24Hour)}
        </h1>
        <div className={`absolute -right-6 bottom-4 md:-right-12 md:bottom-6 text-2xl md:text-3xl font-medium tabular-nums ${themeColors.primary}`}>
          {formatSeconds(now)}
        </div>
      </div>
      
      <div className="mt-12 flex gap-4">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 w-32 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">{t('timezone', settings.language)}</span>
            <span className="text-zinc-300 font-medium text-sm">{t('local', settings.language)}</span>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 w-32 flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">{t('battery', settings.language)}</span>
            <span className="text-green-400 font-medium text-sm">100%</span>
        </div>
      </div>
    </div>
  );
};