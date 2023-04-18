import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@redux/store-config/store";
import peersInitialState from "./peers.initial-state";

const peersSlice = createSlice({
  name: "peers",
  initialState: peersInitialState,
  reducers: {
    disconnect: (state) => {
      state.disconnected = true;
    },
    resetPeer: (state) => {
      state.disconnected = false;
    },
  },
});

export const { disconnect, resetPeer } = peersSlice.actions;

export const selectDisconnected = (state: RootState) =>
  state.peers.disconnected;

export default peersSlice.reducer;
