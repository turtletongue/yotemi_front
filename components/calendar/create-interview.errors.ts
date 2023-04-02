import { generalErrors } from "@utils";

const createInterviewError = {
  INTERVIEW_HAS_TIME_CONFLICT: "hasTimeConflictError",
  ...generalErrors,
} as const;

export default createInterviewError;
