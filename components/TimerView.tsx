import React, { useState } from 'react';
import { formatTimerTime } from '../utils/time';
import { PlayIcon, PauseIcon, ResetIcon, TrashIcon } from './Icons';
import { AppSettings } from '../types';
import { t } from '../utils/translations';
import { getThemeColors } from '../utils/theme';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface TimerViewProps {
  settings: AppSettings;
  timeLeft: number;
  initialTime: number;
  isRunning: boolean;
  startTimer: (seconds: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

export const TimerView: React.FC<TimerViewProps> = ({ 
    settings, 
    timeLeft, 
    initialTime, 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer
}) => {
  const [digits, setDigits] = useState<string>('');
  const themeColors = getThemeColors(settings.theme);

  const addDigit = (d: string) => {
    if (digits.length >= 6) return;
    setDigits(prev => prev + d);
    Haptics.impact({ style: ImpactStyle.Light });
  };

  const removeDigit = () => {
    setDigits(prev => prev.slice(0, -1));
    Haptics.impact({ style: ImpactStyle.Medium });
  };

  const clearDigits = () => {
    setDigits('');
  };

  const getFormattedInput = () => {
    const s = digits.padStart(6, '0');
    const hh = s.slice(0, 2);
    const mm = s.slice(2, 4);
    const ss = s.slice(4, 6);
    return { hh, mm, ss };
  };

  const handleStart = () => {
    const { hh, mm, ss } = getFormattedInput();
    const totalSeconds = parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss);
    if (totalSeconds > 0) {
      startTimer(totalSeconds);
      setDigits('');
    }
  };

  const { hh, mm, ss } = getFormattedInput();

  if (timeLeft > 0 || isRunning) {
    const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
    const strokeDashoffset = 283 - (283 * progress) / 100;

    return (
      <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
        <div className="relative w-72 h-72 flex items-center justify-center mb-12">
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" className="stroke-white/5 fill-none" strokeWidth="6" />
              <circle
                cx="50%" cy="50%" r="45%"
                className={`${themeColors.primary} fill-none transition-all duration-1000 ease-linear`}
                stroke="currentColor" strokeWidth="10" strokeDasharray="283"
                strokeDashoffset={strokeDashoffset} strokeLinecap="round"
              />
            </svg>
            <div className={`text-6xl font-black tabular-nums tracking-tighter z-10 ${themeColors.isRgb ? 'text-rgb' : 'text-white'}`}>
              {formatTimerTime(timeLeft)}
            </div>
        </div>
        <div className="flex gap-8">
            <button onClick={resetTimer} className="bg-white/10 text-white rounded-full p-6"><ResetIcon className="w-8 h-8" /></button>
            <button 
              onClick={isRunning ? pauseTimer : () => startTimer(timeLeft)}
              className={`${isRunning ? 'bg-amber-600' : themeColors.bg} text-white rounded-full p-6`}
            >
              {isRunning ? <PauseIcon className="w-8 h-8 fill-current" /> : <PlayIcon className="w-8 h-8 fill-current" />}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-between pb-4">
      <div className="flex flex-col items-center pt-4">
        <div className="text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-4 opacity-50">
          {t('timer', settings.language)}
        </div>
        
        <div className="flex items-baseline gap-1 mb-2">
            <div className={`text-5xl font-black tabular-nums ${digits.length >= 5 ? 'text-white' : 'text-zinc-800'}`}>{hh}</div>
            <div className="text-zinc-700 font-bold text-lg">ч</div>
            <div className={`text-5xl font-black tabular-nums ${digits.length >= 3 ? 'text-white' : 'text-zinc-800'}`}>{mm}</div>
            <div className="text-zinc-700 font-bold text-lg">м</div>
            <div className={`text-5xl font-black tabular-nums ${digits.length >= 1 ? 'text-white' : 'text-zinc-800'}`}>{ss}</div>
            <div className="text-zinc-700 font-bold text-lg">с</div>
        </div>
        <div className={`h-1 w-48 rounded-full ${themeColors.bg} opacity-30`}></div>
      </div>

      <div className="w-full max-w-[280px] grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button key={n} onClick={() => addDigit(n.toString())} className="h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-2xl font-black text-zinc-300 transition-active active:scale-90">
            {n}
          </button>
        ))}
        <button onClick={clearDigits} className="h-16 rounded-2xl bg-white/5 text-zinc-500 font-bold text-xs uppercase">C</button>
        <button onClick={() => addDigit('0')} className="h-16 rounded-2xl bg-white/5 text-2xl font-black text-zinc-300">0</button>
        <button onClick={removeDigit} className="h-16 rounded-2xl bg-white/5 text-zinc-500 flex items-center justify-center"><TrashIcon className="w-6 h-6" /></button>
      </div>

      <button 
        onClick={handleStart}
        disabled={!digits}
        className={`w-full max-w-[280px] py-5 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${digits ? `${themeColors.bg} text-white` : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'}`}
      >
        {t('start', settings.language)}
      </button>
    </div>
  );
};