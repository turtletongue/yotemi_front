"use client";

import { ChevronLeft, ChevronRight } from "react-feather";

import { Language, useTranslation } from "@app/i18n/client";
import { useState } from "react";
import getCalendarDates from "@app/app/[lang]/profile/[username]/get-calendar-dates";

interface CalendarProps {
  lang: Language;
}

const MONTHS_COUNT = 12;

const Calendar = ({ lang }: CalendarProps) => {
  const { translation } = useTranslation(lang, "calendar");

  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const decrementMonthIndex = () => {
    setYear((year) => (monthIndex > 0 ? year : year - 1));
    setMonthIndex((index) => (index > 0 ? index - 1 : MONTHS_COUNT - 1));
  };
  const incrementMonthIndex = () => {
    setYear((year) => (monthIndex < MONTHS_COUNT - 1 ? year : year + 1));
    setMonthIndex((index) => (index < MONTHS_COUNT - 1 ? index + 1 : 0));
  };

  const months = translation("months", { returnObjects: true }) as string[];
  const daysOfWeek = translation("daysOfWeek", {
    returnObjects: true,
  }) as string[];

  const startOfWeekIndex = +translation("startOfWeekIndex");

  const firstDay = new Date(year, monthIndex, 1);
  firstDay.setDate(firstDay.getDate() + (startOfWeekIndex - firstDay.getDay()));

  const endOfWeekIndex = +translation("endOfWeekIndex");

  const lastDay = new Date(year, monthIndex + 1, 0);
  lastDay.setDate(
    lastDay.getDate() + ((endOfWeekIndex - lastDay.getDay()) % 7)
  );

  const datesGroups = Array.from(getCalendarDates(firstDay, lastDay)).reduce(
    (dates: Date[][], currentDate, index) => {
      const groupIndex = Math.floor(index / 7);

      const result =
        dates[groupIndex] !== undefined ? [...dates] : [...dates, []];

      return result.map((group, index) =>
        index === groupIndex ? [...group, currentDate] : group
      );
    },
    []
  );

  const calendarDateClasses = "p-5 text-sm text-center font-bold";

  return (
    <article className="bg-card">
      <div className="py-3 px-8 text-sm">{translation("header")}</div>
      <hr className="border-line" />
      <div className="flex">
        <div className="w-full py-3">
          <div className="flex w-full justify-between px-8">
            <button>
              <ChevronLeft onClick={decrementMonthIndex} />
            </button>
            {months[monthIndex]}, {year}
            <button>
              <ChevronRight onClick={incrementMonthIndex} />
            </button>
          </div>
          <table className="mt-2 mx-3">
            <thead>
              <tr>
                {daysOfWeek.map((day) => (
                  <th key={day} className={calendarDateClasses}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datesGroups.map((group, groupIndex) => (
                <tr key={groupIndex}>
                  {group.map((date) => (
                    <td
                      key={date.getDate()}
                      className={`cursor-pointer ${
                        date.getMonth() === monthIndex
                          ? "text-calendar-date"
                          : "text-gray-500"
                      } ${calendarDateClasses}`}
                    >
                      <span className="w-9 h-9 block flex items-center justify-center hover:bg-calendar-date rounded-full hover:text-white transition duration-50 ease-in-out">
                        {date.getDate()}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div></div>
      </div>
    </article>
  );
};

export default Calendar;
