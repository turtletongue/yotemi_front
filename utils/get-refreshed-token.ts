import axios from "axios";

const getRefreshedToken = async () => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/authentication/refresh`,
    null,
    {
      withCredentials: true,
    }
  );

  return data.accessToken;
};

export default getRefreshedToken;
