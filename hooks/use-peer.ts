import { useEffect, useMemo, useState } from "react";
import Peer from "peerjs";

interface PeerOptions {
  peerId: string;
  onCall: () => Promise<MediaStream>;
  onCallData: (remoteStream: MediaStream) => unknown;
}

const usePeer = ({ peerId, onCall, onCallData }: PeerOptions) => {
  const peer = useMemo(() => new Peer(), [peerId]);
  const [isConnected, setIsConnected] = useState(false);

  peer.on("connection", () => setIsConnected(true));

  useEffect(() => {
    const connection = peer.connect(peerId);

    connection.on("open", () => setIsConnected(true));

    return () => connection.close();
  }, []);

  const call = () => {
    if (isConnected) {
      onCall().then((stream) => {
        const call = peer.call(peerId, stream);
        call.on("stream", (remoteStream) => onCallData(remoteStream));
      });
    }
  };

  useEffect(() => {
    call();
  }, [peer, onCall, isConnected]);

  peer.on("call", async (call) => {
    call.answer(await onCall());
    call.on("stream", (remoteStream) => onCallData(remoteStream));
  });

  return { isConnected, call };
};

export default usePeer;
