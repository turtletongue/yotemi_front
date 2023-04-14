import { useCallback, useEffect, useMemo, useState } from "react";
import Peer, { DataConnection } from "peerjs";

export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

interface PeerOptions {
  id?: string;
  otherId?: string;
  onCall: () => Promise<MediaStream>;
  onCallData: (remoteStream: MediaStream) => unknown;
  onFinish?: () => unknown;
  onError?: (error: Error) => unknown;
  iceServers?: IceServer[];
}

const usePeer = ({
  id,
  otherId,
  onCall,
  onCallData,
  onFinish,
  onError,
  iceServers = [],
}: PeerOptions) => {
  const peer = useMemo(
    () => (id ? new Peer(id, { config: { iceServers } }) : new Peer()),
    [id, iceServers]
  );
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<DataConnection | null>(null);

  peer.on("connection", () => setIsConnected(true));
  peer.on("open", () => {
    if (otherId) {
      const connection = peer.connect(otherId);

      connection.on("open", () => setIsConnected(true));
      connection.on("close", () => setIsConnected(false));

      setConnection(connection);
    }
  });

  const call = useCallback(() => {
    if (isConnected && otherId) {
      onCall().then((stream) => {
        const call = peer.call(otherId, stream);
        call.on("stream", (remoteStream) => onCallData(remoteStream));

        if (onFinish) {
          call.on("close", onFinish);
        }
      });
    }
  }, [peer, otherId, onCall, onCallData, onFinish, isConnected]);

  useEffect(() => {
    call();
  }, [call]);

  peer.on("call", async (call) => {
    call.answer(await onCall());
    call.on("stream", (remoteStream) => onCallData(remoteStream));

    if (onFinish) {
      call.on("close", onFinish);
    }
  });

  if (onError) {
    peer.on("error", onError);
  }

  return { isConnected, connection, call };
};

export default usePeer;
