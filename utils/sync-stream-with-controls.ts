const syncStreamWithControls = (
  stream: MediaStream,
  isVideo: boolean,
  isAudio: boolean
) => {
  if (stream.getVideoTracks().length > 0) {
    stream.getVideoTracks()[0].enabled = isVideo;
  }

  if (stream.getAudioTracks().length > 0) {
    stream.getAudioTracks()[0].enabled = isAudio;
  }
};

export default syncStreamWithControls;
