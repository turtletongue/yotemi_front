import { notFound } from "next/navigation";

import {
  Avatar,
  Button,
  Calendar,
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

  const { translation } = await useTranslation(lang, "profile");

  return (
    <section className="grow bg-cetacean-blue text-white">
      <div className="flex justify-center w-full mt-32">
        <Avatar
          img={profile.avatarPath ?? undefined}
          className="h-min"
          size="xl"
          rounded
        />
        <article className="max-w-screen-md mx-24">
          <div className="flex justify-between">
            <div className="max-w-sm">
              <div className="flex items-center">
                <h1 className="text-xl">{profile.fullName}</h1>
                <span className="mx-4 text-gray-500 text-sm">
                  @{profile.username}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
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
            </div>
            <Button addition={103}>{translation("follow")}</Button>
          </div>
          <div className="mt-7">
            {profile.biography.split("\n").map((text, index) => (
              <p key={index} className="mt-2">
                {text}
              </p>
            ))}
          </div>
          <Calendar lang={lang} />
        </article>
        <article className="flex flex-col w-96">
          <div className="flex  w-full justify-between items-center">
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
            <span className="text-gray-500 text-center text-sm mt-6">
              {translation("noReviews")}
            </span>
          )}
        </article>
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
