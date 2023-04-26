const mergeAudioStreams = (
  firstStream: MediaStream,
  secondStream: MediaStream
) => {
  const context = new AudioContext();

  const firstSource = context.createMediaStreamSource(firstStream);
  const secondSource = context.createMediaStreamSource(secondStream);
  const destination = context.createMediaStreamDestination();

  const desktopGain = context.createGain();
  const voiceGain = context.createGain();

  desktopGain.gain.value = 0.7;
  voiceGain.gain.value = 0.7;

  firstSource.connect(desktopGain).connect(destination);
  secondSource.connect(voiceGain).connect(destination);

  return destination.stream.getAudioTracks();
};

export default mergeAudioStreams;
