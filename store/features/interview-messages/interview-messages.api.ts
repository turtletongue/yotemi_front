import baseApi from "@store/features/base.api";
import PaginationResult from "@store/types/pagination-result";
import { Id } from "@app/declarations";
import { getSocket } from "@utils";
import { CreateInterviewMessage, InterviewMessage } from "./interfaces";

const interviewMessagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listInterviewMessages: builder.query<
      Pick<PaginationResult<InterviewMessage>, "items">,
      Id
    >({
      query: (id) => `interview-messages?interviewId=${id}`,
      providesTags: (result) => {
        return result
          ? [
              ...result.items.map(
                ({ id }) => ({ type: "InterviewMessages", id } as const)
              ),
              { type: "InterviewMessages", id: "LIST" },
            ]
          : [{ type: "InterviewMessages", id: "LIST" }];
      },
      onCacheEntryAdded: async (arg, api) => {
        try {
          await api.cacheDataLoaded;
          const socket = await getSocket();

          socket.on("interview-message.created", (data) => {
            api.updateCachedData((draft) => {
              draft.items.push(data);
            });
          });

          await api.cacheEntryRemoved;
          socket.close();
        } catch {}
      },
    }),
    getInterviewMessage: builder.query<InterviewMessage, Id>({
      query: (id) => `interview-messages/${id}`,
      providesTags: (_result, _error, id) => {
        return [{ type: "InterviewMessages", id }];
      },
    }),
    addInterviewMessage: builder.mutation<void, CreateInterviewMessage>({
      query: (data) => ({
        url: "interview-messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [], // tags do not need to be invalidated because of websockets
    }),
  }),
});

export const { useListInterviewMessagesQuery, useAddInterviewMessageMutation } =
  interviewMessagesApi;

export default interviewMessagesApi;
