"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
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
  AddReviewModal,
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
import { useGetReviewExistenceQuery } from "@redux/features/reviews";

interface MediaSessionProps {
  lang: Language;
  interview: Interview;
}

const MediaSession = ({ lang, interview }: MediaSessionProps) => {
  const router = useRouter();
  const { translation } = useTranslation(lang, "media-session");
  const authenticatedUser = useAppSelector(selectUser);

  const { data: { otherHasVideo, otherHasAudio } = {} } = useRegisterPeerQuery(
    interview.id
  );

  const otherUserId =
    authenticatedUser?.id === interview.creatorId
      ? interview.participant!.id
      : interview.creatorId;

  const { data: otherUser } = useGetUserQuery(otherUserId);

  const { data: { peerId, otherPeerId } = {} } = useTakePeerIdsQuery(
    interview.id
  );

  const remoteVideoOutput = useRef<HTMLVideoElement>(null);
  const remoteAudioOutput = useRef<HTMLAudioElement>(null);
  const localVideoOutput = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewModalOpened, setIsReviewModalOpened] = useState(false);

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

  const onLocalStreamClose = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  }, [localStream]);

  const changeLocalStream = useCallback(
    (stream: MediaStream) => {
      onLocalStreamClose();
      setLocalStream(stream);
    },
    [onLocalStreamClose]
  );

  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      changeLocalStream(stream);

      return stream;
    } catch {
      setDialogError(translation("deviceError", { returnObjects: true }));

      return null;
    }
  }, [translation, changeLocalStream]);

  const handleRemoteStream = useCallback((stream: MediaStream) => {
    setRemoteStream(stream);
  }, []);

  const { data: { isExist } = { isExist: null } } = useGetReviewExistenceQuery(
    interview.creatorId,
    { skip: interview.creatorId === authenticatedUser?.id }
  );

  const onFinish = useCallback(() => {
    setIsFinished(true);
    onLocalStreamClose();

    if (authenticatedUser?.id === interview.creatorId) {
      return router.push(`/profile/${authenticatedUser.username}`);
    }

    if (!isExist) {
      setIsReviewModalOpened(true);
    } else {
      router.push(`/profile/${otherUser?.username}`);
    }
  }, [
    router,
    isExist,
    onLocalStreamClose,
    authenticatedUser?.id,
    authenticatedUser?.username,
    otherUser?.username,
    interview.creatorId,
  ]);

  const { isConnected, peer } = usePeer({
    id: peerId,
    otherId: otherPeerId,
    getLocalStream,
    handleRemoteStream,
    onLocalStreamClose,
    isCaller: authenticatedUser?.id === interview.creatorId,
  });

  const closeConnection = () => {
    if (peer) {
      peer.destroy();
      onFinish();
    }
  };

  useEffect(() => {
    const onPageHidden = () => {
      if (document.visibilityState === "hidden") {
        onLocalStreamClose();
      }
    };

    document.addEventListener("visibilitychange", onPageHidden);

    return () => document.removeEventListener("visibilitychange", onPageHidden);
  }, [onLocalStreamClose]);

  useEffect(() => {
    if (peer && localStream) {
      syncStreamWithControls(localStream, isVideo, isAudio);

      if (localVideoOutput.current) {
        localVideoOutput.current.srcObject = localStream;
      }
    }
  }, [localStream, peer, isVideo, isAudio]);

  useEffect(() => {
    if (remoteStream && remoteVideoOutput.current && otherHasVideo) {
      remoteVideoOutput.current.srcObject = new MediaStream(
        remoteStream.getVideoTracks()
      );
    }

    if (remoteStream && remoteAudioOutput.current && otherHasAudio) {
      remoteAudioOutput.current.srcObject = new MediaStream(
        remoteStream.getAudioTracks()
      );
    }
  }, [remoteStream, otherHasVideo, otherHasAudio]);

  useEffect(() => {
    mute({ type: "audio", interviewId: interview.id });
    setIsAudio(false);

    mute({ type: "video", interviewId: interview.id });
    setIsVideo(false);
  }, [isConnected, mute, interview.id]);

  const isParticipant =
    authenticatedUser?.id === interview.creatorId ||
    authenticatedUser?.id === interview.participant?.id;
  const isInterviewFinished = new Date(interview.endAt) < new Date();

  if (!authenticatedUser || !isParticipant || isInterviewFinished) {
    return redirect("/");
  }

  if (!isConnected || isFinished) {
    return (
      <>
        <div className="grow flex justify-center items-center">
          <p>
            {translation(isFinished ? "sessionFinished" : "waitingConnection")}
          </p>
        </div>
        <AddReviewModal
          lang={lang}
          targetUserId={interview.creatorId}
          isOpen={isReviewModalOpened}
          onClose={() => setIsReviewModalOpened(false)}
          onError={() => {
            setDialogError(translation("reviewError", { returnObjects: true }));
          }}
        />
      </>
    );
  }

  return (
    <>
      {otherHasVideo && (
        <video
          className="absolute max-h-full min-w-full left-0 top-0 overflow-hidden w-auto h-auto"
          ref={remoteVideoOutput}
          autoPlay
          playsInline
          controls={false}
        />
      )}
      {otherHasAudio && (
        <audio
          ref={remoteAudioOutput}
          className="hidden"
          autoPlay
          controls={false}
        />
      )}
      {!otherHasVideo && (
        <div className="grow flex items-center justify-center">
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
      {isVideo && (
        <video
          className="w-1/2 md:w-52 absolute z-10 top-0 right-0"
          ref={localVideoOutput}
          autoPlay
          playsInline
          controls={false}
          muted
        />
      )}
      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
    </>
  );
};

export default MediaSession;
