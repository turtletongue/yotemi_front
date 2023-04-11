"use client";

import { useRef, useState } from "react";

import usePeer from "@hooks/use-peer";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";

interface MediaSessionProps {
  lang: Language;
  interviewId: Id;
}

const MediaSession = ({ lang, interviewId }: MediaSessionProps) => {
  const { translation } = useTranslation(lang, "media-session");

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
    peerId: interviewId.toString(),
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
