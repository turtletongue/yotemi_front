import { TFunction } from "i18next";
import { ErrorNotification } from "@components";

const errorNameToError = (
  key: string,
  translation: TFunction
): ErrorNotification => {
  return {
    title: translation(`${key}.title`),
    description: translation(`${key}.description`),
  };
};

export default errorNameToError;
