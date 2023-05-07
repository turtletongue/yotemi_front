import { combineReducers } from "@reduxjs/toolkit";

import auth, { authApi } from "@store/features/auth";
import { contractApi } from "@store/features/contract";
import peers from "@store/features/peers";
import baseApi from "@store/features/base.api";
import { memberFilters } from "@store/features/users";
import interviewMessages from "@store/features/interview-messages";

const rootReducer = combineReducers({
  auth,
  memberFilters,
  interviewMessages,
  peers,
  [authApi.reducerPath]: authApi.reducer,
  [contractApi.reducerPath]: contractApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;
