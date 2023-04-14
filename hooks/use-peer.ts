import { useCallback, useEffect, useMemo, useState } from "react";
import Peer, { DataConnection, MediaConnection } from "peerjs";

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
  const [isRemoteVideo, setIsRemoteVideo] = useState(false);
  const [connection, setConnection] = useState<DataConnection | null>(null);
  const [call, setCall] = useState<MediaConnection | null>(null);

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
    if (isConnected && otherId) {
      onCall().then((stream) => {
        const call = peer.call(otherId, stream);
        setCall(call);

        call.on("stream", (remoteStream) => {
          onCallData(remoteStream);
          console.log(remoteStream.getVideoTracks());
          setIsRemoteVideo(remoteStream.getVideoTracks().length > 0);
        });

        if (onFinish) {
          call.on("close", onFinish);
        }
      });
    }
  }, [peer, otherId, onCall, onCallData, onFinish, isConnected]);

  useEffect(() => {
    createCall();
  }, [createCall]);

  peer.on("call", async (call) => {
    call.answer(await onCall());
    call.on("stream", (remoteStream) => onCallData(remoteStream));

    if (onFinish) {
      call.on("close", onFinish);
    }
  });

  if (onFinish) {
    peer.on("close", onFinish);
  }

  const replaceMediaStream = useCallback(
    async (stream: MediaStream) => {
      if (!call || !call.peerConnection) {
        return;
      }

      return await Promise.all(
        call.peerConnection.getSenders().map(async (sender) => {
          if (
            sender.track?.kind === "audio" &&
            stream.getAudioTracks().length > 0
          ) {
            await sender.replaceTrack(stream.getAudioTracks()[0]);
          }

          if (
            sender.track?.kind === "video" &&
            stream.getVideoTracks().length > 0
          ) {
            await sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        })
      );
    },
    [call]
  );

  return {
    isConnected,
    isRemoteVideo,
    connection,
    createCall,
    replaceMediaStream,
  };
};

export default usePeer;
