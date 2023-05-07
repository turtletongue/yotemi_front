import { Interview } from "@store/features/interviews";
import { Id } from "@app/declarations";

type InterviewResponse = { isFound: boolean; interview: Interview | null };

const fetchInterview = async (id: Id): Promise<InterviewResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/interviews/${id}`
  );

  if (response.status !== 200) {
    if (response.status === 404 || response.status === 500) {
      return { isFound: false, interview: null };
    }

    throw new Error("INTERVIEW_FETCH_FAILED");
  }

  const interview = await response.json();

  return {
    isFound: true,
    interview,
  };
};

export default fetchInterview;
