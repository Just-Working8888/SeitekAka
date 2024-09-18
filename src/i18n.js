import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './locales/ru.json';
import kg from './locales/kg.json';

i18n
    .use(LanguageDetector) // Определение языка
    .use(initReactI18next) // подключение к React
    .init({
        resources: {
            ru: {
                translation: ru
            },
            kg: {
                translation: kg
            }
        },
        fallbackLng: 'ru', // Язык по умолчанию
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
