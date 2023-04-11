import baseApi from "@redux/features/base.api";
import PaginationResult from "@redux/types/pagination-result";
import { Notification } from "./interfaces";
import { getSocket } from "@utils";

const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<
      Pick<PaginationResult<Notification>, "items"> & { notSeenCount: number },
      void
    >({
      query: () => "notifications",
      providesTags: (result) => {
        return result
          ? [
              ...result.items.map(
                ({ id }) => ({ type: "Notifications", id } as const)
              ),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }];
      },
      onCacheEntryAdded: async (arg, api) => {
        try {
          await api.cacheDataLoaded;
          const socket = await getSocket();

          socket.on("notification.created", (data) => {
            api.updateCachedData((draft) => {
              draft.items.unshift(data);
            });
          });

          socket.on("notification.updated", (data) => {
            api.updateCachedData((draft) => {
              draft.items = draft.items.map((notification) =>
                notification.id === data.id ? data : notification
              );
            });
          });

          await api.cacheEntryRemoved;
          socket.close();
        } catch (error: unknown) {
          console.error(error);
        }
      },
    }),
    markAllAsSeen: builder.mutation<void, void>({
      query: () => ({
        url: "notifications",
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const { useListNotificationsQuery, useMarkAllAsSeenMutation } =
  notificationsApi;

export default notificationsApi;
