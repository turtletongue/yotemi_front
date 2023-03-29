import { TonClient } from "ton";
import { Address, Cell, Sender } from "ton-core";
import { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN } from "@tonconnect/protocol";

import { getConnector, getSender } from "@contract";
import { OnlyFunctions } from "@utils";

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
    const network = getConnector().wallet?.account?.chain ?? null;

    if (!getConnector().connected || network === null) {
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
      return {
        data: await (api.type === "query"
          ? method(...parameters)
          : method(getSender(), ...parameters)),
      };
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
