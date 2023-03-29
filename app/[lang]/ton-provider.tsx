"use client";

import { ReactElement, useEffect } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import axios, { AxiosError, HttpStatusCode } from "axios";

import { useAppSelector } from "@redux/store-config/hooks";
import { selectTargetUsername } from "@redux/features/auth";
import { getConnector, manifestUrl } from "@contract";
import { Language } from "@app/i18n";

interface TonProps {
  lang: Language;
  children: ReactElement;
}

export const TonProvider = ({ lang, children }: TonProps) => {
  const targetUsername = useAppSelector(selectTargetUsername);

  // temporary solution, tonconnect will be fixed soon
  useEffect(() => {
    (window as any).targetUsername = targetUsername;
  }, [targetUsername]);

  const getConnectParameters = async () => {
    const username = (window as any).targetUsername;

    if (!username) {
      return {};
    }

    try {
      const { data: user } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/by-username/${username}`
      );

      return { tonProof: user.authId };
    } catch (error: unknown) {
      if (
        !(error instanceof AxiosError) ||
        error.response?.status !== HttpStatusCode.NotFound
      ) {
        throw error;
      }

      return {};
    }
  };

  return (
    <>
      <TonConnectUIProvider
        manifestUrl={manifestUrl}
        language={lang}
        getConnectParameters={getConnectParameters}
        connector={getConnector()}
      >
        {children}
      </TonConnectUIProvider>
    </>
  );
};

export default TonProvider;
