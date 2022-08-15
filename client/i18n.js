import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./public/locales/en.json";
import jp from "./public/locales/jp.json";
import vn from "./public/locales/vn.json";

const resources = {
  en,
  jp,
  vn
};

i18n
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    lng: "en", // Default language
    interpolation: {
      escapeValue: false // React already implemented interpolation
    }
  });

export default i18n;