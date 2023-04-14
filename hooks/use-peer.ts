import { useCallback, useEffect, useMemo, useState } from "react";
import Peer from "peerjs";

export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

interface PeerOptions {
  id?: string;
  otherId?: string;
  onCall: () => Promise<MediaStream>;
  onCallData: (remoteStream: MediaStream) => unknown;
  iceServers?: IceServer[];
}

const usePeer = ({
  id,
  otherId,
  onCall,
  onCallData,
  iceServers = [],
}: PeerOptions) => {
  const peer = useMemo(
    () => (id ? new Peer(id, { config: { iceServers } }) : new Peer()),
    [id, iceServers]
  );
  const [isConnected, setIsConnected] = useState(false);

  console.log(id, otherId);
  console.log(peer);

  peer.on("connection", () => setIsConnected(true));
  peer.on("open", () => {
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
    }
  });

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
    call.on("close", () => console.log("call closed"));
  });

  peer.on("close", () => {
    console.log("closed");
  });

  return { isConnected, call };
};

export default usePeer;
