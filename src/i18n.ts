import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './i18n/en.json';
import hi from './i18n/hi.json';
import pa from './i18n/pa.json';
import mr from './i18n/mr.json';
import gu from './i18n/gu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  pa: { translation: pa },
  mr: { translation: mr },
  gu: { translation: gu },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'mr', // IVR/alerts fallback logic defaults to Marathi as specified
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
