import { Id } from "@app/declarations";

export default interface CreateReview {
  points: number;
  comment: string;
  userId: Id;
}
