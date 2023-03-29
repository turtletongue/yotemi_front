import { User } from "@redux/features/users";
import { Id } from "@app/declarations";

export default interface Interview {
  id: Id;
  address: string;
  price: number;
  startAt: string;
  endAt: string;
  creatorId: Id;
  participant: User | null;
  payerComment: string | null;
}
