"use client";

import { ChevronLeft, ChevronRight } from "react-feather";

import { Language, useTranslation } from "@app/i18n/client";
import { useState } from "react";
import classnames from "classnames";

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

  const firstMonthDay = new Date(year, monthIndex, 1);
  const lastMonthDay = new Date(year, monthIndex + 1, 0);

  const months = translation("months", { returnObjects: true }) as string[];
  const daysOfWeek = translation("daysOfWeek", {
    returnObjects: true,
  }) as string[];

  return (
    <article className="bg-card">
      <div className="py-3 px-8 text-sm">{translation("header")}</div>
      <hr className="border-line" />
      <div className="flex">
        <div className="w-full px-8 py-3">
          <div className="flex w-full justify-between ">
            <button>
              <ChevronLeft onClick={decrementMonthIndex} />
            </button>
            {months[monthIndex]}, {year}
            <button>
              <ChevronRight onClick={incrementMonthIndex} />
            </button>
          </div>
          <table className="mt-2">
            <thead>
              {daysOfWeek.map((day, index) => {
                const isFirstDay = index === 0;
                const isLastDay = index === daysOfWeek.length - 1;

                const firstDayClasses = classnames(isFirstDay && "pr-5");
                const lastDayClasses = classnames(isLastDay && "pl-5");
                const middleDayClasses = classnames(
                  !isFirstDay && !isLastDay && "px-5"
                );

                return (
                  <th
                    key={day}
                    className={`py-5 text-sm ${firstDayClasses} ${lastDayClasses} ${middleDayClasses}`}
                  >
                    {day}
                  </th>
                );
              })}
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div></div>
      </div>
    </article>
  );
};

export default Calendar;
