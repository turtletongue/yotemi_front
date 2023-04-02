import { TonClient } from "ton";
import { Address, Cell, Sender } from "ton-core";
import { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN } from "@tonconnect/protocol";

import { getConnector, getSender } from "@contract";
import { getSeqno, OnlyFunctions } from "@utils";

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
      }

      return { data };
    } catch (error: unknown) {
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
