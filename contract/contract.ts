import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  fromNano,
  Sender,
} from "ton-core";

export type InterviewContractInfo = {
  price: number;
  creatorAddress: string;
  payerAddress: string;
  startAt: string;
  endAt: string;
  status: "created" | "paid" | "canceled" | "finished";
};

export default class InterviewContract implements Contract {
  static readonly operations = {
    buy: 1,
    cancel: 2,
    finish: 3,
  };

  static readonly status = {
    created: 1,
    paid: 2,
    canceled: 3,
    finished: 4,
  };

  static createForDeploy(
    code: Cell,
    price: bigint,
    creatorAddress: Address,
    startAt: Date,
    endAt: Date
  ): InterviewContract {
    const data = beginCell()
      .storeUint(price, 64)
      .storeAddress(creatorAddress)
      .storeAddress(creatorAddress)
      .storeUint(Math.floor(startAt.getTime() / 1000), 32)
      .storeUint(Math.floor(endAt.getTime() / 1000), 32)
      .storeUint(InterviewContract.status.created, 3)
      .endCell();
    const workchain = 0;
    const address = contractAddress(workchain, { code, data });

    return new InterviewContract(address, { code, data });
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  async sendDeploy(provider: ContractProvider, via: Sender): Promise<void> {
    await provider.internal(via, {
      value: "0.01",
      bounce: false,
    });
  }

  async getInterview(
    provider: ContractProvider
  ): Promise<InterviewContractInfo> {
    const { stack } = await provider.get("info", []);

    return {
      price: +fromNano(stack.readBigNumber()),
      creatorAddress: stack.readAddress().toRawString(),
      payerAddress: stack.readAddress().toRawString(),
      startAt: new Date(stack.readNumber() * 1000).toISOString(),
      endAt: new Date(stack.readNumber() * 1000).toISOString(),
      status: (
        {
          [InterviewContract.status.created]: "created",
          [InterviewContract.status.paid]: "paid",
          [InterviewContract.status.canceled]: "canceled",
          [InterviewContract.status.finished]: "finished",
        } as const
      )[stack.readNumber()],
    };
  }

  async sendInterviewPurchase(
    provider: ContractProvider,
    via: Sender,
    value: number
  ): Promise<void> {
    const messageBody = beginCell()
      .storeUint(InterviewContract.operations.buy, 32)
      .endCell();

    await provider.internal(via, {
      value: (value + 0.01).toFixed(9),
      body: messageBody,
    });
  }

  async sendInterviewCancellation(
    provider: ContractProvider,
    via: Sender
  ): Promise<void> {
    const messageBody = beginCell()
      .storeUint(InterviewContract.operations.cancel, 32)
      .endCell();

    await provider.internal(via, {
      value: "0.01",
      body: messageBody,
    });
  }

  async sendInterviewFinish(
    provider: ContractProvider,
    via: Sender
  ): Promise<void> {
    const messageBody = beginCell()
      .storeUint(InterviewContract.operations.finish, 32)
      .endCell();

    await provider.internal(via, {
      value: "0.01",
      body: messageBody,
    });
  }
}
