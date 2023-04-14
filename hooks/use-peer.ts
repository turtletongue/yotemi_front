import { useCallback, useEffect, useMemo, useState } from "react";
import Peer, { MediaConnection } from "peerjs";

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
  const [call, setCall] = useState<MediaConnection | null>(null);

  const makeCall = useCallback(() => {
    if (otherId && !call) {
      console.log("call", otherId);

      getLocalStream().then((stream) => {
        const call = peer.call(otherId, stream);
        setCall(call);

        call.on("stream", (remoteStream) => {
          setIsConnected(true);
          console.log("call remote", call.remoteStream);
          handleRemoteStream(remoteStream);
        });

        call.on("close", () => {
          setIsConnected(false);
          setCall(null);
        });
      });
    }
  }, [peer, otherId, getLocalStream, handleRemoteStream, call]);

  useEffect(() => {
    makeCall();
  }, [makeCall]);

  peer.on("call", async (call) => {
    setCall(call);
    setIsConnected(true);
    call.answer(await getLocalStream());

    console.log("answer");

    console.log("answer remote", call.remoteStream);
    handleRemoteStream(call.remoteStream);

    call.on("close", () => {
      setIsConnected(false);
      setCall(null);
    });
  });

  return {
    isConnected,
    makeCall,
    call,
  };
};

export default usePeer;
