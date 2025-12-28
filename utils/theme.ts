import { ThemeColor, BackgroundType } from '../types';

export const getThemeColors = (theme: ThemeColor) => {
  switch (theme) {
    case 'rgb':
      return {
        primary: 'text-rgb',
        bg: 'animate-rgb',
        bgHover: 'hover:opacity-80',
        border: 'border-white',
        accent: 'text-white',
        slider: 'accent-white',
        lightBg: 'bg-white/10',
        isRgb: true
      };
    case 'sage':
      return {
        primary: 'text-[#4ade80]',
        bg: 'bg-[#22c55e]',
        bgHover: 'hover:bg-[#16a34a]',
        border: 'border-[#4ade80]',
        accent: 'text-[#86efac]',
        slider: 'accent-[#22c55e]',
        lightBg: 'bg-[#22c55e]/20',
        isRgb: false
      };
    case 'coral':
      return {
        primary: 'text-[#fb7185]',
        bg: 'bg-[#e11d48]',
        bgHover: 'hover:bg-[#be123c]',
        border: 'border-[#fb7185]',
        accent: 'text-[#fda4af]',
        slider: 'accent-[#e11d48]',
        lightBg: 'bg-[#e11d48]/20',
        isRgb: false
      };
    case 'sky':
      return {
        primary: 'text-[#38bdf8]',
        bg: 'bg-[#0284c7]',
        bgHover: 'hover:bg-[#0369a1]',
        border: 'border-[#38bdf8]',
        accent: 'text-[#7dd3fc]',
        slider: 'accent-[#0284c7]',
        lightBg: 'bg-[#0284c7]/20',
        isRgb: false
      };
    case 'violet':
    default:
      return {
        primary: 'text-[#a78bfa]',
        bg: 'bg-[#7c3aed]',
        bgHover: 'hover:bg-[#6d28d9]',
        border: 'border-[#a78bfa]',
        accent: 'text-[#c4b5fd]',
        slider: 'accent-[#7c3aed]',
        lightBg: 'bg-[#7c3aed]/20',
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