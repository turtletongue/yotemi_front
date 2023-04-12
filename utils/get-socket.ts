import { io } from "socket.io-client";

import { getRefreshedToken } from "@utils";

const getSocket = async () => {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "", {
    auth: {
      token: await getRefreshedToken(),
    },
    transports: ["websocket"],
  });
};

export default getSocket;
