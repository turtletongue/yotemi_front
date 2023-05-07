import { User } from "@store/features/users";
import { Id } from "@app/declarations";

export default interface Interview {
  id: Id;
  address: string;
  price: number;
  startAt: string;
  endAt: string;
  creator: User | null;
  creatorId: Id;
  participant: User | null;
  payerComment: string | null;
}
