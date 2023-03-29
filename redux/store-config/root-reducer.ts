import { combineReducers } from "@reduxjs/toolkit";

import auth, { authApi } from "@redux/features/auth";
import { contractApi } from "@redux/features/contract";
import baseApi from "@redux/features/base.api";

const rootReducer = combineReducers({
  auth,
  [authApi.reducerPath]: authApi.reducer,
  [contractApi.reducerPath]: contractApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;
