export default function* getCalendarDates(start: Date, end: Date) {
  for (
    const currentDate = new Date(start);
    currentDate.getTime() <= end.getTime();
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    yield new Date(currentDate);
  }
}
