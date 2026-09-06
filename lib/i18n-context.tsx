'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, DICTIONARY } from './i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof DICTIONARY.en, variables?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'robo_crackers_lang_v1';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (stored === 'en' || stored === 'ta') {
        setLanguageState(stored);
      }
    } catch {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof typeof DICTIONARY.en, variables?: Record<string, string | number>): string => {
    const dict = DICTIONARY[language] || DICTIONARY.en;
    let text: string = dict[key] || DICTIONARY.en[key] || key;

    if (variables) {
      for (const [vKey, val] of Object.entries(variables)) {
        text = text.replace(new RegExp(`\\{${vKey}\\}`, 'g'), String(val));
      }
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback default
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: keyof typeof DICTIONARY.en, variables?: Record<string, string | number>) => {
        let text: string = DICTIONARY.en[key] || key;
        if (variables) {
          for (const [vKey, val] of Object.entries(variables)) {
            text = text.replace(new RegExp(`\\{${vKey}\\}`, 'g'), String(val));
          }
        }
        return text;
      },
    };
  }
  return context;
}
