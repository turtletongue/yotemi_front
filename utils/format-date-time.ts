import { DateTime } from "luxon";

const formatDateTime = (date: string): string =>
  DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);

export default formatDateTime;
