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
  onError?: (error: Error) => void;
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
  const [isCalled, setIsCalled] = useState(false);
  const [isRemoteVideo, setIsRemoteVideo] = useState(false);
  const [connection, setConnection] = useState<DataConnection | null>(null);

  peer.on("connection", () => setIsConnected(true));
  peer.on("open", () => {
    if (otherId) {
      const connection = peer.connect(otherId);

      connection.on("open", () => setIsConnected(true));
      connection.on("close", () => setIsConnected(false));

      if (onError) {
        connection.on("error", onError);
      }

      setConnection(connection);
    }
  });

  const createCall = useCallback(() => {
    if (isConnected && otherId && !isCalled) {
      onCall().then((stream) => {
        const call = peer.call(otherId, stream);
        setIsCalled(true);

        call.on("stream", (remoteStream) => {
          onCallData(remoteStream);
          setIsRemoteVideo(
            remoteStream.getVideoTracks().some((track) => track.enabled)
          );
        });

        if (onFinish) {
          call.on("close", onFinish);
        }
      });
    }
  }, [peer, otherId, onCall, onCallData, onFinish, isConnected, isCalled]);

  useEffect(() => {
    createCall();
  }, [createCall]);

  peer.on("call", async (call) => {
    call.answer(await onCall());

    call.on("stream", (remoteStream) => {
      onCallData(remoteStream);
      setIsRemoteVideo(
        remoteStream.getVideoTracks().some((track) => track.enabled)
      );
    });

    if (onFinish) {
      call.on("close", onFinish);
    }
  });

  if (onFinish) {
    peer.on("close", onFinish);
  }

  return {
    isConnected,
    isRemoteVideo,
    connection,
    createCall,
  };
};

export default usePeer;
