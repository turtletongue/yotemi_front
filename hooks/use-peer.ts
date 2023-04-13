import { useCallback, useEffect, useMemo, useState } from "react";
import Peer from "peerjs";

interface PeerOptions {
  id?: string;
  otherId?: string;
  onCall: () => Promise<MediaStream>;
  onCallData: (remoteStream: MediaStream) => unknown;
}

const options = {
  config: {
    iceServers: [
      [
        {
          url: "stun:a.relay.metered.ca:80",
        },
        {
          url: "turn:a.relay.metered.ca:80?transport=tcp",
          username: "3af336c70304a8a685f3b5f3",
          credential: "4R1qY3NAUu39uke/",
        },
        {
          url: "turn:a.relay.metered.ca:443?transport=tcp",
          username: "3af336c70304a8a685f3b5f3",
          credential: "4R1qY3NAUu39uke/",
        },
      ],
    ],
  },
} as const;

const usePeer = ({ id, otherId, onCall, onCallData }: PeerOptions) => {
  const peer = useMemo(() => (id ? new Peer(id, options) : new Peer()), [id]);
  const [isConnected, setIsConnected] = useState(false);

  console.log(id, otherId);
  console.log(peer);

  peer.on("connection", () => setIsConnected(true));

  useEffect(() => {
    if (otherId) {
      const connection = peer.connect(otherId);

      console.log("connecting...");

      connection.on("open", () => {
        console.log("opened");
        setIsConnected(true);
      });
      connection.on("close", () => {
        console.log("closed");
        setIsConnected(false);
      });

      return () => connection.close();
    }
  }, [peer, otherId]);

  const call = useCallback(() => {
    if (isConnected && otherId) {
      console.log("call");
      onCall().then((stream) => {
        const call = peer.call(otherId, stream);
        call.on("stream", (remoteStream) => onCallData(remoteStream));
      });
    }
  }, [peer, otherId, onCall, onCallData, isConnected]);

  useEffect(() => {
    call();
  }, [call]);

  peer.on("call", async (call) => {
    call.answer(await onCall());
    call.on("stream", (remoteStream) => onCallData(remoteStream));
  });

  peer.on("close", () => {
    console.log("closed");
  });

  return { isConnected, call };
};

export default usePeer;
