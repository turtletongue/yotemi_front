import { combineReducers } from "@reduxjs/toolkit";

import auth, { authApi } from "@redux/features/auth";
import { usersApi } from "@redux/features/users";

const rootReducer = combineReducers({
  auth,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

export default rootReducer;
