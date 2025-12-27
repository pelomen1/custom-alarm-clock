export interface Alarm {
  id: string;
  time: string; // Internal storage always HH:mm (24h)
  label: string;
  isActive: boolean;
}

export enum Tab {
  CLOCK = 'CLOCK',
  ALARM = 'ALARM',
  TIMER = 'TIMER',
  STOPWATCH = 'STOPWATCH',
  SETTINGS = 'SETTINGS'
}

export interface Lap {
  id: number;
  time: number;
  diff: number;
}

export type ThemeColor = 'violet' | 'sage' | 'coral' | 'sky' | 'rgb';
export type Language = 'en' | 'ru';
export type BackgroundType = 'black' | 'cosmos' | 'aurora' | 'grid';

export interface AppSettings {
  theme: ThemeColor;
  background: BackgroundType;
  language: Language;
  is24Hour: boolean;
  soundId: string; // 'default' or custom
  customSoundUrl: string | null;
  customSoundName: string | null;
  soundStartTime: number; // seconds
  ascendingVolume: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'violet',
  background: 'black',
  language: 'ru',
  is24Hour: true,
  soundId: 'default',
  customSoundUrl: null,
  customSoundName: null,
  soundStartTime: 0,
  ascendingVolume: true,
};