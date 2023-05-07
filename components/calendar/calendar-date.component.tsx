import classnames from "classnames";

interface CalendarDateProps {
  date: Date;
  currentDate: number;
  monthIndex: number;
  className?: string;
  changeCurrentDate?: (date: number, month: number) => unknown;
  daysWithInterviews?: Record<string, unknown>;
}

const CalendarDate = ({
  date,
  currentDate,
  monthIndex,
  changeCurrentDate,
  className,
  daysWithInterviews,
}: CalendarDateProps) => {
  return (
    <td
      className={`select-none ${
        date.getMonth() === monthIndex ? "text-white" : "text-gray-500"
      } ${className}`}
    >
      <button
        onClick={() => changeCurrentDate?.(date.getDate(), date.getMonth())}
      >
        <span
          className={`w-9 h-9 block flex items-center ${
            currentDate === date.getDate() && monthIndex === date.getMonth()
              ? "bg-calendar-date text-white"
              : classnames(
                  !!daysWithInterviews?.[date.toDateString()] &&
                    "text-calendar-date"
                )
          } justify-center cursor-pointer rounded-full relative`}
        >
          {date.getDate()}
        </span>
      </button>
    </td>
  );
};

export default CalendarDate;
