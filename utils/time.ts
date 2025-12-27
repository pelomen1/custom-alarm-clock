export const formatTime = (date: Date, is24Hour: boolean): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: !is24Hour 
  });
};

export const formatAlarmTime = (timeString: string, is24Hour: boolean): string => {
  if (is24Hour) return timeString;
  
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

export const formatSeconds = (date: Date): string => {
  return date.toLocaleTimeString([], { second: '2-digit', hour12: false }).split(':').pop() || '00';
};

export const formatDate = (date: Date, lang: string): string => {
  return date.toLocaleDateString([lang === 'ru' ? 'ru-RU' : 'en-US'], { weekday: 'long', month: 'short', day: 'numeric' });
};

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  const c = centiseconds.toString().padStart(2, '0');

  return `${m}:${s}.${c}`;
};

export const formatTimerTime = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};