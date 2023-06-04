import { TonConnect } from "@tonconnect/sdk";
import * as Sentry from "@sentry/nextjs";

import { createNoopStorage } from "@utils";
import manifestUrl from "./manifest-url";

const defaultConnector = new TonConnect({
  storage: createNoopStorage(),
  manifestUrl,
});

const buildGetConnector = () => {
  let localStorageConnector: TonConnect | null = null;

  return () => {
    if (!window) {
      return defaultConnector;
    }

    if (!localStorageConnector) {
      localStorageConnector = new TonConnect();
    }

    localStorageConnector
      .restoreConnection()
      .catch((error) => Sentry.captureException(error));

    return localStorageConnector;
  };
};

export default buildGetConnector();
