import { Id } from "@app/declarations";
import NotificationType from "./notification-type";

export default interface Notification {
  id: Id;
  type: NotificationType;
  content: Record<string, any> | null;
  isSeen: boolean;
  userId: Id;
  createdAt: string;
  updatedAt: string;
}
