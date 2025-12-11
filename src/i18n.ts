import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enJson from "./i18n/en.json"
import itJson from "./i18n/it.json"

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: enJson },
      it: { translation: itJson }
    }
  })

export default i18n
