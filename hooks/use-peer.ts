import { useCallback, useEffect, useMemo, useState } from "react";
import Peer, { MediaConnection } from "peerjs";

interface PeerOptions {
  id?: string;
  otherId?: string;
  isCaller: boolean;
  localStream: MediaStream | null;
  handleRemoteStream: (remoteStream: MediaStream) => unknown;
  onLocalStreamClose: () => unknown;
}

const usePeer = ({
  id,
  otherId,
  isCaller,
  localStream,
  handleRemoteStream,
  onLocalStreamClose,
}: PeerOptions) => {
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
  const [isStreamReceived, setIsStreamReceived] = useState(false);
  const [answeredCall, setAnsweredCall] = useState<MediaConnection | null>(
    null
  );

  const handleIceStateChange = useCallback(
    (state: RTCIceConnectionState) => {
      if (state === "closed" || state === "disconnected") {
        setIsConnected(false);
        setAnsweredCall(null);
        onLocalStreamClose();
      }
    },
    [onLocalStreamClose]
  );

  const handleConnection = useCallback(() => {
    setIsConnected(true);
    console.log("connection triggered", peer, otherId, isCaller);

    if (peer && otherId && isCaller) {
      if (answeredCall) {
        answeredCall.close();
      }

      if (!localStream) {
        return;
      }

      setIsStreamReceived(true);

      const call = peer.call(otherId, localStream);
      console.log("call", call);
      setAnsweredCall(call);

      call.on("stream", handleRemoteStream);
      call.on("iceStateChanged", handleIceStateChange);
    }
  }, [
    peer,
    otherId,
    isCaller,
    answeredCall,
    localStream,
    handleRemoteStream,
    handleIceStateChange,
  ]);

  useEffect(() => {
    if (!isStreamReceived && localStream) {
      handleConnection();
    }
  }, [localStream, isStreamReceived, handleConnection]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setAnsweredCall(null);
    onLocalStreamClose();
  }, [onLocalStreamClose]);

  const handleOpenedPeer = useCallback(() => {
    if (peer && otherId) {
      const connection = peer.connect(otherId);

      connection.on("open", handleConnection);
      connection.on("close", handleDisconnect);
    }
  }, [peer, otherId, handleConnection, handleDisconnect]);

  const handleIncomingCall = useCallback(
    async (call: MediaConnection) => {
      if (answeredCall) {
        answeredCall.close();
      }

      console.log("incoming call", call);

      if (!localStream) {
        return;
      }

      setIsStreamReceived(true);

      call.answer(localStream);
      setAnsweredCall(call);

      call.on("stream", handleRemoteStream);
      call.on("iceStateChanged", handleIceStateChange);
    },
    [localStream, answeredCall, handleRemoteStream, handleIceStateChange]
  );

  useEffect(() => {
    if (peer && otherId) {
      peer.on("open", handleOpenedPeer);
      peer.on("connection", handleConnection);
      peer.on("call", handleIncomingCall);
      peer.on("close", handleDisconnect);
      peer.on("disconnected", handleDisconnect);

      return () => {
        peer.off("open", handleOpenedPeer);
        peer.off("connection", handleConnection);
        peer.off("call", handleIncomingCall);
        peer.off("close", handleDisconnect);
        peer.off("disconnected", handleDisconnect);
      };
    }
  }, [
    peer,
    otherId,
    handleOpenedPeer,
    handleConnection,
    handleIncomingCall,
    handleDisconnect,
  ]);

  return {
    isConnected,
    peer,
    answeredCall,
  };
};

export default usePeer;
