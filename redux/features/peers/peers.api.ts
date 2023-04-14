import baseApi from "@redux/features/base.api";
import { Id } from "@app/declarations";
import { getSocket } from "@utils";

type PeerApiResponse = {
  interviewId: Id;
  peerId: string;
  otherPeerId: string;
  otherHasAudio: boolean;
  otherHasVideo: boolean;
};

const peersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    exchangePeerId: builder.query<PeerApiResponse, Id>({
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
              if (draft.interviewId === data.interviewId) {
                draft[data.type === "own" ? "peerId" : "otherPeerId"] =
                  data.peerId;
              }
            });
          });

          socket.on("peer.audio-muted", (interviewId) => {
            api.updateCachedData((draft) => {
              if (draft.interviewId === interviewId) {
                draft.otherHasAudio = false;
              }
            });
          });

          socket.on("peer.audio-unmuted", (interviewId) => {
            api.updateCachedData((draft) => {
              if (draft.interviewId === interviewId) {
                draft.otherHasAudio = true;
              }
            });
          });

          socket.on("peer.video-muted", (interviewId) => {
            api.updateCachedData((draft) => {
              if (draft.interviewId === interviewId) {
                draft.otherHasVideo = false;
              }
            });
          });

          socket.on("peer.video-unmuted", (interviewId) => {
            api.updateCachedData((draft) => {
              if (draft.interviewId === interviewId) {
                draft.otherHasVideo = true;
              }
            });
          });

          await api.cacheEntryRemoved;
          socket.close();
        } catch {}
      },
    }),
    mute: builder.mutation<void, { interviewId: Id; type: "video" | "audio" }>({
      query: ({ interviewId, type }) => ({
        url: `peers/${interviewId}/${type}/mute`,
        method: "POST",
      }),
    }),
    unmute: builder.mutation<
      void,
      { interviewId: Id; type: "video" | "audio" }
    >({
      query: ({ interviewId, type }) => ({
        url: `peers/${interviewId}/${type}/unmute`,
        method: "POST",
      }),
    }),
  }),
});

export const { useExchangePeerIdQuery, useMuteMutation, useUnmuteMutation } =
  peersApi;

export default peersApi;
