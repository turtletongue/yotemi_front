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
  Wifi,
  WifiOff,
} from "react-feather";

import {
  AddReviewModal,
  Avatar,
  ErrorDialog,
  ErrorNotification,
  SessionControl,
} from "@components";
import usePeer from "@hooks/use-peer";
import { Interview } from "@store/features/interviews";
import {
  resetPeer,
  selectDisconnected,
  useDisconnectMutation,
  useMuteMutation,
  useRegisterPeerQuery,
  useTakePeerIdsQuery,
  useUnmuteMutation,
} from "@store/features/peers";
import { useGetReviewExistenceQuery } from "@store/features/reviews";
import {
  selectIsChatOpened,
  setIsChatOpened,
} from "@store/features/interview-messages";
import { useGetUserQuery } from "@store/features/users";
import { selectUser } from "@store/features/auth";
import { useAppDispatch, useAppSelector } from "@store/store-config/hooks";
import { Language, useTranslation } from "@app/i18n/client";
import {
  mergeAudioStreams,
  replaceConnectionTracks,
  syncStreamWithControls,
} from "@utils";
import { MediaConnection } from "peerjs";

interface MediaSessionProps {
  lang: Language;
  interview: Interview;
}

const handleStream = (
  stream: MediaStream,
  answeredCall: MediaConnection | null
) => {
  if (answeredCall) {
    replaceConnectionTracks(answeredCall, stream);
  }
};

const MediaSession = ({ lang, interview }: MediaSessionProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
  const changeVideo = async (
    isVideo: boolean,
    answeredCall: MediaConnection | null
  ) => {
    const options = { type: "video", interviewId: interview.id } as const;

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    if (isVideo) {
      setIsScreenSharing(false);
      handleStream(cameraStream, answeredCall);
      setLocalStream(cameraStream);
      unmute(options);
    } else {
      mute(options);
    }

    setIsVideo(isVideo);
  };

  const [isAudio, setIsAudio] = useState(false);
  const changeAudio = (isAudio: boolean) => {
    const options = { type: "audio", interviewId: interview.id } as const;

    if (isAudio) {
      unmute(options);
    } else {
      mute(options);
    }

    setIsAudio(isAudio);
  };

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const changeScreenSharing = useCallback(
    async (isScreenSharing: boolean, answeredCall: MediaConnection | null) => {
      const options = { type: "video", interviewId: interview.id } as const;

      const cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: true,
        });

        screenStream.getVideoTracks().forEach((track) => {
          track.addEventListener("ended", () =>
            changeScreenSharing(false, answeredCall)
          );
        });

        const mergedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...mergeAudioStreams(screenStream, cameraStream),
        ]);

        handleStream(mergedStream, answeredCall);
        setLocalStream(mergedStream);
        setIsVideo(false);
        unmute(options);
      } else {
        mute(options);

        handleStream(cameraStream, answeredCall);
        setLocalStream(cameraStream);
      }

      setIsScreenSharing(isScreenSharing);
    },
    [interview.id, mute, unmute]
  );

  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

  const isChatOpened = useAppSelector(selectIsChatOpened);
  const toggleChat = () => {
    dispatch(setIsChatOpened(!isChatOpened));
  };

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";

      return "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const onLocalStreamClose = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  }, [localStream]);

  useEffect(() => {
    return onLocalStreamClose;
  }, [onLocalStreamClose]);

  useEffect(() => {
    const onUnload = () => onLocalStreamClose();

    window.addEventListener("unload", onUnload);

    return () => window.removeEventListener("unload", onUnload);
  }, [onLocalStreamClose]);

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

  const { isConnected, peer, answeredCall } = usePeer({
    id: peerId,
    otherId: otherPeerId,
    localStream,
    handleRemoteStream,
    onLocalStreamClose,
    isCaller: authenticatedUser?.id === interview.creatorId,
  });

  useEffect(() => {
    if (!localStream) {
      const streamRequest = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      streamRequest
        .then(async (cameraStream) => {
          if (isScreenSharing) {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
              audio: true,
              video: true,
            });

            screenStream
              .getVideoTracks()
              .forEach((track) =>
                track.addEventListener("ended", () =>
                  changeScreenSharing(false, answeredCall)
                )
              );

            return new MediaStream([
              ...screenStream.getVideoTracks(),
              ...mergeAudioStreams(screenStream, cameraStream),
            ]);
          }

          return cameraStream;
        })
        .then((stream) => setLocalStream(stream))
        .catch(() => {
          setDialogError(translation("deviceError", { returnObjects: true }));
        });
    }
  }, [
    localStream,
    changeScreenSharing,
    answeredCall,
    isScreenSharing,
    translation,
  ]);

  const [disconnect] = useDisconnectMutation();

  const closeConnection = useCallback(
    (options: { sendSignal: boolean } = { sendSignal: false }) => {
      if (peer) {
        peer.destroy();
        onFinish();

        if (options.sendSignal) {
          disconnect({ interviewId: interview.id });
        }
      }
    },
    [disconnect, peer, onFinish, interview.id]
  );

  const disconnected = useAppSelector(selectDisconnected);

  useEffect(() => {
    if (disconnected) {
      closeConnection();
      dispatch(resetPeer());
    }
  }, [dispatch, closeConnection, disconnected]);

  useEffect(() => {
    if (peer && localStream) {
      syncStreamWithControls(localStream, isVideo || isScreenSharing, isAudio);
    }
  }, [localStream, peer, isVideo, isAudio, isScreenSharing]);

  useEffect(() => {
    if (peer && localStream && localVideoOutput.current) {
      localVideoOutput.current.srcObject = localStream;
    }
  }, [localStream, peer, isVideo, isScreenSharing]);

  useEffect(() => {
    if (remoteStream && remoteVideoOutput.current && otherHasVideo) {
      remoteVideoOutput.current.srcObject = new MediaStream(
        remoteStream.getVideoTracks()
      );
    }
  }, [remoteStream, otherHasVideo]);

  useEffect(() => {
    if (remoteStream && remoteAudioOutput.current && otherHasAudio) {
      remoteAudioOutput.current.srcObject = new MediaStream(
        remoteStream.getAudioTracks()
      );
    }
  }, [remoteStream, otherHasAudio]);

  useEffect(() => {
    mute({ type: "audio", interviewId: interview.id });
    setIsAudio(false);

    mute({ type: "video", interviewId: interview.id });
    setIsVideo(false);
    setIsScreenSharing(false);
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
          className="absolute max-h-full min-w-full overflow-hidden w-auto h-auto"
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
      <div className="w-full absolute bottom-0 my-6 flex gap-4 justify-center">
        <SessionControl onClick={() => changeAudio(!isAudio)}>
          {isAudio ? <MicOff size={20} /> : <Mic size={20} />}
        </SessionControl>
        <SessionControl onClick={() => changeVideo(!isVideo, answeredCall)}>
          {isVideo ? <CameraOff size={20} /> : <Camera size={20} />}
        </SessionControl>
        <SessionControl onClick={toggleChat}>
          <MessageSquare size={20} />
        </SessionControl>
        <SessionControl
          onClick={() => changeScreenSharing(!isScreenSharing, answeredCall)}
        >
          {isScreenSharing ? <WifiOff size={20} /> : <Wifi size={20} />}
        </SessionControl>
        <SessionControl onClick={() => closeConnection({ sendSignal: true })}>
          <PhoneOff size={20} className="text-danger" />
        </SessionControl>
      </div>
      {(isVideo || isScreenSharing) && (
        <video
          className="w-36 md:w-52 absolute z-10 top-0 right-0"
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
