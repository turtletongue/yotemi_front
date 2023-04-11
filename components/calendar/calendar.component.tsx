"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { Spinner } from "flowbite-react";
import classnames from "classnames";
import { useListInterviewsQuery } from "@redux/features/interviews";
import { User } from "@redux/features/users";
import { selectUser } from "@redux/features/auth";
import { useAppSelector } from "@redux/store-config/hooks";
import { InterviewCard } from "@app/components";
import { Language, useTranslation } from "@app/i18n/client";
import { isDateInPartOfDay } from "@utils";
import getCalendarDates from "./get-calendar-dates";
import CreateInterviewForm from "./create-interview.form";

interface CalendarProps {
  lang: Language;
  user: User;
  contractCode: string;
}

const MONTHS_COUNT = 12;

const Calendar = ({ lang, user, contractCode }: CalendarProps) => {
  const { translation } = useTranslation(lang, "calendar");

  const now = new Date();

  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const decrementMonthIndex = () => {
    setYear((year) => (monthIndex > 0 ? year : year - 1));
    setMonthIndex((index) => (index > 0 ? index - 1 : MONTHS_COUNT - 1));
  };
  const incrementMonthIndex = () => {
    setYear((year) => (monthIndex < MONTHS_COUNT - 1 ? year : year + 1));
    setMonthIndex((index) => (index < MONTHS_COUNT - 1 ? index + 1 : 0));
  };

  const [currentDate, setCurrentDate] = useState(now.getDate());
  const changeCurrentDate = (date: number, month: number) => {
    setCurrentDate(date);
    setMonthIndex(month);
  };

  useEffect(() => {
    const lastMonthDay = new Date(year, monthIndex + 1, 0);
    setCurrentDate(Math.min(lastMonthDay.getDate(), currentDate));
  }, [year, monthIndex, currentDate]);

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

  const { data: { items } = { items: [] }, isLoading } = useListInterviewsQuery(
    {
      creatorId: user.id,
      from: firstDay.toISOString(),
      to: lastDay.toISOString(),
    }
  );

  const daysWithInterviews = useMemo(() => {
    return items
      .filter((interview) => new Date(interview.startAt).getTime() > Date.now())
      .reduce((map, interview) => {
        const date = new Date(interview.startAt);

        return { ...map, [date.toDateString()]: true };
      }, {});
  }, [items]) as Record<string, boolean>;

  const interviews = useMemo(() => {
    return items.filter((interview) => {
      const startAt = new Date(interview.startAt);

      return (
        startAt.getFullYear() === year &&
        startAt.getMonth() === monthIndex &&
        startAt.getDate() === currentDate
      );
    });
  }, [items, year, monthIndex, currentDate]);

  const morningInterviews = interviews.filter(({ startAt }) =>
    isDateInPartOfDay(startAt, "morning")
  );
  const afternoonInterviews = interviews.filter(({ startAt }) =>
    isDateInPartOfDay(startAt, "afternoon")
  );
  const eveningInterviews = interviews.filter(({ startAt }) =>
    isDateInPartOfDay(startAt, "evening")
  );
  const nightInterviews = interviews.filter(({ startAt }) =>
    isDateInPartOfDay(startAt, "night")
  );

  const calendarDateClasses = "p-1 sm:p-3 lg:p-5 text-sm text-center font-bold";

  const authenticatedUser = useAppSelector(selectUser);
  const isOwnCalendar = authenticatedUser?.id === user.id;

  return (
    <article
      className={`bg-light-cetacean mb-10 mt-4 w-[22rem] sm:w-auto ${
        isOwnCalendar ? "xl:w-[60rem]" : "lg:w-[40rem]"
      }`}
    >
      <div className="py-3 px-8 text-sm">
        {isOwnCalendar
          ? translation("createHeader")
          : translation("purchaseHeader")}
      </div>
      <div className="border border-b-1 border-line" />
      <div className="flex xl:justify-center items-center xl:items-stretch flex-col xl:flex-row">
        <section className="py-3">
          <div className="flex w-full justify-between px-8 text-sm sm:text-base">
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
                      className={`select-none ${
                        date.getMonth() === monthIndex
                          ? "text-white"
                          : "text-gray-500"
                      } ${calendarDateClasses}`}
                    >
                      <button
                        onClick={() =>
                          changeCurrentDate(date.getDate(), date.getMonth())
                        }
                      >
                        <span
                          className={`w-9 h-9 block flex items-center ${
                            currentDate === date.getDate() &&
                            monthIndex === date.getMonth()
                              ? "bg-calendar-date text-white"
                              : classnames(
                                  daysWithInterviews[date.toDateString()] &&
                                    "text-calendar-date"
                                )
                          } justify-center cursor-pointer rounded-full relative`}
                        >
                          {date.getDate()}
                        </span>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        {isOwnCalendar && (
          <>
            <div className="border border-b-1 border-l-1 border-line w-full xl:w-auto" />
            <section className="w-full py-12 flex items-center">
              <CreateInterviewForm
                lang={lang}
                contractCode={contractCode}
                date={new Date(year, monthIndex, currentDate)}
              />
            </section>
          </>
        )}
      </div>
      <div className="border border-b-1 border-line" />
      <section
        className={`p-6 min-h-[15rem] ${classnames(
          (isLoading || !interviews.length) &&
            "flex justify-center items-center"
        )}`}
      >
        {!isLoading ? (
          <>
            {interviews.length ? (
              <>
                {!!morningInterviews.length && (
                  <>
                    <span className="block my-4">{translation("morning")}</span>
                    <div
                      className={`columns-1 ${
                        isOwnCalendar
                          ? "xl:columns-3 md:columns-2"
                          : "md:columns-2"
                      } gap-6 mx-auto`}
                    >
                      {morningInterviews.map((interview) => (
                        <InterviewCard
                          key={interview.id}
                          interview={interview}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </>
                )}

                {!!afternoonInterviews.length && (
                  <>
                    <span className="block my-4">
                      {translation("afternoon")}
                    </span>
                    <div
                      className={`columns-1 ${
                        isOwnCalendar
                          ? "xl:columns-3 md:columns-2"
                          : "md:columns-2"
                      } gap-6 mx-auto`}
                    >
                      {afternoonInterviews.map((interview) => (
                        <InterviewCard
                          key={interview.id}
                          interview={interview}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </>
                )}

                {!!eveningInterviews.length && (
                  <>
                    <span className="block my-4">{translation("evening")}</span>
                    <div
                      className={`columns-1 ${
                        isOwnCalendar
                          ? "xl:columns-3 md:columns-2"
                          : "md:columns-2"
                      } gap-6 mx-auto`}
                    >
                      {eveningInterviews.map((interview) => (
                        <InterviewCard
                          key={interview.id}
                          interview={interview}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </>
                )}

                {!!nightInterviews.length && (
                  <>
                    <span className="block my-4">{translation("night")}</span>
                    <div
                      className={`columns-1 ${
                        isOwnCalendar
                          ? "xl:columns-3 md:columns-2"
                          : "md:columns-2"
                      } gap-6 mx-auto`}
                    >
                      {nightInterviews.map((interview) => (
                        <InterviewCard
                          key={interview.id}
                          interview={interview}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-md text-bold text-center text-gray-500">
                {translation("noInterviews")}
              </p>
            )}
          </>
        ) : (
          <Spinner color="purple" size="md" />
        )}
      </section>
    </article>
  );
};

export default Calendar;
