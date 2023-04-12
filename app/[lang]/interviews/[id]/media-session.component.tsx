"use client";

import { useRef, useState } from "react";

import usePeer from "@hooks/use-peer";
import { Interview } from "@redux/features/interviews";
import { useAppSelector } from "@redux/store-config/hooks";
import { selectUser } from "@redux/features/auth";
import { Language, useTranslation } from "@app/i18n/client";

interface MediaSessionProps {
  lang: Language;
  interview: Interview;
}

const MediaSession = ({ lang, interview }: MediaSessionProps) => {
  const { translation } = useTranslation(lang, "media-session");
  const authenticatedUser = useAppSelector(selectUser);

  const peerId =
    authenticatedUser?.id === interview.creatorId
      ? interview.creatorId
      : interview.participant!.id;
  const otherPeerId =
    peerId === interview.creatorId
      ? interview.participant!.id
      : interview.creatorId;

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
    id: peerId.toString(),
    otherId: otherPeerId.toString(),
    onCall,
    onCallData,
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
