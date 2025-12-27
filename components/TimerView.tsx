import React, { useState } from 'react';
import { formatTimerTime } from '../utils/time';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';
import { AppSettings } from '../types';
import { t } from '../utils/translations';
import { getThemeColors } from '../utils/theme';

interface TimerViewProps {
  settings: AppSettings;
  timeLeft: number;
  initialTime: number;
  isRunning: boolean;
  startTimer: (minutes: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  inputMinutes: number;
  setInputMinutes: (m: number) => void;
}

export const TimerView: React.FC<TimerViewProps> = ({ 
    settings, 
    timeLeft, 
    initialTime, 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    inputMinutes,
    setInputMinutes
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const themeColors = getThemeColors(settings.theme);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 180) {
        setInputMinutes(val);
    }
  };

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
      {timeLeft === 0 && !isRunning ? (
         <div className="flex flex-col items-center w-full max-w-xs">
            <h2 className="text-3xl font-bold mb-8">{t('timer', settings.language)}</h2>
            
            <div className="relative mb-8 flex flex-col items-center">
                {isEditing ? (
                    <div className="flex items-center justify-center gap-2 h-20">
                         <input 
                            type="number" 
                            autoFocus
                            onBlur={() => setIsEditing(false)}
                            value={inputMinutes}
                            onChange={handleEditChange}
                            className={`w-32 bg-zinc-900 border-2 ${themeColors.isRgb ? 'border-white' : 'border-zinc-700'} rounded-2xl text-center text-5xl font-bold text-white outline-none p-2 tabular-nums`}
                         />
                         <span className="text-2xl text-zinc-500 font-normal">{t('min', settings.language)}</span>
                    </div>
                ) : (
                    <div 
                        onClick={() => setIsEditing(true)}
                        className={`text-7xl font-bold tabular-nums cursor-pointer hover:opacity-80 transition-opacity ${themeColors.accent}`}
                    >
                        {inputMinutes}<span className="text-2xl text-zinc-500 font-normal ml-2">{t('min', settings.language)}</span>
                    </div>
                )}
                <span className="text-xs text-zinc-600 mt-2">{t('tapToEdit', settings.language)}</span>
            </div>
            
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={inputMinutes} 
              onChange={(e) => setInputMinutes(parseInt(e.target.value))}
              className={`w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer mb-12 ${themeColors.slider}`}
            />

            <button 
              onClick={() => startTimer(inputMinutes)}
              className={`${themeColors.bg} ${themeColors.bgHover} text-white rounded-full p-6 shadow-xl shadow-black/30 transition-all hover:scale-105 active:scale-95`}
            >
              <PlayIcon className="w-8 h-8 fill-current" />
            </button>
         </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-72 h-72 flex items-center justify-center mb-8">
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-zinc-800 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className={`${themeColors.primary} fill-none transition-all duration-1000 ease-linear`}
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className={`text-6xl font-bold tabular-nums tracking-tighter z-10 ${themeColors.isRgb ? 'text-rgb' : 'text-white'}`}>
              {formatTimerTime(timeLeft)}
            </div>
          </div>

          <div className="flex gap-6">
             <button 
              onClick={resetTimer}
              className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-5 transition-all"
            >
              <ResetIcon className="w-6 h-6" />
            </button>

            <button 
              onClick={isRunning ? pauseTimer : () => startTimer(inputMinutes)}
              className={`${isRunning ? 'bg-amber-600 hover:bg-amber-500' : `${themeColors.bg} ${themeColors.bgHover}`} text-white rounded-full p-5 shadow-lg transition-all hover:scale-105 active:scale-95`}
            >
              {isRunning ? <PauseIcon className="w-6 h-6 fill-current" /> : <PlayIcon className="w-6 h-6 fill-current" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};