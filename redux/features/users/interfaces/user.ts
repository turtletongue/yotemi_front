import { Topic } from "@redux/features/topics";
import { Id } from "@app/declarations";

export default interface User {
  id: Id;
  username: string;
  accountAddress: string;
  authId: Id;
  firstName: string;
  lastName: string;
  fullName: string;
  biography: string;
  isVerified: boolean;
  isFollowing: boolean | null;
  topics: Topic[];
  followersCount: number;
  averagePoints: number;
  reviewsCount: number;
  avatarPath: string | null;
  coverPath: string | null;
  createdAt: string;
  updatedAt: string;
}
