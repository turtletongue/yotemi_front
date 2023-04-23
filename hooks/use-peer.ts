import { useEffect, useMemo, useState } from "react";
import Peer, { MediaConnection } from "peerjs";

interface PeerOptions {
  id?: string;
  otherId?: string;
  isCaller: boolean;
  getLocalStream: () => Promise<MediaStream | null>;
  handleRemoteStream: (remoteStream: MediaStream) => unknown;
  onLocalStreamClose: () => unknown;
}

const usePeer = ({
  id,
  otherId,
  isCaller,
  getLocalStream,
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
  const [answeredCall, setAnsweredCall] = useState<MediaConnection | null>(
    null
  );

  useEffect(() => {
    if (peer && otherId) {
      const handleIceStateChange = (state: RTCIceConnectionState) => {
        if (state === "closed" || state === "disconnected") {
          setIsConnected(false);
          setAnsweredCall(null);
          onLocalStreamClose();
        }
      };

      const handleConnection = () => {
        setIsConnected(true);

        if (peer && otherId && isCaller) {
          getLocalStream().then((localStream) => {
            if (!localStream) {
              return;
            }

            const call = peer.call(otherId, localStream);
            setAnsweredCall(call);

            call.on("stream", handleRemoteStream);
            call.on("iceStateChanged", handleIceStateChange);
          });
        }
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setAnsweredCall(null);
        onLocalStreamClose();
      };

      const handleOpenedPeer = () => {
        const connection = peer.connect(otherId);

        connection.on("open", handleConnection);
        connection.on("close", handleDisconnect);
      };

      const handleIncomingCall = async (call: MediaConnection) => {
        if (answeredCall) {
          return;
        }

        const localStream = await getLocalStream();

        if (!localStream) {
          return;
        }

        call.answer(localStream);
        setAnsweredCall(call);

        call.on("stream", handleRemoteStream);
        call.on("iceStateChanged", handleIceStateChange);
      };

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
    id,
    otherId,
    isCaller,
    answeredCall,
    getLocalStream,
    onLocalStreamClose,
    handleRemoteStream,
  ]);

  return {
    isConnected,
    peer,
    answeredCall,
  };
};

export default usePeer;
