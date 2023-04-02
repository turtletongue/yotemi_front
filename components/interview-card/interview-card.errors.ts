import { generalErrors } from "@utils";

const interviewCardErrors = {
  PAYMENT_ALREADY_CONFIRMED: "paymentAlreadyConfirmedError",
  CONTRACT_METHOD_CALL_FAILED: "contractMethodCallError",
  ...generalErrors,
} as const;

export default interviewCardErrors;
