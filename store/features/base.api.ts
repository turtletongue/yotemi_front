import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithRefresh from "@store/queries/base-query-with-refresh";

const baseApi = createApi({
  baseQuery: baseQueryWithRefresh,
  reducerPath: "base",
  tagTypes: [
    "Users",
    "Interviews",
    "Topics",
    "Notifications",
    "InterviewMessages",
    "Peers",
    "Reviews",
  ],
  endpoints: () => ({}),
});

export default baseApi;
