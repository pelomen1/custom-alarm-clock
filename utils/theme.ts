import { ThemeColor, BackgroundType } from '../types';

export const getThemeColors = (theme: ThemeColor) => {
  switch (theme) {
    case 'rgb':
      return {
        primary: 'text-rgb',
        bg: 'animate-rgb',
        bgHover: 'hover:opacity-80',
        border: 'border-white/20 focus:border-white/50', // RGB borders handled via special class usually
        accent: 'text-white',
        slider: 'accent-white',
        activeSwitch: 'animate-rgb',
        lightBg: 'bg-white/10',
        ring: 'ring-white',
        isRgb: true
      };
    case 'sage':
      return {
        primary: 'text-emerald-400',
        bg: 'bg-emerald-600',
        bgHover: 'hover:bg-emerald-500',
        border: 'focus:border-emerald-500',
        accent: 'text-emerald-200',
        slider: 'accent-emerald-500',
        activeSwitch: 'bg-emerald-500',
        lightBg: 'bg-emerald-500/10',
        ring: 'ring-emerald-500',
        isRgb: false
      };
    case 'coral':
      return {
        primary: 'text-rose-400',
        bg: 'bg-rose-600',
        bgHover: 'hover:bg-rose-500',
        border: 'focus:border-rose-500',
        accent: 'text-rose-200',
        slider: 'accent-rose-500',
        activeSwitch: 'bg-rose-500',
        lightBg: 'bg-rose-500/10',
        ring: 'ring-rose-500',
        isRgb: false
      };
    case 'sky':
      return {
        primary: 'text-sky-400',
        bg: 'bg-sky-600',
        bgHover: 'hover:bg-sky-500',
        border: 'focus:border-sky-500',
        accent: 'text-sky-200',
        slider: 'accent-sky-500',
        activeSwitch: 'bg-sky-500',
        lightBg: 'bg-sky-500/10',
        ring: 'ring-sky-500',
        isRgb: false
      };
    case 'violet':
    default:
      return {
        primary: 'text-indigo-400',
        bg: 'bg-indigo-600',
        bgHover: 'hover:bg-indigo-500',
        border: 'focus:border-indigo-500',
        accent: 'text-indigo-200',
        slider: 'accent-indigo-500',
        activeSwitch: 'bg-indigo-500',
        lightBg: 'bg-indigo-500/10',
        ring: 'ring-indigo-500',
        isRgb: false
      };
  }
};

export const getBackgroundClass = (bg: BackgroundType) => {
  switch (bg) {
    case 'cosmos': return 'bg-cosmos';
    case 'aurora': return 'bg-aurora';
    case 'grid': return 'bg-grid';
    case 'black': default: return 'bg-black';
  }
};