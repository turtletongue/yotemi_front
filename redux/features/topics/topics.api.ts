import baseApi from "@redux/features/base.api";
import PaginationResult from "@redux/types/pagination-result";
import { Id } from "@app/declarations";
import { CreateTopic, Topic } from "./interfaces";

const topicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTopics: builder.query<
      PaginationResult<Topic>,
      { page: number; search?: string }
    >({
      query: ({ page, search = "" }) => `topics?page=${page}&search=${search}`,
      providesTags: (result) => {
        return result
          ? [
              ...result.items.map(
                ({ id }) => ({ type: "Topics", id } as const)
              ),
              { type: "Topics", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Topics", id: "PARTIAL-LIST" }];
      },
    }),
    getTopic: builder.query<Topic, Id>({
      query: (id) => `topics/${id}`,
      providesTags: (_result, _error, id) => {
        return [{ type: "Topics", id }];
      },
    }),
    addTopic: builder.mutation<{ id: Id }, CreateTopic>({
      query: (data) => ({
        url: "topics",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Topics", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const { useListTopicsQuery, useGetTopicQuery, useAddTopicMutation } =
  topicsApi;

export default topicsApi;
