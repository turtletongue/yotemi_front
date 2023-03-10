import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithRefresh } from "@redux/base-query";

const baseApi = createApi({
  baseQuery: baseQueryWithRefresh,
  reducerPath: "base",
  tagTypes: ["Users"],
  endpoints: () => ({}),
});

export default baseApi;
