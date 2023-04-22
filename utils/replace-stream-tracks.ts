const replaceStreamTracks = (
  stream: MediaStream,
  streamReplacement: MediaStream
) => {
  stream.getVideoTracks().forEach((track) => {
    stream.removeTrack(track);
  });
  streamReplacement.getVideoTracks().forEach((track) => {
    stream.addTrack(track);
  });

  stream.getAudioTracks().forEach((track) => {
    stream.removeTrack(track);
  });
  streamReplacement.getAudioTracks().forEach((track) => {
    stream.addTrack(track);
  });
};

export default replaceStreamTracks;
