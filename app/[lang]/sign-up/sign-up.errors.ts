import { generalErrors } from "@utils";

const signUpErrors = {
  ADDRESS_IS_TAKEN: "addressIsTakenError",
  ...generalErrors,
} as const;

export default signUpErrors;
