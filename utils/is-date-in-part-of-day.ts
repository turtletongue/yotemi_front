import isDateBetweenHours from "@app/utils/is-date-between-hours";

const partOfDay = {
  morning: 6,
  afternoon: 12,
  evening: 17,
  night: 21,
} as const;

const isDateInPartOfDay = (
  date: string | Date,
  part: keyof typeof partOfDay
) => {
  if (part === "morning") {
    return isDateBetweenHours(date, partOfDay.morning, partOfDay.afternoon);
  }

  if (part === "afternoon") {
    return isDateBetweenHours(date, partOfDay.afternoon, partOfDay.evening);
  }

  if (part === "evening") {
    return isDateBetweenHours(date, partOfDay.evening, partOfDay.night);
  }

  return (
    isDateBetweenHours(date, partOfDay.night, 24) ||
    isDateBetweenHours(date, 0, partOfDay.morning)
  );
};

export default isDateInPartOfDay;
