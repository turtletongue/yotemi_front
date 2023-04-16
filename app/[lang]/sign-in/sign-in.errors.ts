import { generalErrors } from "@utils";

const signUpErrors = {
  401: "unauthorizedError",
  TON_ACCOUNT_NOT_INITIALIZED: "walletNotInitialized",
  ...generalErrors,
} as const;

export default signUpErrors;
