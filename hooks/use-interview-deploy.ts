import * as fs from "fs";
import { Address, Cell, toNano } from "ton-core";
import { CHAIN } from "@tonconnect/protocol";
import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

import InterviewContract, { getConnector, getSender } from "@contract";

const contractCode = Cell.fromBoc(
  fs.readFileSync("./contract/compiled/interview.cell")
)[0];

const useInterviewDeploy = () => {
  const network = getConnector().wallet?.account?.chain ?? null;

  return async (
    price: number,
    creatorAddress: string,
    startAt: Date,
    endAt: Date
  ) => {
    const client = new TonClient({
      endpoint: await getHttpEndpoint({
        network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
      }),
    });

    const contract = InterviewContract.createForDeploy(
      contractCode,
      BigInt(toNano(price)),
      Address.parse(creatorAddress),
      startAt,
      endAt
    );

    if (!client) {
      return;
    }

    if (await client.isContractDeployed(contract.address)) {
      return;
    }

    const openedContract = client.open(contract);

    return await openedContract.sendDeploy(getSender());
  };
};

export default useInterviewDeploy;
