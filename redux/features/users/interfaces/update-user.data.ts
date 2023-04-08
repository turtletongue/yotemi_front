import { Id } from "@app/declarations";

export default interface UpdateUserData {
  id: Id;
  username?: string;
  firstName?: string;
  lastName?: string;
  biography?: string;
  topics?: Id[];
}
