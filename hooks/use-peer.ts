import { useCallback, useEffect, useMemo, useState } from "react";
import Peer, { MediaConnection } from "peerjs";

interface PeerOptions {
  id?: string;
  otherId?: string;
  getLocalStream: () => Promise<MediaStream | null>;
  handleRemoteStream: (remoteStream: MediaStream) => unknown;
  onFinish?: () => unknown;
}

const usePeer = ({
  id,
  otherId,
  getLocalStream,
  handleRemoteStream,
  onFinish,
}: PeerOptions) => {
  console.log(id, otherId);

  const peer = useMemo(
    () =>
      id
        ? new Peer(id, {
            config: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: process.env.NEXT_PUBLIC_STUN_URL },
                { urls: process.env.NEXT_PUBLIC_STUN_SECOND_URL },
                {
                  urls: process.env.NEXT_PUBLIC_TURN_URL,
                  username: process.env.NEXT_PUBLIC_TURN_USERNAME,
                  credential: process.env.NEXT_PUBLIC_TURN_PASSWORD,
                },
                {
                  urls: process.env.NEXT_PUBLIC_TURN_SECOND_URL,
                  username: process.env.NEXT_PUBLIC_TURN_SECOND_USERNAME,
                  credential: process.env.NEXT_PUBLIC_TURN_SECOND_PASSWORD,
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

  const handleCall = useCallback(
    (call: MediaConnection) => {
      setAnsweredCall(call);

      call.on("stream", (remoteStream) => {
        setIsConnected(true);
        handleRemoteStream(remoteStream);
      });

      call.on("iceStateChanged", (state) => {
        if (state === "closed" || state === "disconnected") {
          setIsConnected(false);
          setAnsweredCall(null);
          onFinish?.();
        }
      });
    },
    [handleRemoteStream, onFinish]
  );

  const makeCall = useCallback(() => {
    if (peer && otherId && !answeredCall) {
      getLocalStream().then((localStream) => {
        if (!localStream) {
          return;
        }

        console.log(`${id} calling ${otherId}`, localStream);
        const call = peer.call(otherId, localStream);
        handleCall(call);
      });
    }
  }, [id, peer, otherId, getLocalStream, answeredCall, handleCall]);

  useEffect(() => {
    if (peer && otherId) {
      peer.on("open", makeCall);
    }
  }, [makeCall, peer, otherId]);

  const handleIncomingCall = useCallback(
    async (call: MediaConnection) => {
      if (answeredCall) {
        return;
      }

      const localStream = await getLocalStream();

      if (!localStream) {
        return;
      }

      console.log(`${id} answering ${call.peer}`, localStream);
      call.answer(localStream);
      handleCall(call);
    },
    [id, answeredCall, getLocalStream, handleCall]
  );

  peer?.on("call", handleIncomingCall);

  useEffect(() => {
    const handleDisconnect = () => {
      setIsConnected(false);
      setAnsweredCall(null);
      onFinish?.();
    };

    peer?.on("close", handleDisconnect);
    peer?.on("disconnected", handleDisconnect);

    return () => {
      peer?.off("close", handleDisconnect);
      peer?.off("disconnected", handleDisconnect);
    };
  }, [peer, onFinish]);

  return {
    isConnected,
    makeCall,
    call: answeredCall,
  };
};

export default usePeer;
