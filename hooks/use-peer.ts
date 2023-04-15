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
}

const usePeer = ({
  id,
  otherId,
  getLocalStream,
  handleRemoteStream,
}: PeerOptions) => {
  const peer = useMemo(
    () =>
      id
        ? new Peer(id, {
            debug: 3,
            config: {
              iceServers: [
                { urls: process.env.NEXT_PUBLIC_STUN_URL },
                {
                  urls: process.env.NEXT_PUBLIC_TURN_URL,
                  username: process.env.NEXT_PUBLIC_TURN_USERNAME,
                  credential: process.env.NEXT_PUBLIC_TURN_PASSWORD,
                },
              ],
            },
          })
        : null,
    [id]
  );

  const [isConnected, setIsConnected] = useState(false);
  const [answeredCall, setAnsweredCall] = useState<MediaConnection | null>(
    null
  );

  const makeCall = useCallback(() => {
    if (peer && otherId && !answeredCall) {
      console.log("call", otherId);

      getLocalStream().then((localStream) => {
        if (!localStream) {
          return;
        }

        const call = peer.call(otherId, localStream);
        setAnsweredCall(call);

        call.on("stream", (remoteStream) => {
          setIsConnected(true);
          console.log("call remote", remoteStream.getVideoTracks());
          handleRemoteStream(remoteStream);
        });

        call.on("close", () => {
          setIsConnected(false);
          setAnsweredCall(null);
        });
      });
    }
  }, [peer, otherId, getLocalStream, handleRemoteStream, answeredCall]);

  peer?.on("call", async (call) => {
    if (answeredCall) {
      return;
    }

    const localStream = await getLocalStream();

    if (!localStream) {
      return;
    }

    call.answer(localStream);
    setAnsweredCall(call);

    console.log("answer");

    call.on("stream", (remoteStream) => {
      setIsConnected(true);
      console.log("answer remote", remoteStream.getVideoTracks());
      handleRemoteStream(remoteStream);
    });

    call.on("close", () => {
      setIsConnected(false);
      setAnsweredCall(null);
    });
  });

  if (peer && otherId) {
    peer.on("open", makeCall);
  }

  peer?.on("close", () => {
    setIsConnected(false);
    setAnsweredCall(null);
  });
  peer?.on("disconnected", () => {
    setIsConnected(false);
    setAnsweredCall(null);
  });

  return {
    isConnected,
    makeCall,
    call: answeredCall,
  };
};

export default usePeer;
