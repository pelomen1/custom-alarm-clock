import React, { useState } from 'react';
import { Alarm, AppSettings } from '../types';
import { PlusIcon, TrashIcon } from './Icons';
import { formatAlarmTime } from '../utils/time';
import { t } from '../utils/translations';
import { getThemeColors } from '../utils/theme';

interface AlarmViewProps {
  alarms: Alarm[];
  setAlarms: React.Dispatch<React.SetStateAction<Alarm[]>>;
  settings: AppSettings;
}

export const AlarmView: React.FC<AlarmViewProps> = ({ alarms, setAlarms, settings }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('07:00');
  const [newLabel, setNewLabel] = useState('');
  
  const themeColors = getThemeColors(settings.theme);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newTime,
      label: newLabel || t('alarm', settings.language),
      isActive: true,
    };
    setAlarms(prev => [...prev, alarm].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAdding(false);
    setNewLabel('');
    setNewTime('07:00');
  };

  return (
    <div className="h-full flex flex-col relative animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight">{t('alarm', settings.language)}</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className={`${themeColors.bg} ${themeColors.bgHover} text-white rounded-full p-3 transition-colors shadow-lg shadow-black/40`}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 space-y-4">
        {alarms.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <p>{t('noAlarms', settings.language)}</p>
            <p className="text-sm">{t('enjoySleep', settings.language)}</p>
          </div>
        )}
        {alarms.map(alarm => (
          <div 
            key={alarm.id} 
            className={`p-5 rounded-3xl flex items-center justify-between transition-all duration-300 border ${
              alarm.isActive 
                ? 'bg-zinc-900 border-zinc-800' 
                : 'bg-zinc-950 border-zinc-900 opacity-60'
            }`}
          >
            <div className="flex flex-col">
              <span className={`text-4xl font-light tracking-tight tabular-nums ${alarm.isActive ? 'text-white' : 'text-zinc-500'}`}>
                {formatAlarmTime(alarm.time, settings.is24Hour)}
              </span>
              <span className="text-sm text-zinc-500 mt-1 font-medium">{alarm.label}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => deleteAlarm(alarm.id)}
                className="text-zinc-600 hover:text-red-400 transition-colors p-2"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => toggleAlarm(alarm.id)}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${
                  alarm.isActive ? themeColors.bg : 'bg-zinc-800'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-sm ${
                  alarm.isActive ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Alarm Modal Overlay */}
      {isAdding && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-center">{t('newAlarm', settings.language)}</h3>
            
            <div className="mb-6 flex justify-center">
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className={`bg-zinc-950 text-white text-5xl p-4 rounded-xl border border-zinc-800 ${themeColors.border} outline-none tabular-nums`}
              />
            </div>
            
            <input 
              type="text" 
              placeholder={t('label', settings.language)} 
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className={`w-full bg-zinc-950 text-white p-4 rounded-xl border border-zinc-800 ${themeColors.border} outline-none mb-6`}
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
              >
                {t('cancel', settings.language)}
              </button>
              <button 
                onClick={addAlarm}
                className={`flex-1 py-4 rounded-xl ${themeColors.bg} ${themeColors.bgHover} text-white font-medium transition-colors`}
              >
                {t('save', settings.language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};