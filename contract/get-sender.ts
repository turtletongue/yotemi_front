import { SenderArguments } from "ton-core";

import getConnector from "./get-connector";

const FIVE_MINUTES = 5 * 60 * 1000;

const getSender = () => {
  return {
    send: async (args: SenderArguments) => {
      await getConnector().sendTransaction({
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body?.toBoc().toString("base64"),
          },
        ],
        validUntil: Date.now() + FIVE_MINUTES,
      });
    },
  };
};

export default getSender;
