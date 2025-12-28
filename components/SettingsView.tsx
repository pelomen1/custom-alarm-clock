import React, { useRef, useState } from 'react';
import { AppSettings, ThemeColor, Language, BackgroundType } from '../types';
import { t } from '../utils/translations';
import { getThemeColors } from '../utils/theme';
import { PlayIcon, PauseIcon } from './Icons';

interface SettingsViewProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSettings }) => {
  const themeColors = getThemeColors(settings.theme);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'PixelClock Ultra',
      text: 'Зацени мой новый будильник! Установи его прямо через браузер, и он будет работать как обычное приложение.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована! Просто отправь её другу.');
    }
  };

  const themes: ThemeColor[] = ['violet', 'sage', 'coral', 'sky', 'rgb'];
  const backgrounds: BackgroundType[] = ['black', 'cosmos', 'aurora', 'grid'];

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-500 overflow-y-auto pb-32">
      <audio ref={audioPreviewRef} />
      <h2 className={`text-4xl font-black tracking-tight mb-8 ${themeColors.isRgb ? 'text-rgb' : 'text-white'}`}>{t('settings', settings.language)}</h2>

      {/* Language & Format */}
      <section className="mb-8">
        <h3 className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.2em] mb-4 px-2">{t('general', settings.language)}</h3>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-2 shadow-inner">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
             <span className="text-lg font-semibold">{t('language', settings.language)}</span>
             <div className="flex gap-1 bg-black p-1 rounded-xl">
                {(['en', 'ru'] as Language[]).map(lang => (
                   <button
                     key={lang}
                     onClick={() => updateSettings({ language: lang })}
                     className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${settings.language === lang ? `${themeColors.bg} text-white scale-105` : 'text-zinc-600 hover:text-zinc-300'}`}
                   >
                     {lang.toUpperCase()}
                   </button>
                ))}
             </div>
          </div>
          <div className="flex items-center justify-between p-4">
             <span className="text-lg font-semibold">{t('timeFormat', settings.language)}</span>
             <button
               onClick={() => updateSettings({ is24Hour: !settings.is24Hour })}
               className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.is24Hour ? themeColors.bg : 'bg-zinc-800'}`}
             >
               <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300 ${settings.is24Hour ? 'left-7' : 'left-1'}`} />
             </button>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-8">
        <h3 className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.2em] mb-4 px-2">{t('appearance', settings.language)}</h3>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 space-y-8">
           <div>
               <div className="mb-4 text-sm font-bold text-zinc-400 uppercase tracking-widest">{t('theme', settings.language)}</div>
               <div className="grid grid-cols-3 gap-3">
                 {themes.map(color => {
                   const c = getThemeColors(color);
                   const isActive = settings.theme === color;
                   if (color === 'rgb') {
                       return (
                           <button key={color} onClick={() => updateSettings({ theme: color })} className={`col-span-2 relative h-14 rounded-2xl border-2 transition-all overflow-hidden ${isActive ? 'border-white scale-105 shadow-xl' : 'border-transparent'}`}>
                              <div className="absolute inset-0 animate-rgb opacity-90"></div>
                              <span className="relative font-black text-white text-xs tracking-[0.2em] uppercase">{t('rgb', settings.language)}</span>
                           </button>
                       )
                   }
                   return (
                     <button key={color} onClick={() => updateSettings({ theme: color })} className={`relative h-14 rounded-2xl border-2 transition-all overflow-hidden ${isActive ? `border-white scale-105 shadow-xl` : 'border-transparent bg-white/5'}`}> 
                       <span className={`relative font-black text-[10px] uppercase tracking-wider ${c.primary}`}>{t(color as any, settings.language)}</span>
                     </button>
                   );
                 })}
               </div>
           </div>
           <div>
               <div className="mb-4 text-sm font-bold text-zinc-400 uppercase tracking-widest">{t('background', settings.language)}</div>
               <div className="grid grid-cols-2 gap-3">
                  {backgrounds.map(bg => (
                      <button key={bg} onClick={() => updateSettings({ background: bg })} className={`relative h-12 rounded-2xl border transition-all ${settings.background === bg ? 'border-white bg-white/10' : 'border-white/5 bg-black'}`}>
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t(bg as any, settings.language)}</span>
                      </button>
                  ))}
               </div>
           </div>
        </div>
      </section>

      {/* About & Share */}
      <section className="mb-8">
        <h3 className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.2em] mb-4 px-2">{t('about', settings.language)}</h3>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="text-white font-black text-xl">PixelClock Ultra</div>
                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{t('version', settings.language)} 1.0.0</div>
                </div>
                <div className={`${themeColors.lightBg} p-3 rounded-2xl`}>
                    <div className={`w-3 h-3 rounded-full ${themeColors.bg} animate-pulse`}></div>
                </div>
            </div>
            
            <div className="p-4 bg-black/40 rounded-2xl mb-6 border border-white/5">
                <p className="text-zinc-400 text-[10px] uppercase font-black leading-relaxed tracking-wider mb-2">
                   {settings.language === 'ru' ? 'СОВЕТ ПО УСТАНОВКЕ:' : 'INSTALLATION TIP:'}
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">
                   {settings.language === 'ru' 
                    ? 'Если APK не ставится, отправь другу ссылку. Открыв её в Chrome, он сможет нажать "Установить на экран" — это будет работать как обычное приложение.' 
                    : 'If APK fails, send the link. In Chrome, your friend can tap "Install to home screen" to get the full app experience.'}
                </p>
            </div>

            <button 
                onClick={handleShare}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${themeColors.bg} text-white shadow-lg`}
            >
                {t('share', settings.language)}
            </button>
            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{t('developer', settings.language)}: YOU</span>
            </div>
        </div>
      </section>
    </div>
  );
};
