import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { AuthResponse, loggedOut, refreshTokens } from "@store/features/auth";
import baseQuery from "./base-query";

const mutex = new Mutex();
const errorsWithoutRetry = [400, 422] as (string | number)[];

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && errorsWithoutRetry.includes(result.error.status)) {
    retry.fail(result.error);
  }

  if (result.error && result.error.status === 401) {
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
          retry.fail(result.error);
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
