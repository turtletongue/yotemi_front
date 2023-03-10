import { Id } from "@app/declarations";
import TopicLabel from "./topic-label";

export default interface Topic {
  id: Id;
  labels: TopicLabel[];
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
