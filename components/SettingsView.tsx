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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateSettings({ 
        soundId: 'custom', 
        customSoundUrl: url,
        customSoundName: file.name
      });
    }
  };

  const togglePreview = () => {
    if (!audioPreviewRef.current) return;

    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      const src = settings.customSoundUrl || 'https://assets.mixkit.co/active_storage/sfx/936/936-preview.mp3';
      audioPreviewRef.current.src = src;
      audioPreviewRef.current.currentTime = settings.soundStartTime;
      audioPreviewRef.current.play();
      setIsPlayingPreview(true);
      
      // Auto stop after 5 seconds
      setTimeout(() => {
        if (audioPreviewRef.current) {
            audioPreviewRef.current.pause();
            setIsPlayingPreview(false);
        }
      }, 5000);
    }
  };

  const themes: ThemeColor[] = ['violet', 'sage', 'coral', 'sky', 'rgb'];
  const backgrounds: BackgroundType[] = ['black', 'cosmos', 'aurora', 'grid'];

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-500 overflow-y-auto pb-24">
      <audio ref={audioPreviewRef} />
      <h2 className={`text-3xl font-bold tracking-tight mb-8 ${themeColors.isRgb ? 'text-rgb' : 'text-white'}`}>{t('settings', settings.language)}</h2>

      {/* Language */}
      <section className="mb-8">
        <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-wider mb-4 px-2">{t('general', settings.language)}</h3>
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-2 space-y-1">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
             <span className="text-lg">{t('language', settings.language)}</span>
             <div className="flex gap-2 bg-zinc-950 p-1 rounded-xl">
                {(['en', 'ru'] as Language[]).map(lang => (
                   <button
                     key={lang}
                     onClick={() => updateSettings({ language: lang })}
                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${settings.language === lang ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                   >
                     {lang.toUpperCase()}
                   </button>
                ))}
             </div>
          </div>
          <div className="flex items-center justify-between p-4">
             <span className="text-lg">{t('timeFormat', settings.language)}</span>
             <button
               onClick={() => updateSettings({ is24Hour: !settings.is24Hour })}
               className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings.is24Hour ? themeColors.bg : 'bg-zinc-800'}`}
             >
               <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${settings.is24Hour ? 'left-7' : 'left-1'}`} />
             </button>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-8">
        <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-wider mb-4 px-2">{t('appearance', settings.language)}</h3>
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 space-y-6">
           {/* Theme */}
           <div>
               <div className="mb-4 text-lg">{t('theme', settings.language)}</div>
               <div className="grid grid-cols-3 gap-3">
                 {themes.map(color => {
                   const c = getThemeColors(color);
                   const isActive = settings.theme === color;
                   
                   if (color === 'rgb') {
                       return (
                           <button
                             key={color}
                             onClick={() => updateSettings({ theme: color })}
                             className={`col-span-2 relative h-16 rounded-xl border-2 flex items-center justify-center transition-all overflow-hidden ${isActive ? 'border-white' : 'border-transparent'}`}
                           >
                              <div className="absolute inset-0 animate-rgb opacity-80"></div>
                              <span className="relative font-bold text-white tracking-widest">{t('rgb', settings.language)}</span>
                           </button>
                       )
                   }

                   return (
                     <button
                       key={color}
                       onClick={() => updateSettings({ theme: color })}
                       className={`relative h-16 rounded-xl border-2 flex items-center justify-center transition-all overflow-hidden ${isActive ? `border-white/50` : 'border-transparent'}`}
                     > 
                       <div className={`absolute inset-0 opacity-20 ${c.bg}`}></div>
                       <span className={`relative font-medium capitalize ${c.primary}`}>{t(color as any, settings.language)}</span>
                       {isActive && <div className={`absolute right-2 top-2 w-2 h-2 rounded-full ${c.bg}`}></div>}
                     </button>
                   );
                 })}
               </div>
           </div>
           
           {/* Background */}
           <div>
               <div className="mb-4 text-lg">{t('background', settings.language)}</div>
               <div className="grid grid-cols-2 gap-3">
                  {backgrounds.map(bg => (
                      <button
                        key={bg}
                        onClick={() => updateSettings({ background: bg })}
                        className={`relative h-12 rounded-xl border-2 flex items-center justify-center transition-all ${settings.background === bg ? 'border-white bg-zinc-800' : 'border-transparent bg-zinc-950/50'}`}
                      >
                         <span className="text-sm font-medium text-zinc-300">{t(bg as any, settings.language)}</span>
                      </button>
                  ))}
               </div>
           </div>
        </div>
      </section>

      {/* Sound */}
      <section className="mb-8">
        <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-wider mb-4 px-2">{t('sound', settings.language)}</h3>
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-4 space-y-6">
           
           {/* Upload */}
           <div>
              <div className="text-lg mb-2">{t('melody', settings.language)}</div>
              <div className="flex items-center gap-3">
                 <label className={`flex-1 p-4 rounded-xl border border-dashed border-zinc-700 hover:border-zinc-500 cursor-pointer text-center text-sm text-zinc-400 transition-colors ${themeColors.lightBg}`}>
                    {settings.customSoundName || t('upload', settings.language)}
                    <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                 </label>
                 {settings.customSoundUrl && (
                   <button 
                     onClick={() => updateSettings({ soundId: 'default', customSoundUrl: null, customSoundName: null })}
                     className="p-4 bg-zinc-800 rounded-xl hover:bg-zinc-700"
                   >
                     ✕
                   </button>
                 )}
              </div>
           </div>

           {/* Audio Scrubber */}
           <div>
              <div className="flex justify-between items-end mb-4">
                 <span className="text-sm text-zinc-400">{t('startTime', settings.language)}</span>
                 <button 
                   onClick={togglePreview}
                   className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${themeColors.lightBg} ${themeColors.primary} hover:opacity-80 transition-opacity`}
                 >
                    {isPlayingPreview ? <PauseIcon className="w-3 h-3" /> : <PlayIcon className="w-3 h-3" />}
                    {isPlayingPreview ? 'Stop' : 'Test'}
                 </button>
              </div>
              
              <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800">
                  <div className="text-center text-3xl font-bold tabular-nums mb-4 text-white">
                      {settings.soundStartTime}<span className="text-lg text-zinc-500 ml-1">sec</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="120"
                    step="1"
                    value={settings.soundStartTime}
                    onChange={(e) => updateSettings({ soundStartTime: parseInt(e.target.value) })}
                    className={`w-full h-12 rounded-xl appearance-none cursor-pointer bg-zinc-800 ${themeColors.slider}`}
                    style={{
                        backgroundImage: 'linear-gradient(to right, #3f3f46 0%, #3f3f46 100%)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat'
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-2 px-1 font-mono">
                      <span>00:00</span>
                      <span>00:30</span>
                      <span>01:00</span>
                      <span>01:30</span>
                      <span>02:00</span>
                  </div>
              </div>
           </div>

            {/* Ascending Volume */}
           <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
             <span className="text-lg">{t('ascending', settings.language)}</span>
             <button
               onClick={() => updateSettings({ ascendingVolume: !settings.ascendingVolume })}
               className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${settings.ascendingVolume ? themeColors.bg : 'bg-zinc-800'}`}
             >
               <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 ${settings.ascendingVolume ? 'left-7' : 'left-1'}`} />
             </button>
          </div>

        </div>
      </section>

    </div>
  );
};