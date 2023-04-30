"use client";

import { ReactNode, useEffect } from "react";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { useTonConnectUI } from "@tonconnect/ui-react";

import { useAppSelector } from "@redux/store-config/hooks";
import { selectTargetUsername } from "@redux/features/auth";

interface TonProofProviderProps {
  children: ReactNode;
}

const TonProofProvider = ({ children }: TonProofProviderProps) => {
  const [tonConnectUI] = useTonConnectUI();
  const targetUsername = useAppSelector(selectTargetUsername);

  useEffect(() => {
    if (targetUsername) {
      tonConnectUI.setConnectRequestParameters({
        state: "loading",
      });

      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/by-username/${targetUsername}`
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
            console.error(error);

            return;
          }

          tonConnectUI.setConnectRequestParameters(null);
        });
    }
  }, [tonConnectUI, targetUsername]);

  return <>{children}</>;
};

export default TonProofProvider;
