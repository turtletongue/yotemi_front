import { io } from "socket.io-client";

import { getRefreshedToken } from "@utils";

const getSocket = async () => {
  return io(process.env.NEXT_PUBLIC_API_URL ?? "", {
    auth: {
      token: await getRefreshedToken(),
    },
  });
};

export default getSocket;
