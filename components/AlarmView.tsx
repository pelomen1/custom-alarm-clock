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
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('00');
  const themeColors = getThemeColors(settings.theme);

  const addAlarm = () => {
    const alarm: Alarm = { id: Date.now().toString(), time: `${hour}:${minute}`, label: t('alarm', settings.language), isActive: true };
    setAlarms(prev => [...prev, alarm].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAdding(false);
  };

  return (
    <div className="min-h-full pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black text-white">{t('alarm', settings.language)}</h2>
        <button onClick={() => setIsAdding(true)} className={`${themeColors.bg} text-white rounded-full p-4 shadow-xl active:scale-90 transition-transform`}>
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {alarms.length === 0 && <p className="text-zinc-600 text-center py-20">{t('noAlarms', settings.language)}</p>}
        {alarms.map(alarm => (
          <div key={alarm.id} className={`p-6 rounded-[2.5rem] flex items-center justify-between transition-all ${alarm.isActive ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-950 opacity-40'}`}>
            <div className="flex flex-col">
              <span className="text-4xl font-light tabular-nums">{formatAlarmTime(alarm.time, settings.is24Hour)}</span>
              <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{alarm.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setAlarms(prev => prev.filter(a => a.id !== alarm.id))} className="text-zinc-700 p-2"><TrashIcon className="w-5 h-5" /></button>
              <button onClick={() => setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, isActive: !a.isActive } : a))} className={`w-14 h-8 rounded-full relative transition-colors ${alarm.isActive ? themeColors.bg : 'bg-zinc-800'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${alarm.isActive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[150] flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full max-w-xs rounded-[3rem] p-8 border border-zinc-800 shadow-2xl">
            <h3 className="text-center font-black mb-8 uppercase tracking-widest text-zinc-500">{t('newAlarm', settings.language)}</h3>
            <div className="flex justify-center items-center gap-4 mb-10">
              <select value={hour} onChange={e => setHour(e.target.value)} className="bg-zinc-800 text-white text-5xl p-4 rounded-3xl outline-none appearance-none font-light tabular-nums">
                {Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="text-4xl font-bold text-zinc-700">:</span>
              <select value={minute} onChange={e => setMinute(e.target.value)} className="bg-zinc-800 text-white text-5xl p-4 rounded-3xl outline-none appearance-none font-light tabular-nums">
                {Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-5 rounded-3xl bg-zinc-800 text-zinc-400 font-bold uppercase text-xs">{t('cancel', settings.language)}</button>
              <button onClick={addAlarm} className={`flex-1 py-5 rounded-3xl ${themeColors.bg} text-white font-black uppercase text-xs shadow-lg`}>{t('save', settings.language)}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};