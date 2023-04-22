import { DateTime } from "luxon";

import { InterviewCard } from "@components";
import { Interview } from "@redux/features/interviews";
import { Language } from "@app/i18n/client";

interface UpcomingInterviewsGridProps {
  lang: Language;
  date: string;
  interviews: Interview[];
}

const UpcomingInterviewsGrid = ({
  lang,
  date,
  interviews,
}: UpcomingInterviewsGridProps) => {
  return (
    <div className="text-center md:text-left">
      <span className="capitalize text-lg">
        {DateTime.fromISO(date).toRelativeCalendar()}
      </span>
      <article className="text-left grid justify-center md:justify-start gap-4 grid-flow-row-dense grid-cols-cards-sm mt-2">
        {interviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            lang={lang}
            interview={interview}
            userToShow="creator"
          />
        ))}
      </article>
    </div>
  );
};

export default UpcomingInterviewsGrid;
