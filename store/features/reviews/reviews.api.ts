import baseApi from "@store/features/base.api";
import PaginationResult from "@store/types/pagination-result";
import { Id } from "@app/declarations";
import { CreateReview, Review } from "./interfaces";

const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listReviews: builder.query<
      PaginationResult<Review>,
      { page: number; pageSize?: number; userId?: Id }
    >({
      query: ({ page, pageSize, userId }) => ({
        url: "reviews",
        params: {
          page,
          pageSize,
          userId,
          sortDirection: "desc",
        },
      }),
      providesTags: (result) => {
        return result
          ? [
              ...result.items.map(
                ({ id }) => ({ type: "Reviews", id } as const)
              ),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }];
      },
    }),
    getReviewExistence: builder.query<{ isExist: boolean }, Id>({
      query: (userId) => ({
        url: "reviews/existence",
        params: {
          userId,
        },
      }),
      providesTags: (_result, _error, id) => {
        return [{ type: "Reviews", id }];
      },
    }),
    addReview: builder.mutation<void, CreateReview>({
      query: (data) => ({
        url: "reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Reviews" }],
    }),
  }),
});

export const {
  useListReviewsQuery,
  useGetReviewExistenceQuery,
  useAddReviewMutation,
} = reviewsApi;

export default reviewsApi;
