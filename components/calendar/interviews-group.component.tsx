"use client";

import { InterviewCard } from "@components";
import { Interview } from "@store/features/interviews";
import { Language } from "@app/i18n/client";

interface InterviewsGroupProps {
  title?: string;
  isOwnCalendar?: boolean;
  lang: Language;
  interviews: Interview[];
}

const InterviewsGroup = ({
  title,
  isOwnCalendar,
  lang,
  interviews,
}: InterviewsGroupProps) => {
  return (
    <>
      <span className="block my-4">{title}</span>
      <div
        className={`columns-1 ${
          isOwnCalendar ? "xl:columns-3 md:columns-2" : "md:columns-2"
        } gap-6 mx-auto`}
      >
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} lang={lang} />
        ))}
      </div>
    </>
  );
};

export default InterviewsGroup;
