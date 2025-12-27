import React, { useState, useEffect, useRef } from 'react';
import { formatDuration } from '../utils/time';
import { Lap, AppSettings } from '../types';
import { PlayIcon, PauseIcon, FlagIcon, ResetIcon } from './Icons';
import { t } from '../utils/translations';
import { getThemeColors } from '../utils/theme';

interface StopwatchViewProps {
  settings: AppSettings;
}

export const StopwatchView: React.FC<StopwatchViewProps> = ({ settings }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const themeColors = getThemeColors(settings.theme);

  const animate = (timestamp: number) => {
    if (startTimeRef.current > 0) {
      setTime(Date.now() - startTimeRef.current);
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const start = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - time;
      setIsRunning(true);
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const pause = () => {
    if (isRunning) {
      setIsRunning(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  };

  const reset = () => {
    pause();
    setTime(0);
    setLaps([]);
    startTimeRef.current = 0;
  };

  const lap = () => {
    const prevTime = laps.length > 0 ? laps[0].time : 0;
    const newLap: Lap = {
      id: laps.length + 1,
      time: time,
      diff: time - prevTime
    };
    setLaps([newLap, ...laps]);
  };

  return (
    <div className="h-full flex flex-col items-center pt-8 animate-in slide-in-from-right-4 duration-500">
      <div className="text-7xl md:text-8xl font-bold tabular-nums tracking-tighter mb-12 text-white">
        {formatDuration(time)}
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={reset}
          disabled={time === 0}
          className="bg-zinc-800 disabled:opacity-50 hover:bg-zinc-700 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center transition-all"
        >
          <ResetIcon className="w-6 h-6" />
        </button>

        <button 
          onClick={isRunning ? pause : start}
          className={`${isRunning ? 'bg-amber-600 hover:bg-amber-500' : `${themeColors.bg} ${themeColors.bgHover}`} text-white rounded-full p-4 w-24 h-24 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all mx-2`}
        >
          {isRunning ? <PauseIcon className="w-10 h-10 fill-current" /> : <PlayIcon className="w-10 h-10 fill-current" />}
        </button>

        <button 
          onClick={lap}
          disabled={!isRunning}
          className="bg-zinc-800 disabled:opacity-50 hover:bg-zinc-700 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center transition-all"
        >
          <FlagIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-md flex-1 overflow-y-auto px-4 border-t border-zinc-900">
        <div className="space-y-2 py-4">
          {laps.map((l, index) => (
             <div key={l.id} className="flex justify-between items-center p-3 rounded-xl bg-zinc-900/50 text-sm">
                <span className="text-zinc-500 font-mono w-8">#{laps.length - index}</span>
                <span className="text-zinc-400 font-mono">+{formatDuration(l.diff)}</span>
                <span className="text-white font-mono font-bold">{formatDuration(l.time)}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};