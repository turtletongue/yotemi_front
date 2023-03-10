import { Topic } from "@redux/features/topics";
import { Id } from "@app/declarations";

export default interface User {
  id: Id;
  accountAddress: string;
  authId: Id;
  firstName: string;
  lastName: string;
  fullName: string;
  biography: string;
  isVerified: boolean;
  topics: Topic[];
  followersCount: number;
  avatarPath: string | null;
  coverPath: string | null;
  createdAt: Date;
  updatedAt: Date;
}
