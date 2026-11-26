"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import en, { type Dictionary } from "./en";
import tr from "./tr";

export const dictionaries = { en, tr } satisfies Record<string, Dictionary>;
export type Locale = keyof typeof dictionaries;
export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "en";

const STORAGE_KEY = "watchmatch-locale";

type Section = keyof Dictionary;
type Key = { [S in Section]: `${S}.${Extract<keyof Dictionary[S], string>}` }[Section];

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in dictionaries) setLocaleState(saved as Locale);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const t = useCallback(
    (key: Key, vars?: Record<string, string | number>) => {
      const [section, name] = key.split(".") as [Section, string];
      const dict = dictionaries[locale][section] as Record<string, string>;
      const fallback = dictionaries[defaultLocale][section] as Record<string, string>;
      let text = dict[name] ?? fallback[name] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
      }
      return text;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
