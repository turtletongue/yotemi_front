import { createApi } from "@reduxjs/toolkit/query/react";

import baseQuery from "@redux/base-query";
import AuthResponse from "./interfaces/auth-response";

export interface LoginRequest {
  accountAddress: string;
  signature: {
    domain: {
      lengthBytes: number;
      value: string;
    };
    payload: string;
    signature: string;
    timestamp: number;
  };
}

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "authentication",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "authentication/revoke",
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;

export default authApi;
