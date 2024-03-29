"use client";

import { ReactNode, useEffect } from "react";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { useTonConnectUI } from "@tonconnect/ui-react";
import * as Sentry from "@sentry/nextjs";

import { useAppSelector } from "@store/store-config/hooks";
import { selectTargetUsername } from "@store/features/auth";
import { useDebounce } from "@app/hooks";

interface TonProofProviderProps {
  children: ReactNode;
}

const TonProofProvider = ({ children }: TonProofProviderProps) => {
  const [tonConnectUI] = useTonConnectUI();
  const targetUsername = useAppSelector(selectTargetUsername);
  const debouncedUsername = useDebounce(targetUsername, 200);

  useEffect(() => {
    if (debouncedUsername) {
      tonConnectUI.setConnectRequestParameters({
        state: "loading",
      });

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/by-username/${debouncedUsername}`
        )
        .then(({ data: user }) => {
          tonConnectUI.setConnectRequestParameters({
            state: "ready",
            value: { tonProof: user.authId },
          });
        })
        .catch((error) => {
          if (
            !(error instanceof AxiosError) ||
            error.response?.status !== HttpStatusCode.NotFound
          ) {
            Sentry.captureException(error);

            return;
          }

          tonConnectUI.setConnectRequestParameters(null);
        });
    }
  }, [tonConnectUI, debouncedUsername]);

  return <>{children}</>;
};

export default TonProofProvider;
