"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pagination, Spinner } from "flowbite-react";

import { Button } from "@components";
import { useAppSelector } from "@redux/store-config/hooks";
import {
  Interview,
  useListPaginatedInterviewsQuery,
} from "@redux/features/interviews";
import { selectUser } from "@redux/features/auth";
import { Language, useTranslation } from "@app/i18n/client";
import UpcomingInterviewsGrid from "@app/app/[lang]/upcoming/upcoming-interview-grid.component";

interface UpcomingListProps {
  lang: Language;
}

const UpcomingList = ({ lang }: UpcomingListProps) => {
  const { translation } = useTranslation(lang, "upcoming");

  const [page, setPage] = useState(1);
  const [now] = useState(new Date().toISOString());

  const authenticatedUser = useAppSelector(selectUser);

  const { data: { items: interviews, totalPages } = {}, isLoading } =
    useListPaginatedInterviewsQuery({
      page,
      participantId: authenticatedUser?.id,
      from: now,
    });

  if (!authenticatedUser) {
    return redirect("/");
  }

  if (!interviews || isLoading) {
    return (
      <div className="w-full grow flex justify-center items-center">
        <Spinner color="purple" size="xl" />
      </div>
    );
  }

  const interviewGroups = interviews.reduce((groups, interview, index) => {
    const lastGroup = groups[index - 1];
    const interviewHasDifferentDate =
      new Date(lastGroup?.[0]?.startAt).toDateString() !==
      new Date(interview.startAt).toDateString();

    if (!lastGroup || interviewHasDifferentDate) {
      return [...groups, [interview]];
    }

    return [...groups.slice(0, -1), [...lastGroup, interview]];
  }, [] as Interview[][]);

  return (
    <div className="w-full grow flex flex-col items-center">
      {interviewGroups.length > 0 ? (
        <article className="flex flex-col w-full max-w-2xl gap-6">
          {interviewGroups.map((group, index) => (
            <UpcomingInterviewsGrid
              key={index}
              lang={lang}
              date={group[0].startAt}
              interviews={group}
            />
          ))}
        </article>
      ) : (
        <article className="flex w-full grow justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-gray-500 max-w-sm text-center">
              {translation("noUpcomingInterviews")}
            </span>
            <Link href="/members">
              <Button outline>{translation("toMembers")}</Button>
            </Link>
          </div>
        </article>
      )}
      {totalPages && totalPages > 1 && (
        <div className="flex items-center justify-center w-full text-center mt-5">
          <Pagination
            currentPage={page}
            layout="pagination"
            onPageChange={(page) => setPage(page)}
            showIcons={true}
            totalPages={totalPages ?? 1}
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
    </div>
  );
};

export default UpcomingList;
