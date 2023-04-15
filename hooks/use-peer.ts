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
  const peer = useMemo(
    () => (id ? new Peer(id, { config: { iceServers } }) : new Peer()),
    [id, iceServers]
  );

  const [isConnected, setIsConnected] = useState(false);
  const [call, setCall] = useState<MediaConnection | null>(null);

  const makeCall = useCallback(() => {
    if (otherId && !call) {
      console.log("call", otherId);

      getLocalStream().then((localStream) => {
        if (!localStream) {
          return;
        }

        const call = peer.call(otherId, localStream);
        setIsConnected(true);
        setCall(call);

        call.on("stream", (remoteStream) => {
          console.log("call remote", remoteStream.getVideoTracks());
          handleRemoteStream(remoteStream);
        });

        call.on("close", () => setIsConnected(false));
      });
    }
  }, [peer, otherId, getLocalStream, handleRemoteStream, call]);

  peer.on("call", async (call) => {
    setIsConnected(true);
    setCall(call);

    const localStream = await getLocalStream();

    if (!localStream) {
      return;
    }

    call.answer(localStream);

    console.log("answer");

    call.on("stream", (remoteStream) => {
      console.log("answer remote", remoteStream.getVideoTracks());
      handleRemoteStream(remoteStream);
    });

    call.on("close", () => setIsConnected(false));
  });

  if (otherId) {
    peer.on("open", makeCall);
  }

  return {
    isConnected,
    makeCall,
    call,
  };
};

export default usePeer;
