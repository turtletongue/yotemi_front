import { TonClient } from "ton";
import { Address, Cell, Sender } from "ton-core";
import { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { UserRejectsError } from "@tonconnect/sdk";
import { CHAIN } from "@tonconnect/protocol";
import * as Sentry from "@sentry/nextjs";

import { getConnector, getSender } from "@contract";
import { getSeqno, OnlyFunctions, sleep } from "@utils";

const getContractQuery = <
  T extends { address: Address; init?: { code: Cell; data: Cell } }
>(
  Contract: new (address: Address, options?: { code: Cell; data: Cell }) => T
): BaseQueryFn<
  {
    address: string;
    method: OnlyFunctions<T>;
    parameters?: any[];
  },
  unknown,
  FetchBaseQueryError
> => {
  return async ({ parameters = [], ...args }, api) => {
    const connector = getConnector();

    const network = connector.wallet?.account?.chain ?? null;

    if (!connector.connected || !connector.account || network === null) {
      return {
        error: { status: 400, data: { description: "WALLET_NOT_CONNECTED" } },
      };
    }

    const client = new TonClient({
      endpoint: await getHttpEndpoint({
        network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
      }),
    });

    const openedContract = client.open(
      new Contract(Address.parse(args.address))
    );

    const method = openedContract[args.method] as (
      sender: Sender | void,
      ...params: any[]
    ) => Promise<T[typeof args.method] | void>;

    try {
      if (api.type === "query") {
        return { data: await method(...parameters) };
      }

      const accountAddress = Address.parse(connector.account.address);
      let seqno = await getSeqno(accountAddress);

      const data = await method(getSender(), ...parameters);

      let currentSeqno = seqno;
      while (currentSeqno === seqno) {
        currentSeqno = await getSeqno(accountAddress);
        await sleep(500);
      }

      return { data };
    } catch (error: unknown) {
      if (
        error instanceof UserRejectsError ||
        (error instanceof Error && error.message.includes("Reject request"))
      ) {
        return {
          error: {
            status: 400,
            data: {
              description: "USER_REJECTED_CALL",
              message: error.message,
            },
          },
        };
      }

      Sentry.captureException(error);

      return {
        error: {
          status: 500,
          data: {
            description: "CONTRACT_METHOD_CALL_FAILED",
            ...(error instanceof Error && { message: error.message }),
          },
        },
      };
    }
  };
};

export default getContractQuery;
