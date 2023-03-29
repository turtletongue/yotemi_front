import { DateTime } from "luxon";

const formatTime = (date: string): string =>
  DateTime.fromISO(date).toLocaleString(DateTime.TIME_SIMPLE);

export default formatTime;
