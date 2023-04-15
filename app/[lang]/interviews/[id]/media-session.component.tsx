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
import classnames from "classnames";

import {
  Avatar,
  ErrorDialog,
  ErrorNotification,
  SessionControl,
} from "@components";
import usePeer from "@hooks/use-peer";
import { Interview } from "@redux/features/interviews";
import {
  useMuteMutation,
  useRegisterPeerQuery,
  useTakePeerIdsQuery,
  useUnmuteMutation,
} from "@redux/features/peers";
import {
  selectIsChatOpened,
  setIsChatOpened,
} from "@redux/features/interview-messages";
import { useGetUserQuery } from "@redux/features/users";
import { selectUser } from "@redux/features/auth";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
import { Language, useTranslation } from "@app/i18n/client";
import { syncStreamWithControls } from "@utils";

interface MediaSessionProps {
  lang: Language;
  interview: Interview;
}

const MediaSession = ({ lang, interview }: MediaSessionProps) => {
  const { translation } = useTranslation(lang, "media-session");
  const authenticatedUser = useAppSelector(selectUser);

  const { data: { otherHasVideo } = {} } = useRegisterPeerQuery(interview.id);

  const otherUserId =
    authenticatedUser?.id === interview.creatorId
      ? interview.participant!.id
      : interview.creatorId;

  const { data: otherUser } = useGetUserQuery(otherUserId);

  const { data: { peerId, otherPeerId } = {} } = useTakePeerIdsQuery(
    interview.id
  );

  const remoteVideoOutput = useRef<HTMLVideoElement>(null);
  const localVideoOutput = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const [mute] = useMuteMutation();
  const [unmute] = useUnmuteMutation();

  const [isVideo, setIsVideo] = useState(false);
  const toggleVideo = () => {
    const options = { type: "video", interviewId: interview.id } as const;

    if (isVideo) {
      mute(options);
    } else {
      unmute(options);
    }

    setIsVideo(!isVideo);
  };

  const [isAudio, setIsAudio] = useState(false);
  const toggleAudio = () => {
    const options = { type: "audio", interviewId: interview.id } as const;

    if (isAudio) {
      mute(options);
    } else {
      unmute(options);
    }

    setIsAudio(!isAudio);
  };

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

  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      console.log("local", stream.getVideoTracks());

      syncStreamWithControls(stream, isVideo, isAudio);
      localStream.current = stream;

      console.log(localVideoOutput.current);
      if (localVideoOutput.current) {
        console.log("set");
        localVideoOutput.current.srcObject = stream;
      }

      return stream;
    } catch {
      setDialogError(translation("deviceError", { returnObjects: true }));

      return null;
    }
  }, [translation, isVideo, isAudio]);

  const handleRemoteStream = useCallback((remoteStream: MediaStream) => {
    if (remoteVideoOutput.current) {
      remoteVideoOutput.current.srcObject = remoteStream;
    }
  }, []);

  const { isConnected, call } = usePeer({
    id: peerId,
    otherId: otherPeerId,
    getLocalStream,
    handleRemoteStream,
  });

  const router = useRouter();
  const closeConnection = () => {
    if (call) {
      call.close();
      setIsFinished(true);
      router.back();
    }
  };

  useEffect(() => {
    if (localStream.current) {
      syncStreamWithControls(localStream.current, isVideo, isAudio);
    }
  }, [isVideo, isAudio]);

  useEffect(() => {
    if (!isConnected) {
      setIsAudio(false);
      setIsVideo(false);
    }
  }, [isConnected]);

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
        {otherHasVideo && (
          <video
            className="w-full"
            ref={remoteVideoOutput}
            autoPlay
            playsInline
            controls={false}
          />
        )}
        {!otherHasVideo && (
          <div className="w-full flex items-center justify-center">
            <Avatar img={otherUser?.avatarPath} size="xl" rounded />
          </div>
        )}
        <div
          className={`block ${classnames(
            otherHasVideo && "md:absolute"
          )} w-full bottom-0 my-6 flex gap-4 justify-center`}
        >
          <SessionControl onClick={toggleAudio}>
            {isAudio ? <MicOff size={20} /> : <Mic size={20} />}
          </SessionControl>
          <SessionControl onClick={toggleVideo}>
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

      <video
        className="w-1/2 md:w-52 absolute z-10 top-0 right-0"
        ref={localVideoOutput}
        autoPlay
        playsInline
        controls={false}
        muted
      />

      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
    </>
  );
};

export default MediaSession;
