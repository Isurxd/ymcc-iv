'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import id from '@/locales/id.json';
import en from '@/locales/en.json';

type Lang = 'ID' | 'EN';

const dictionaries: any = { ID: id, EN: en };

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ID');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('ymcc_lang') as Lang;
      if (savedLang && (savedLang === 'ID' || savedLang === 'EN')) {
        setLangState(savedLang);
      }
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

  // Helper to get nested keys (like 'nav.home')
  const t = (key: string) => {
    const keys = key.split('.');
    let value = dictionaries[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t }}>
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
