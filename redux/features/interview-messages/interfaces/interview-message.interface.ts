import { Id } from "@app/declarations";

export default interface InterviewMessage {
  id: Id;
  content: string;
  authorId: Id;
  interviewId: Id;
  createdAt: string;
  updatedAt: string;
}
