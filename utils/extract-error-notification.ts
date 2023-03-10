import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { TFunction } from "i18next";

import { ErrorNotification } from "@components";
import errorNameToError from "./error-name-to-error";

const defaultErrorKey = "somethingWrongError" as const;

const extractErrorNotification = (
  error: FetchBaseQueryError | SerializedError,
  errorsMap: Record<string, string | undefined>,
  translation: TFunction
): ErrorNotification => {
  if ("data" in error && error.data && "error" in error.data) {
    return errorNameToError(
      errorsMap[(error.data as any).error as keyof typeof errorsMap] ??
        defaultErrorKey,
      translation
    );
  }

  if ("status" in error) {
    return errorNameToError(
      errorsMap[error.status as keyof typeof errorsMap] ?? defaultErrorKey,
      translation
    );
  }

  return errorNameToError(defaultErrorKey, translation);
};

export default extractErrorNotification;
