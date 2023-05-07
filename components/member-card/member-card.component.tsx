"use client";

import { Suspense } from "react";
import Link from "next/link";

import {
  Avatar,
  ButtonSkeleton,
  FollowingControlButton,
  Rating,
  Topic,
} from "@components";
import { useAppSelector } from "@store/store-config/hooks";
import { User } from "@store/features/users";
import { selectUser } from "@store/features/auth";
import { Language, useTranslation } from "@app/i18n/client";

interface MemberCardProps {
  lang: Language;
  data: User;
}

const MemberCard = ({ lang, data }: MemberCardProps) => {
  const { translation } = useTranslation(lang, "members");

  const authenticatedUser = useAppSelector(selectUser);

  return (
    <Link href={`/profile/${data.username}`} className="h-fit">
      <article className="bg-card shadow-md w-[21rem] sm:w-[23rem] pb-3 sm:pb-4 rounded-3xl overflow-hidden">
        {data.coverPath && (
          <img
            className="w-full h-[5rem]"
            src={data.coverPath}
            alt={translation("coverAlt") ?? ""}
          />
        )}
        <div className="px-3 sm:px-4 mt-3">
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-3 sm:gap-4">
              <Avatar size="md" img={data.avatarPath} rounded />
              <div>
                <span className="text-sm">{data.fullName}</span>
                <Rating points={data.averagePoints} />
              </div>
            </div>
            {authenticatedUser && authenticatedUser.id !== data.id && (
              <Suspense fallback={<ButtonSkeleton />}>
                <FollowingControlButton
                  lang={lang}
                  profile={data}
                  className="!text-sm"
                />
              </Suspense>
            )}
          </div>
          {data.biography && <p className="mt-4 text-sm">{data.biography}</p>}
          {data.topics.length > 0 && (
            <div className="flex gap-2 flex-wrap w-full mt-4">
              {data.topics.map((topic) => (
                <Topic
                  key={topic.id}
                  colorHex={topic.colorHex}
                  lang={lang}
                  labels={topic.labels}
                />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default MemberCard;
