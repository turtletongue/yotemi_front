import { MediaConnection } from "peerjs";

const replaceStreamTracks = (
  connection: MediaConnection,
  streamReplacement: MediaStream
) => {
  connection.peerConnection.getSenders().forEach((sender) => {
    if (
      sender.track?.kind === "video" &&
      streamReplacement.getVideoTracks().length > 0
    ) {
      sender.replaceTrack(streamReplacement.getVideoTracks()[0]).then();
    }

    if (
      sender.track?.kind === "audio" &&
      streamReplacement.getAudioTracks().length > 0
    ) {
      sender.replaceTrack(streamReplacement.getAudioTracks()[0]).then();
    }
  });
};

export default replaceStreamTracks;
