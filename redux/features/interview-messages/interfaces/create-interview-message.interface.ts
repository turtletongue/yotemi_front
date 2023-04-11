import { Id } from "@app/declarations";

export default interface CreateInterviewMessage {
  content: string;
  interviewId: Id;
}
