import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";

import { getOptions } from "../i18n/settings";

const initI18Next = async (language: string, namespace: string) => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`)
      )
    )
    .init(getOptions(language, namespace));

  return i18nInstance;
};

export const useTranslation = async (
  language: string,
  namespace: string,
  keyPrefix?: string
) => {
  const i18nextInstance = await initI18Next(language, namespace);

  return {
    translation: i18nextInstance.getFixedT(language, namespace, keyPrefix),
    i18n: i18nextInstance,
  };
};

export * from "./settings";
