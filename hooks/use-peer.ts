import { useEffect, useMemo, useState } from "react";
import Peer, { MediaConnection } from "peerjs";

interface PeerOptions {
  id?: string;
  otherId?: string;
  getLocalStream: () => Promise<MediaStream | null>;
  handleRemoteStream: (remoteStream: MediaStream) => unknown;
  onLocalStreamClose: () => unknown;
}

const usePeer = ({
  id,
  otherId,
  getLocalStream,
  handleRemoteStream,
  onLocalStreamClose,
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

  console.log("peer", peer);

  const [isConnected, setIsConnected] = useState(false);
  const [answeredCall, setAnsweredCall] = useState<MediaConnection | null>(
    null
  );

  useEffect(() => {
    if (peer && otherId) {
      const handleOpenedPeer = () => peer.connect(otherId);

      const handleConnection = () => {
        setIsConnected(true);

        if (peer && otherId && !answeredCall) {
          getLocalStream().then((localStream) => {
            if (!localStream) {
              return;
            }

            console.log(`${id} calling ${otherId}`, localStream);
            const call = peer.call(otherId, localStream);
            setAnsweredCall(call);
          });
        }
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setAnsweredCall(null);
        onLocalStreamClose();
      };

      const handleIncomingCall = async (call: MediaConnection) => {
        if (answeredCall) {
          return;
        }

        const localStream = await getLocalStream();

        if (!localStream) {
          return;
        }

        console.log(`${id} answering ${call.peer}`, localStream);
        call.answer(localStream);
        setAnsweredCall(call);
      };

      peer.on("open", () => handleOpenedPeer);
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
  }, [peer, id, otherId, answeredCall, getLocalStream, onLocalStreamClose]);

  useEffect(() => {
    const handleIncomingStream = (remoteStream: MediaStream) => {
      handleRemoteStream(remoteStream);
    };

    const handleIceStateChange = (state: RTCIceConnectionState) => {
      if (state === "closed" || state === "disconnected") {
        setIsConnected(false);
        setAnsweredCall(null);
        onLocalStreamClose();
      }
    };

    if (answeredCall) {
      answeredCall.on("stream", handleIncomingStream);
      answeredCall.on("iceStateChanged", handleIceStateChange);
    }

    return () => {
      if (answeredCall) {
        answeredCall.off("stream", handleIncomingStream);
        answeredCall.off("iceStateChanged", handleIceStateChange);
      }
    };
  }, [answeredCall, handleRemoteStream, onLocalStreamClose]);

  return {
    isConnected,
    call: answeredCall,
  };
};

export default usePeer;
