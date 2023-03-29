const isDateBetweenHours = (
  date: string | Date,
  start: number,
  end: number
) => {
  const hours = new Date(date).getHours();

  return start <= hours && hours < end;
};

export default isDateBetweenHours;
