import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@store/store-config/store";
import interviewMessagesInitialState from "./interview-messages.initial-state";

const interviewMessagesSlice = createSlice({
  name: "interviewMessages",
  initialState: interviewMessagesInitialState,
  reducers: {
    setIsChatOpened: (state, { payload }: PayloadAction<boolean>) => {
      state.isChatOpened = payload;
    },
  },
});

export const { setIsChatOpened } = interviewMessagesSlice.actions;

export const selectIsChatOpened = (state: RootState) =>
  state.interviewMessages.isChatOpened;

export default interviewMessagesSlice.reducer;
