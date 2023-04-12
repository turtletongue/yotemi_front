import { io } from "socket.io-client";

import { getRefreshedToken } from "@utils";

const getSocket = async () => {
  return io(process.env.NEXT_PUBLIC_API_URL ?? "", {
    path: "/api/socket.io",
    auth: {
      token: await getRefreshedToken(),
    },
    transports: ["websocket"],
  });
};

export default getSocket;
