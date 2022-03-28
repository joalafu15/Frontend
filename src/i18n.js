import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

 i18n
  .use(initReactI18next)
  //.use(LanguageDetector)
  .use(
    resourcesToBackend((language, namespace, callback) => {
      document.documentElement.lang = language
      document.documentElement.dir = language === 'ar' ? 'RTL' : 'LTR'
      import(`./assets/locales/${language}/${namespace}.json`)
        .then((resources) => {
          callback(null, resources)
        })
        .catch((error) => {
          callback(error, null)
        })
    }),
  )
  .init({
    //fallbackLng: 'en',
    fallbackLng: 'ar',
  })
  export const i18 = i18n;