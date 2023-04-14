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
  getLocalStream: () => Promise<MediaStream>;
  handleRemoteStream: (remoteStream: MediaStream) => unknown;
  iceServers?: IceServer[];
}

const usePeer = ({
  id,
  otherId,
  getLocalStream,
  handleRemoteStream,
  iceServers = [],
}: PeerOptions) => {
  const peer = useMemo(
    () => (id ? new Peer(id, { config: { iceServers } }) : new Peer()),
    [id, iceServers]
  );

  const [isConnected, setIsConnected] = useState(false);

  const call = useCallback(() => {
    if (otherId && !isConnected) {
      console.log("call", otherId);

      getLocalStream().then((stream) => {
        const call = peer.call(otherId, stream);

        call.on("stream", (remoteStream) => {
          setIsConnected(true);
          console.log("call remote", call.remoteStream);
          handleRemoteStream(remoteStream);
        });

        call.on("close", () => setIsConnected(false));
      });
    }
  }, [peer, otherId, getLocalStream, handleRemoteStream, isConnected]);

  useEffect(() => {
    call();
  }, [call]);

  peer.on("call", async (call) => {
    setIsConnected(true);
    call.answer(await getLocalStream());

    console.log("answer");

    console.log("answer remote", call.remoteStream);
    handleRemoteStream(call.remoteStream);

    call.on("close", () => setIsConnected(false));
  });

  return {
    isConnected,
    call,
  };
};

export default usePeer;
