import { Review } from "@store/features/reviews";
import { Id } from "@app/declarations";

const fetchReviews = async (userId: Id): Promise<Review[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/reviews?userId=${userId}&pageSize=4&sortDirection=desc`,
    {
      next: { revalidate: 10 },
    }
  );

  if (response.status !== 200) {
    throw new Error("REVIEWS_FETCH_FAILED");
  }

  return await response.json().then((paginated) => paginated.items);
};

export default fetchReviews;
