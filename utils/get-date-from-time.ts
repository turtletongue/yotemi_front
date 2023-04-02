import { DateTime } from "luxon";

const getDateFromTime = (time: string, base: Date) => {
  return DateTime.fromFormat(time, "hh:mm")
    .set({
      year: base.getFullYear(),
      month: base.getMonth() + 1,
      day: base.getDate(),
    })
    .toJSDate();
};

export default getDateFromTime;
