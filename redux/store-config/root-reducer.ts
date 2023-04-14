import { combineReducers } from "@reduxjs/toolkit";

import auth, { authApi } from "@redux/features/auth";
import { contractApi } from "@redux/features/contract";
import baseApi from "@redux/features/base.api";
import { memberFilters } from "@redux/features/users";
import interviewMessages from "@redux/features/interview-messages";

const rootReducer = combineReducers({
  auth,
  memberFilters,
  interviewMessages,
  [authApi.reducerPath]: authApi.reducer,
  [contractApi.reducerPath]: contractApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;
