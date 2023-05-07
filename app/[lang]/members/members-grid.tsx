"use client";

import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";

import { MemberCard } from "@components";
import { useAppSelector } from "@store/store-config/hooks";
import {
  selectOrderBy,
  selectSearchFilter,
  selectTopicsFilter,
  useListUsersQuery,
} from "@store/features/users";
import { useDebounce } from "@app/hooks";
import { Language, useTranslation } from "@app/i18n/client";
import MembersGridSkeleton from "./members-grid-skeleton";

interface MembersGridProps {
  lang: Language;
}

const MembersGrid = ({ lang }: MembersGridProps) => {
  const { translation } = useTranslation(lang, "members");

  const topics = useAppSelector(selectTopicsFilter);
  const orderBy = useAppSelector(selectOrderBy);
  const search = useAppSelector(selectSearchFilter);
  const bouncedSearch = useDebounce(search, 250);

  const [page, setPage] = useState(1);

  const { data: { items: members, totalPages } = {}, isLoading } =
    useListUsersQuery({
      page,
      topicIds: topics.map((topic) => topic.id),
      search: bouncedSearch,
      orderBy,
    });

  useEffect(() => {
    setPage(1);
  }, [topics.length, search]);

  if (isLoading) {
    return <MembersGridSkeleton />;
  }

  if (!members || members.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center flex grow w-full justify-center items-center">
        {translation("usersNotFound")}
      </div>
    );
  }

  return (
    <>
      <article className="w-full h-full grow grid gap-6 justify-items-center justify-center md:justify-start grid-flow-row-dense grid-cols-cards auto-rows-cards">
        {members.map((member) => (
          <MemberCard key={member.id} lang={lang} data={member} />
        ))}
      </article>
      {!!totalPages && totalPages > 1 && (
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
    </>
  );
};

export default MembersGrid;
