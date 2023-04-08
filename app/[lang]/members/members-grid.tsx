"use client";

import { useEffect, useState } from "react";
import { Pagination } from "flowbite-react";

import { MemberCard } from "@components";
import { useAppSelector } from "@redux/store-config/hooks";
import {
  selectOrderBy,
  selectSearchFilter,
  selectTopicsFilter,
  useListUsersQuery,
} from "@redux/features/users";
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
      <article className="w-full h-full grow grid gap-4 content-between justify-items-center grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {members.map((member) => (
          <MemberCard key={member.id} lang={lang} data={member} />
        ))}
      </article>
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
    </>
  );
};

export default MembersGrid;
