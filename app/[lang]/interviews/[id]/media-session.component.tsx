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
  Radio,
} from "react-feather";

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
  resetPeer,
  selectDisconnected,
  useDisconnectMutation,
  useMuteMutation,
  useRegisterPeerQuery,
  useTakePeerIdsQuery,
  useUnmuteMutation,
} from "@redux/features/peers";
import { useGetReviewExistenceQuery } from "@redux/features/reviews";
import {
  selectIsChatOpened,
  setIsChatOpened,
} from "@redux/features/interview-messages";
import { useGetUserQuery } from "@redux/features/users";
import { selectUser } from "@redux/features/auth";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
import { Language, useTranslation } from "@app/i18n/client";
import {
  mergeAudioStreams,
  replaceStreamTracks,
  syncStreamWithControls,
} from "@utils";
import { MediaConnection } from "peerjs";

interface MediaSessionProps {
  lang: Language;
  interview: Interview;
}

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
  const changeVideo = (isVideo: boolean) => {
    const options = { type: "video", interviewId: interview.id } as const;

    if (isVideo) {
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
  const changeScreenSharing = async (
    isScreenSharing: boolean,
    answeredCall: MediaConnection | null
  ) => {
    const handleStream = (stream: MediaStream) => {
      if (answeredCall) {
        replaceStreamTracks(answeredCall, stream);
      }
    };

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    if (isScreenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });

      const mergedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...mergeAudioStreams(screenStream, cameraStream),
      ]);

      console.log("sharing on", answeredCall);
      handleStream(mergedStream);
      setLocalStream(mergedStream);
      changeVideo(true);
    } else {
      changeVideo(false);

      console.log("sharing off", answeredCall);
      handleStream(cameraStream);
      setLocalStream(cameraStream);
    }

    setIsScreenSharing(isScreenSharing);
  };

  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

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

  useEffect(() => {
    return onLocalStreamClose;
  }, [onLocalStreamClose]);

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
  }, [localStream, isScreenSharing, translation]);

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
        <SessionControl onClick={() => changeVideo(!isVideo)}>
          {isVideo ? <CameraOff size={20} /> : <Camera size={20} />}
        </SessionControl>
        <SessionControl onClick={toggleChat}>
          <MessageSquare size={20} />
        </SessionControl>
        <SessionControl
          onClick={() => changeScreenSharing(!isScreenSharing, answeredCall)}
        >
          <Radio size={20} />
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
