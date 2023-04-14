const fetchIceServers = async () => {
  const response = await fetch(
    `https://yotemi.metered.live/api/v1/turn/credentials?apiKey=${process.env.METERED_TOKEN}`
  );

  return await response.json();
};

export default fetchIceServers;
