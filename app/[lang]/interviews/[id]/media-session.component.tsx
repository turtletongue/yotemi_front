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
import classnames from "classnames";

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

  const remoteVideoOutput = useRef<HTMLVideoElement>(null);
  const localVideoOutput = useRef<HTMLVideoElement>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
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

  const onCall = useCallback(async () => new MediaStream(), []);

  const onCallData = useCallback((remoteStream: MediaStream) => {
    if (remoteVideoOutput.current) {
      remoteVideoOutput.current.srcObject = remoteStream;
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
    if (isVideo || isAudio) {
      navigator.mediaDevices
        .getUserMedia({ video: isVideo, audio: isAudio })
        .then((stream) => {
          if (localVideoOutput.current) {
            localVideoOutput.current.srcObject = stream;
          }

          return replaceMediaStream(stream);
        });
    } else {
      replaceMediaStream(new MediaStream()).then();
    }
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
      {isVideo && (
        <video
          className="w-1/4 absolute top-0 right-0"
          ref={localVideoOutput}
          autoPlay
          playsInline
          controls={false}
          muted
        />
      )}
      <article className="grow absolute max-h-full">
        {isRemoteVideo && (
          <video
            className="w-full"
            ref={remoteVideoOutput}
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
        <div
          className={`block ${classnames(
            isRemoteVideo && "md:absolute"
          )} w-full bottom-0 my-6 flex gap-4 justify-center`}
        >
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
