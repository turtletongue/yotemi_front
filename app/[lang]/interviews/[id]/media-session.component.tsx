"use client";

import { useRef, useState } from "react";

import usePeer, { IceServer } from "@hooks/use-peer";
import { Interview } from "@redux/features/interviews";
import { useExchangePeerIdQuery } from "@redux/features/peers";
import { useAppSelector } from "@redux/store-config/hooks";
import { selectUser } from "@redux/features/auth";
import { Language, useTranslation } from "@app/i18n/client";

interface MediaSessionProps {
  lang: Language;
  interview: Interview;
  iceServers: IceServer[];
}

const MediaSession = ({ lang, interview, iceServers }: MediaSessionProps) => {
  const { translation } = useTranslation(lang, "media-session");
  const authenticatedUser = useAppSelector(selectUser);

  const otherUserId =
    authenticatedUser?.id === interview.creatorId
      ? interview.participant!.id
      : interview.creatorId;

  const { data: { peerId, otherPeerId } = {} } =
    useExchangePeerIdQuery(otherUserId);

  const videoOutput = useRef<HTMLVideoElement>(null);
  const [isVideo, setIsVideo] = useState(true);
  const [isAudio, setIsAudio] = useState(true);
  const [isDeviceSharing, setIsDeviceSharing] = useState(false);

  const onCall = async () => {
    return await navigator.mediaDevices.getUserMedia({
      video: isVideo,
      audio: isAudio,
    });
  };

  const onCallData = (remoteStream: MediaStream) => {
    if (videoOutput.current) {
      videoOutput.current.srcObject = remoteStream;
    }
  };

  const { isConnected } = usePeer({
    id: peerId?.toString(),
    otherId: otherPeerId?.toString(),
    onCall,
    onCallData,
    iceServers,
  });

  if (!isConnected) {
    return (
      <div className="grow flex justify-center items-center">
        <p>{translation("waitingConnection")}</p>
      </div>
    );
  }

  return (
    <video
      className="grow"
      ref={videoOutput}
      autoPlay
      playsInline
      controls={false}
    />
  );
};

export default MediaSession;
