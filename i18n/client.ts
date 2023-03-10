import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import { getOptions } from "./settings";

const generalResourcesMap: Record<string, any> = {};

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(async (lang: string, ns: string) => {
      if (!generalResourcesMap[lang]) {
        generalResourcesMap[lang] = await import(
          `./locales/${lang}/general.json`
        );
      }

      const resource = await import(`./locales/${lang}/${ns}.json`);

      return { ...generalResourcesMap[lang], ...resource };
    })
  )
  .init(getOptions())
  .then();

export const useTranslation = (
  language: string,
  namespace: string,
  keyPrefix?: string
) => {
  if (i18next.resolvedLanguage !== language) {
    i18next.changeLanguage(language).then();
  }

  const result = useTranslationOrg(namespace, { keyPrefix });

  return {
    ...result,
    translation: result.t,
  };
};

export * from "./settings";
