import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import { getOptions } from "./settings";

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`)
    )
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
