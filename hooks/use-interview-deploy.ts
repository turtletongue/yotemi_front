import { Address, Cell, toNano } from "ton-core";
import { CHAIN } from "@tonconnect/protocol";
import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

import InterviewContract, { getConnector, getSender } from "@contract";
import { sleep } from "@utils";

type DeployResult = {
  address: string;
  executeTransaction: () => Promise<string | void>;
};

const useInterviewDeploy = (contractCode: string) => {
  const network = getConnector().wallet?.account?.chain ?? null;

  return (
    price: number,
    creatorAddress: string,
    startAt: Date,
    endAt: Date
  ): DeployResult => {
    const contract = InterviewContract.createForDeploy(
      Cell.fromBase64(contractCode),
      BigInt(toNano(price.toFixed(9))),
      Address.parse(creatorAddress),
      startAt,
      endAt
    );

    const executeTransaction = async () => {
      const client = new TonClient({
        endpoint: await getHttpEndpoint({
          network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
        }),
      });

      if (!client) {
        return;
      }

      if (await client.isContractDeployed(contract.address)) {
        return;
      }

      const openedContract = client.open(contract);

      try {
        await openedContract.sendDeploy(getSender());
      } catch {
        return;
      }

      while (!(await client.isContractDeployed(contract.address))) {
        await sleep(500);
      }

      return contract.address.toRawString();
    };

    return { address: contract.address.toRawString(), executeTransaction };
  };
};

export default useInterviewDeploy;
