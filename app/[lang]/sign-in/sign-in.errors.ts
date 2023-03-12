import { generalErrors } from "@utils";

const signUpErrors = {
  401: "unauthorizedError",
  ...generalErrors,
} as const;

export default signUpErrors;
