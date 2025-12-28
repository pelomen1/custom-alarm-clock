import React, { useEffect, useState } from 'react';
import { getThemeColors } from '../utils/theme';
import { t } from '../utils/translations';
import { AppSettings } from '../types';

interface InstallerViewProps {
  settings: AppSettings;
  onContinue: () => void;
}

export const InstallerView: React.FC<InstallerViewProps> = ({ settings, onContinue }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const themeColors = getThemeColors(settings.theme);
  const shareUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=ffffff&bgcolor=000000`;

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert(settings.language === 'ru' 
        ? 'Нажми на три точки в углу браузера и выбери "Установить приложение" или "Добавить на гл. экран"' 
        : 'Tap the three dots in your browser menu and select "Install app" or "Add to home screen"');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-sm">
        {/* Анимированный логотип */}
        <div className={`w-24 h-24 mx-auto mb-8 rounded-[2.5rem] ${themeColors.bg} flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-bounce`}>
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v10m0 0l-3-3m3 3l3-3M5 20h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className={`text-4xl font-black mb-2 ${themeColors.isRgb ? 'text-rgb' : 'text-white'}`}>
          PixelBoot Ultra
        </h1>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.2em] mb-8">
          Installer v1.0
        </p>

        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 mb-8">
          <p className="text-zinc-300 text-sm leading-relaxed mb-8">
            {settings.language === 'ru' 
              ? 'Это приложение готово к установке на твой телефон. Оно будет работать офлайн и без ошибок APK.' 
              : 'This app is ready to be installed on your device. It will work offline and bypass APK errors.'}
          </p>
          
          <button 
            onClick={handleInstall}
            className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-95 shadow-2xl mb-4 ${themeColors.bg} text-white`}
          >
            {settings.language === 'ru' ? 'УСТАНОВИТЬ' : 'INSTALL NOW'}
          </button>

          <button 
            onClick={onContinue}
            className="w-full py-3 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-zinc-300 transition-colors"
          >
            {settings.language === 'ru' ? 'Просто попробовать' : 'Just preview'}
          </button>
        </div>

        {/* QR Section */}
        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
            {settings.language === 'ru' ? 'ПОДЕЛИТЬСЯ С ДРУГОМ' : 'SHARE WITH FRIEND'}
          </p>
          <div className="bg-black p-4 rounded-3xl inline-block mb-4">
            <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 rounded-lg" />
          </div>
          <p className="text-zinc-600 text-[10px] leading-tight">
            {settings.language === 'ru' 
              ? 'Пусть друг отсканирует этот код, чтобы открыть установщик на своем телефоне' 
              : 'Let a friend scan this code to open the installer on their device'}
          </p>
        </div>
      </div>
    </div>
  );
};
