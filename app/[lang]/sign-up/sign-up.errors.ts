import { generalErrors } from "@utils";

const signUpErrors = {
  ADDRESS_IS_TAKEN: "addressIsTakenError",
  USERNAME_IS_TAKEN: "usernameIsTakenError",
  ...generalErrors,
} as const;

export default signUpErrors;
