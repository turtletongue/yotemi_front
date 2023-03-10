import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import authInitialState from "./auth.initial-state";
import authApi from "./auth.api";
import AuthResponse from "./interfaces/auth-response";
import { RootState } from "../../store-config/store";

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    refreshTokens: (state, { payload }: PayloadAction<AuthResponse>) => {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
    },
    loggedOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.accessToken = payload.accessToken;
          state.user = payload.user;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
      });
  },
});

export const { refreshTokens, loggedOut } = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.accessToken;

export default authSlice.reducer;
