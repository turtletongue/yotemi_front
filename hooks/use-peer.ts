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
  onFinish?: () => unknown;
  iceServers?: IceServer[];
}

const usePeer = ({
  id,
  otherId,
  getLocalStream,
  handleRemoteStream,
  onFinish,
  iceServers = [],
}: PeerOptions) => {
  const peer = useMemo(
    () => (id ? new Peer(id, { config: { iceServers } }) : new Peer()),
    [id, iceServers]
  );

  const [isConnected, setIsConnected] = useState(false);
  const [isCalled, setIsCalled] = useState(false);

  peer.on("connection", () => setIsConnected(true));
  peer.on("disconnected", () => setIsConnected(false));

  const call = useCallback(() => {
    if (otherId && !isCalled) {
      console.log("call", otherId);

      getLocalStream().then((stream) => {
        setIsCalled(true);
        const call = peer.call(otherId, stream);

        console.log("call remote", call.remoteStream);
        handleRemoteStream(call.remoteStream);

        call.on("close", () => {
          onFinish?.();
          setIsCalled(false);
        });
      });
    }
  }, [peer, otherId, getLocalStream, handleRemoteStream, onFinish, isCalled]);

  useEffect(() => {
    call();
  }, [call]);

  peer.on("call", async (call) => {
    setIsCalled(true);
    call.answer(await getLocalStream());

    console.log("answer");

    console.log("answer remote", call.remoteStream);
    handleRemoteStream(call.remoteStream);

    call.on("close", () => {
      onFinish?.();
      setIsCalled(false);
    });
  });

  return {
    isConnected,
    call,
  };
};

export default usePeer;
