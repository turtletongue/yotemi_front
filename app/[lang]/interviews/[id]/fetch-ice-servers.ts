import { IceServer } from "@hooks/use-peer";

const fetchIceServers = async () => {
  const response = await fetch(
    `https://yotemi.metered.live/api/v1/turn/credentials?apiKey=${process.env.METERED_TOKEN}`
  );

  const iceServers: IceServer[] = await response.json();

  return iceServers.map((server) => {
    if (Array.isArray(server.urls)) {
      return server;
    }

    if (!server.urls.startsWith("turn")) {
      return server;
    }

    const isTransportSet =
      server.urls.endsWith("udp") || server.urls.endsWith("tcp");

    if (isTransportSet) {
      return server;
    }

    return { ...server, urls: server.urls + "?transport=udp" };
  });
};

export default fetchIceServers;
