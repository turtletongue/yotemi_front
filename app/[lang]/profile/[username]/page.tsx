import { notFound } from "next/navigation";
import classnames from "classnames";

import {
  Avatar,
  Calendar,
  ProfileControl,
  Rating,
  ReviewCard,
  Topic,
} from "@components";
import { Language, useTranslation } from "@app/i18n";
import fetchProfile from "./fetch-profile";
import fetchReviews from "./fetch-reviews";

interface ProfileProps {
  params: {
    lang: Language;
    username: string;
  };
}

const Profile = async ({ params: { lang, username } }: ProfileProps) => {
  const { isFound, profile } = await fetchProfile(username);

  if (!isFound || !profile) {
    notFound();
  }

  const reviews = await fetchReviews(profile.id);
  const hasTopics = profile.topics.length !== 0;

  const { translation } = await useTranslation(lang, "profile");

  return (
    <section className="grow bg-cetacean-blue text-white p-4">
      <div className="flex justify-center w-full mt-10 lg:mt-32 flex-col lg:flex-row">
        <Avatar
          img={profile.avatarPath ?? undefined}
          className="h-min mb-12"
          size="xl"
          rounded
        />
        <div className="flex flex-col items-center 2xl:flex-row 2xl:items-start lg:ml-24">
          <article className="max-w-screen-sm 2xl:mr-24">
            <div className="flex items-center justify-between flex-col sm:flex-row">
              <h1 className="text-xl mb-2 sm:mb-0">{profile.fullName}</h1>
              <ProfileControl lang={lang} profileId={profile.id} />
            </div>
            {hasTopics && (
              <div className="flex flex-wrap gap-2 mt-5">
                {profile.topics.map((topic) => {
                  const label = topic.labels.find(
                    (label) => label.language === lang
                  );

                  if (!label) {
                    return false;
                  }

                  return (
                    <Topic key={topic.id} colorHex={topic.colorHex}>
                      {label.value}
                    </Topic>
                  );
                })}
              </div>
            )}
            <div className={`mt-3 ${classnames(profile.biography && "mb-7")}`}>
              {profile.biography.split("\n").map((text, index) => (
                <p key={index} className="mt-2">
                  {text}
                </p>
              ))}
            </div>
            <Calendar lang={lang} user={profile} />
          </article>
          <article className="flex flex-col w-full 2xl:w-96 px-6 lg:px-0">
            <div className="flex w-full justify-between items-center">
              <span>{translation("reviews")}</span>
              <div className="flex">
                <Rating points={profile.averagePoints} />
                <span className="text-independence text-sm ml-1">
                  ({profile.reviewsCount})
                </span>
              </div>
            </div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {reviews.length === 0 && (
              <span className="text-gray-500 text-center text-sm my-6">
                {translation("noReviews")}
              </span>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang, username },
}: Pick<ProfileProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "profile");

  const { profile } = await fetchProfile(username);

  if (!profile) {
    return {};
  }

  return {
    title: translation("title").replace("_", profile.username),
  };
};

export default Profile;
