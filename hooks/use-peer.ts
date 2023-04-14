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
  getLocalStream: () => Promise<MediaStream | null>;
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

  const [isOpened, setIsOpened] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [call, setCall] = useState<MediaConnection | null>(null);

  peer.on("open", () => setIsOpened(true));

  const makeCall = useCallback(() => {
    if (otherId && !call) {
      console.log("call", otherId);

      getLocalStream().then((localStream) => {
        if (!localStream) {
          return;
        }

        const call = peer.call(otherId, localStream);
        setCall(call);

        call.on("stream", (remoteStream) => {
          setIsConnected(true);
          console.log("call remote", remoteStream);
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
    const timerId = setTimeout(() => {
      if (isOpened) {
        makeCall();
      }
    }, 1500);

    return () => clearTimeout(timerId);
  }, [makeCall, isOpened]);

  peer.on("call", async (call) => {
    setCall(call);
    setIsConnected(true);

    const localStream = await getLocalStream();

    if (!localStream) {
      return;
    }

    call.answer(localStream);

    console.log("answer");

    call.on("stream", (remoteStream) => {
      console.log("answer remote", remoteStream);
      handleRemoteStream(remoteStream);
    });

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
