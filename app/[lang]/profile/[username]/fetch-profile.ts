import { User } from "@redux/features/users";

type ProfileResponse = { isFound: boolean; profile: User | null };

const fetchProfile = async (username: string): Promise<ProfileResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/by-username/${username}`,
    {
      next: { revalidate: 10 },
    }
  );

  if (response.status !== 200) {
    if (response.status === 404) {
      return { isFound: false, profile: null };
    }

    throw new Error("PROFILE_FETCH_FAILED");
  }

  const profile = await response.json();

  return { isFound: true, profile };
};

export default fetchProfile;
