import { useCallback, useMemo, useState } from "react";
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
  console.log(iceServers);
  const peer = useMemo(
    () => (id ? new Peer(id, { config: { iceServers } }) : null),
    [id]
  );

  const [isConnected, setIsConnected] = useState(false);
  const [call, setCall] = useState<MediaConnection | null>(null);

  const makeCall = useCallback(() => {
    if (peer && otherId && !call) {
      console.log("call", otherId);

      getLocalStream().then((localStream) => {
        if (!localStream) {
          return;
        }

        const call = peer.call(otherId, localStream);
        setCall(call);

        call.on("stream", (remoteStream) => {
          setIsConnected(true);
          console.log("call remote", remoteStream.getVideoTracks());
          handleRemoteStream(remoteStream);
        });

        call.on("close", () => setIsConnected(false));
      });
    }
  }, [peer, otherId, getLocalStream, handleRemoteStream, call]);

  peer?.on("call", async (call) => {
    const localStream = await getLocalStream();

    if (!localStream) {
      return;
    }

    call.answer(localStream);
    setCall(call);

    console.log("answer");

    call.on("stream", (remoteStream) => {
      setIsConnected(true);
      console.log("answer remote", remoteStream.getVideoTracks());
      handleRemoteStream(remoteStream);
    });

    call.on("close", () => setIsConnected(false));
  });

  if (peer && otherId) {
    peer.on("open", makeCall);
  }

  peer?.on("close", () => setIsConnected(false));
  peer?.on("disconnected", () => setIsConnected(false));

  return {
    isConnected,
    makeCall,
    call,
  };
};

export default usePeer;
