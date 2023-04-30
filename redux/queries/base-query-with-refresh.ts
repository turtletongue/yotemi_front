import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";

import { AuthResponse, loggedOut, refreshTokens } from "@redux/features/auth";
import baseQuery from "./base-query";

const mutex = new Mutex();

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    retry.fail(result.error);

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: "/authentication/refresh",
            method: "POST",
            credentials: "include",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          api.dispatch(refreshTokens(refreshResult.data as AuthResponse));

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default retry(baseQueryWithRefresh);
