import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://803ee7528d5f4b758974dceaab635323@o4505143450796032.ingest.sentry.io/4505143452041216",
  tracesSampleRate: 0.5,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
