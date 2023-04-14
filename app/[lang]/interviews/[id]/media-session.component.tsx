"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CameraOff,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
} from "react-feather";

import {
  Avatar,
  ErrorDialog,
  ErrorNotification,
  SessionControl,
} from "@components";
import usePeer, { IceServer } from "@hooks/use-peer";
import { Interview } from "@redux/features/interviews";
import { useExchangePeerIdQuery } from "@redux/features/peers";
import {
  selectIsChatOpened,
  setIsChatOpened,
} from "@redux/features/interview-messages";
import { useGetUserQuery } from "@redux/features/users";
import { selectUser } from "@redux/features/auth";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
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

  const { data: otherUser } = useGetUserQuery(otherUserId);

  const videoOutput = useRef<HTMLVideoElement>(null);
  const [isVideo, setIsVideo] = useState(true);
  const [isAudio, setIsAudio] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

  const dispatch = useAppDispatch();
  const isChatOpened = useAppSelector(selectIsChatOpened);
  const toggleChat = () => {
    dispatch(setIsChatOpened(!isChatOpened));
  };

  useEffect(() => {
    const onUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";

      return "";
    };

    window.addEventListener("beforeunload", onUnload);

    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  const onCall = useCallback(async () => {
    return await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: false,
    });
  }, []);

  const onCallData = useCallback((remoteStream: MediaStream) => {
    if (videoOutput.current) {
      videoOutput.current.srcObject = remoteStream;
    }
  }, []);

  const onFinish = useCallback(() => {
    setIsFinished(true);
  }, []);

  const onError = useCallback(() => {
    setDialogError(translation("connectionError", { returnObjects: true }));
  }, [translation]);

  const { isConnected, isRemoteVideo, connection, replaceMediaStream } =
    usePeer({
      id: peerId?.toString(),
      otherId: otherPeerId?.toString(),
      onCall,
      onCallData,
      onFinish,
      onError,
      iceServers,
    });

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: isVideo, audio: isAudio })
      .then((stream) => replaceMediaStream(stream));
  }, [replaceMediaStream, isVideo, isAudio]);

  const router = useRouter();
  const closeConnection = () => {
    if (connection) {
      connection.close();
      setIsFinished(true);
      router.back();
    }
  };

  useEffect(() => {
    const onTabClose = () => {
      if (connection && document.visibilityState === "hidden") {
        connection.close();
      }
    };

    document.addEventListener("visibilitychange", onTabClose);

    return () => document.removeEventListener("visibilitychange", onTabClose);
  }, [connection]);

  if (!isConnected || isFinished) {
    return (
      <div className="grow flex justify-center items-center">
        <p>
          {translation(isFinished ? "sessionFinished" : "waitingConnection")}
        </p>
      </div>
    );
  }

  return (
    <>
      <article className="grow absolute max-h-full">
        {isRemoteVideo && (
          <video
            className="w-full"
            ref={videoOutput}
            autoPlay
            playsInline
            controls={false}
          />
        )}
        {!isRemoteVideo && (
          <div className="w-full flex items-center justify-center">
            <Avatar img={otherUser?.avatarPath} size="xl" rounded />
          </div>
        )}
        <div className="block md:absolute w-full bottom-0 my-6 flex gap-4 justify-center">
          <SessionControl onClick={() => setIsAudio((isAudio) => !isAudio)}>
            {isAudio ? <MicOff size={20} /> : <Mic size={20} />}
          </SessionControl>
          <SessionControl onClick={() => setIsVideo((isVideo) => !isVideo)}>
            {isVideo ? <CameraOff size={20} /> : <Camera size={20} />}
          </SessionControl>
          <SessionControl onClick={toggleChat}>
            <MessageSquare size={20} />
          </SessionControl>
          <SessionControl onClick={closeConnection}>
            <PhoneOff size={20} className="text-danger" />
          </SessionControl>
        </div>
      </article>
      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
    </>
  );
};

export default MediaSession;
