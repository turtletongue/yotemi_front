"use client";

import { ReactNode } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import { getConnector, manifestUrl } from "@contract";
import { Language } from "@app/i18n";

interface TonProps {
  lang: Language;
  children: ReactNode;
}

export const TonProvider = ({ lang, children }: TonProps) => {
  return (
    <>
      <TonConnectUIProvider
        manifestUrl={manifestUrl}
        language={lang}
        connector={getConnector()}
      >
        {children}
      </TonConnectUIProvider>
    </>
  );
};

export default TonProvider;
