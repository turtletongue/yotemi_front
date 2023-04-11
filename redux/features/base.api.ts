import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithRefresh } from "@redux/queries/base-query";

const baseApi = createApi({
  baseQuery: baseQueryWithRefresh,
  reducerPath: "base",
  tagTypes: [
    "Users",
    "Interviews",
    "Topics",
    "Notifications",
    "InterviewMessages",
  ],
  endpoints: () => ({}),
});

export default baseApi;
