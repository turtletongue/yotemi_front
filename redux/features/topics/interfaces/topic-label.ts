import { Id } from "@app/declarations";
import { Language } from "@app/i18n";

export default interface TopicLabel {
  id: Id;
  value: string;
  language: Language;
  createdAt: Date;
  updatedAt: Date;
}
