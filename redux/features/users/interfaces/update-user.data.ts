import { Topic } from "@redux/features/topics";
import { Id } from "@app/declarations";

export default interface UpdateUserData {
  id: Id;
  firstName?: string;
  lastName?: string;
  biography?: string;
  topics?: Topic[];
}
