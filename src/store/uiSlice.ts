import type { StateCreator } from 'zustand';
import i18n from '../i18n'; // Assuming standard location

export interface UiState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const createUiSlice: StateCreator<UiState> = (set) => {
  const initialLang = sessionStorage.getItem('pr_lang') || 'en';
  
  return {
    language: initialLang,
    setLanguage: (lang: string) => {
      sessionStorage.setItem('pr_lang', lang);
      i18n.changeLanguage(lang);
      set({ language: lang });
    },
  };
};
