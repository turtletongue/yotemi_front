import baseApi from "@redux/features/base.api";
import { Id } from "@app/declarations";
import { CreateReview } from "./interfaces";

const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetReviewExistenceQuery, useAddReviewMutation } = reviewsApi;

export default reviewsApi;
