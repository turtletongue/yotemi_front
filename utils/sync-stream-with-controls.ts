const syncStreamWithControls = (
  stream: MediaStream,
  isVideo: boolean,
  isAudio: boolean
) => {
  console.log("v", stream.getVideoTracks());

  if (stream.getVideoTracks().length > 0) {
    stream.getVideoTracks()[0].enabled = isVideo;
  }

  console.log("a", stream.getAudioTracks());
  if (stream.getAudioTracks().length > 0) {
    stream.getAudioTracks()[0].enabled = isAudio;
  }
};

export default syncStreamWithControls;
