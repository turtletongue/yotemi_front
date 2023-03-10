"use client";

import { ReactElement } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import { Language } from "@app/i18n";

interface TonProps {
  lang: Language;
  children: ReactElement;
}

const manifestUrl =
  process.env.NEXT_PUBLIC_FRONT_URL + "/tonconnect-manifest.json";

const TonProvider = ({ lang, children }: TonProps) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl} language={lang}>
      {children}
    </TonConnectUIProvider>
  );
};

export default TonProvider;
