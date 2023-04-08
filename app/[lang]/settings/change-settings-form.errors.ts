import { generalErrors } from "@utils";

const changeSettingsFormErrors = {
  USERNAME_IS_TAKEN: "usernameIsTakenError",
  ...generalErrors,
} as const;

export default changeSettingsFormErrors;
