import baseApi from "@store/features/base.api";
import PaginationResult from "@store/types/pagination-result";
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
    listPaginatedInterviews: builder.query<
      PaginationResult<Interview>,
      { page?: number; from?: string; participantId?: Id }
    >({
      query: ({ page = 1, ...params }) => ({
        url: "interviews",
        params: {
          ...params,
          page,
        },
      }),
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
    addInterview: builder.mutation<Interview, CreateInterview>({
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
    markInterviewAsDeployed: builder.mutation<void, Id>({
      query: (id) => ({
        url: `interviews/${id}/mark-deployed`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => {
        return [{ type: "Interviews", id }];
      },
    }),
  }),
});

export const {
  useListInterviewsQuery,
  useGetInterviewQuery,
  useListPaginatedInterviewsQuery,
  useCheckInterviewTimeConflictMutation,
  useAddInterviewMutation,
  useConfirmInterviewPaymentMutation,
  useMarkInterviewAsDeployedMutation,
} = interviewsApi;

export default interviewsApi;
