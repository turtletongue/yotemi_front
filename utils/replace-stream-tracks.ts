const replaceStreamTracks = (
  stream: MediaStream,
  tracks: MediaStreamTrack[]
) => {
  [...stream.getVideoTracks(), ...stream.getAudioTracks()].forEach((track) =>
    stream.removeTrack(track)
  );

  tracks.forEach((track) => stream.addTrack(track));
};

export default replaceStreamTracks;
