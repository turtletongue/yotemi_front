import { User } from "@store/features/users";
import { Id } from "@app/declarations";

export default interface Review {
  id: Id;
  points: number;
  comment: string;
  userId: Id;
  reviewer: User;
  createdAt: Date;
  updatedAt: Date;
}
