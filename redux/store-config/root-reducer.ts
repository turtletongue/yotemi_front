import { combineReducers } from "@reduxjs/toolkit";

import auth, { authApi } from "@redux/features/auth";
import { contractApi } from "@redux/features/contract";
import peers from "@redux/features/peers";
import baseApi from "@redux/features/base.api";
import { memberFilters } from "@redux/features/users";
import interviewMessages from "@redux/features/interview-messages";

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
