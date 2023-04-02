import axios from "axios";
import { Address } from "ton-core";

const tonApiToken = process.env.TONAPI_TOKEN;

const getSeqno = async (address: Address): Promise<number> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_TONAPI_URL}/wallet/getSeqno`,
    {
      params: {
        account: address.toRawString(),
      },
      headers: {
        Authorization: `Bearer ${tonApiToken}`,
      },
    }
  );

  return data?.seqno ?? -1;
};

export default getSeqno;
