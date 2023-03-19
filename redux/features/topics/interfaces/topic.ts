import { Id } from "@app/declarations";
import TopicLabel from "./topic-label";

export default interface Topic {
  id: Id;
  labels: TopicLabel[];
  isModerated: boolean;
  colorHex: string;
  createdAt: Date;
  updatedAt: Date;
}
