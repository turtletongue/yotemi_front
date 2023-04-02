import baseApi from "@redux/features/base.api";
import { Id } from "@app/declarations";
import {
  CheckInterviewTimeConflict,
  ConfirmPayment,
  CreateInterview,
  Interview,
} from "./interfaces";

const interviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listInterviews: builder.query<
      { items: Interview[] },
      { creatorId: Id; from: string; to: string }
    >({
      query: ({ creatorId, from, to }) =>
        `interviews?creatorId=${creatorId}&from=${from}&to=${to}`,
      providesTags: (result) => {
        return result
          ? [
              ...result.items.map(
                ({ id }) => ({ type: "Interviews", id } as const)
              ),
              { type: "Interviews", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Interviews", id: "PARTIAL-LIST" }];
      },
    }),
    getInterview: builder.query<Interview, Id>({
      query: (id) => `interviews/${id}`,
      providesTags: (_result, _error, id) => {
        return [{ type: "Interviews", id }];
      },
    }),
    addInterview: builder.mutation<void, CreateInterview>({
      query: (interview) => ({
        url: "interviews",
        method: "POST",
        body: interview,
      }),
    }),
    checkInterviewTimeConflict: builder.mutation<
      void,
      CheckInterviewTimeConflict
    >({
      query: (interview) => ({
        url: "interviews/check-conflicts",
        method: "POST",
        body: interview,
      }),
    }),
    confirmInterviewPayment: builder.mutation<void, ConfirmPayment>({
      query: ({ id, ...data }) => ({
        url: `interviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => {
        return [{ type: "Interviews", id }];
      },
    }),
  }),
});

export const {
  useListInterviewsQuery,
  useGetInterviewQuery,
  useCheckInterviewTimeConflictMutation,
  useAddInterviewMutation,
  useConfirmInterviewPaymentMutation,
} = interviewsApi;

export default interviewsApi;
