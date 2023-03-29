import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithRefresh } from "@redux/queries/base-query";

const baseApi = createApi({
  baseQuery: baseQueryWithRefresh,
  reducerPath: "base",
  tagTypes: ["Users", "Interviews"],
  endpoints: () => ({}),
});

export default baseApi;
