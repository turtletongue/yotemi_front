import { useCallback, useEffect, useMemo, useState } from "react";
import Peer, { MediaConnection } from "peerjs";

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
        }
      });
    },
    [handleRemoteStream]
  );

  const makeCall = useCallback(() => {
    if (peer && otherId && !answeredCall) {
      getLocalStream().then((localStream) => {
        if (!localStream) {
          return;
        }

        const call = peer.call(otherId, localStream);
        handleCall(call);
      });
    }
  }, [peer, otherId, getLocalStream, answeredCall, handleCall]);

  useEffect(() => {
    const handleIncomingCall = async (call: MediaConnection) => {
      if (answeredCall) {
        return;
      }

      const localStream = await getLocalStream();

      if (!localStream) {
        return;
      }

      call.answer(localStream);
      handleCall(call);
    };

    peer?.on("call", handleIncomingCall);

    return () => {
      peer?.off("call", handleIncomingCall);
    };
  }, [peer, answeredCall, getLocalStream, handleRemoteStream, handleCall]);

  useEffect(() => {
    if (peer && otherId) {
      peer.on("open", makeCall);
    }

    return () => {
      peer?.off("open", makeCall);
    };
  }, [makeCall, peer, otherId]);

  useEffect(() => {
    const handleDisconnect = () => {
      setIsConnected(false);
      setAnsweredCall(null);
    };

    peer?.on("close", handleDisconnect);
    peer?.on("disconnected", handleDisconnect);

    return () => {
      peer?.off("close", handleDisconnect);
      peer?.off("disconnected", handleDisconnect);
    };
  }, [peer]);

  return {
    isConnected,
    makeCall,
    call: answeredCall,
  };
};

export default usePeer;
