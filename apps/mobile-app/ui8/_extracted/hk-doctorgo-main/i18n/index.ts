import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from '@/locales/en.json';
import translationId from '@/locales/id.json';
import translationJp from '@/locales/jp.json';

const resources = {
  'en-US': { translation: translationEn },
  'en-ID': { translation: translationId },
  'en-JP': { translation: translationJp },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag;
  }

  await i18n.use(initReactI18next).init({
    // compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n().then(() => console.log('I18N loaded'));

export default i18n;
