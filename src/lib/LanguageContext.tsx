'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'ID' | 'EN';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ID');

  useEffect(() => {
    const savedLang = localStorage.getItem('ymcc_lang') as Lang;
    if (savedLang) {
      setLangState(savedLang);
    }
  }, []);

  const toggleLang = () => {
    setLangState((prev) => {
      const newLang = prev === 'ID' ? 'EN' : 'ID';
      localStorage.setItem('ymcc_lang', newLang);
      return newLang;
    });
  };

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('ymcc_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
