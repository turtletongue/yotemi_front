export const FALLBACK_LANGUAGE = "en";
export const DEFAULT_NAMESPACE = "homepage";

export const languages = [FALLBACK_LANGUAGE, "ru"] as const;
export type Language = typeof languages[number];

export const getOptions = (
  language: string = FALLBACK_LANGUAGE,
  namespace: string = DEFAULT_NAMESPACE
) => ({
  supportedLngs: languages,
  fallbackLng: FALLBACK_LANGUAGE,
  lng: language,
  ns: namespace,
  initImmediate: true,
  fallbackNS: DEFAULT_NAMESPACE,
  defaultNS: DEFAULT_NAMESPACE,
});
