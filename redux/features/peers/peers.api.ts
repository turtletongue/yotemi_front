import baseApi from "@redux/features/base.api";
import { Id } from "@app/declarations";
import { getSocket } from "@utils";

const peersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    exchangePeerId: builder.query<{ peerId: string; otherPeerId?: string }, Id>(
      {
        query: (id) => ({
          url: `peers/${id}`,
          method: "POST",
        }),
        providesTags: [{ type: "Peers", id: "PEER" }],
        onCacheEntryAdded: async (arg, api) => {
          try {
            await api.cacheDataLoaded;
            const socket = await getSocket();

            socket.on("peer.created", (data) => {
              api.updateCachedData((draft) => {
                draft.otherPeerId = data;
              });
            });

            await api.cacheEntryRemoved;
            socket.close();
          } catch (error: unknown) {
            console.error(error);
          }
        },
      }
    ),
  }),
});

export const { useExchangePeerIdQuery } = peersApi;

export default peersApi;
