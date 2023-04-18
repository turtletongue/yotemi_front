import baseApi from "@redux/features/base.api";
import { Id } from "@app/declarations";
import { getSocket } from "@utils";
import { disconnect } from "./peers.slice";

type PeerApiResponse = {
  interviewId: Id;
  otherHasAudio: boolean;
  otherHasVideo: boolean;
};

const peersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerPeer: builder.query<PeerApiResponse, Id>({
      query: (id) => ({
        url: `peers/${id}`,
        method: "POST",
      }),
      onCacheEntryAdded: async (arg, api) => {
        try {
          await api.cacheDataLoaded;
          const socket = await getSocket();

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

          socket.on("peer.disconnected", (interviewId) => {
            if (api.getCacheEntry()?.data?.interviewId === interviewId) {
              api.dispatch(disconnect());
            }
          });

          await api.cacheEntryRemoved;
          socket.close();
        } catch {}
      },
    }),
    takePeerIds: builder.query<{ peerId: string; otherPeerId: string }, Id>({
      query: (id) => ({
        url: `interviews/${id}/take-peer`,
        method: "POST",
      }),
      providesTags: (_result, _error, id) => {
        return [{ type: "Peers", id }];
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

export const {
  useRegisterPeerQuery,
  useTakePeerIdsQuery,
  useMuteMutation,
  useUnmuteMutation,
} = peersApi;

export default peersApi;
