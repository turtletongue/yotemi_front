import { notFound } from "next/navigation";
import classnames from "classnames";

import { Avatar, Calendar, ProfileControl, Rating, Topic } from "@components";
import { User } from "@store/features/users";
import { Language, useTranslation } from "@app/i18n";
import contractCode from "@app/contract/contract-code";
import { TonProvider } from "@utils";
import fetchProfile from "./fetch-profile";
import fetchReviews from "./fetch-reviews";
import ReviewsList from "./reviews-list.component";

interface ProfileProps {
  params: {
    lang: Language;
    username: string;
  };
}

export const dynamicParams = true;

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
          img={profile.avatarPath}
          className="h-min mb-12"
          size="xl"
          rounded
        />
        <div className="flex flex-col items-center 2xl:flex-row 2xl:items-start lg:ml-24">
          <article className="2xl:mr-24">
            <div className="flex items-center justify-between flex-col sm:flex-row">
              <h1 className="text-xl mb-2 sm:mb-0">{profile.fullName}</h1>
              <TonProvider lang={lang}>
                <ProfileControl lang={lang} profileId={profile.id} />
              </TonProvider>
            </div>
            {hasTopics && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.topics.map((topic) => {
                  return (
                    <Topic
                      key={topic.id}
                      colorHex={topic.colorHex}
                      lang={lang}
                      labels={topic.labels}
                    />
                  );
                })}
              </div>
            )}
            <div
              className={classnames(
                "max-w-[40rem] mt-3",
                profile.biography && "mb-7"
              )}
            >
              {profile.biography.split("\n").map((text, index) => (
                <p key={index} className="mt-2">
                  {text}
                </p>
              ))}
            </div>
            <Calendar lang={lang} user={profile} contractCode={contractCode} />
          </article>
          <article className="flex flex-col w-full md:w-[40rem] 2xl:w-96">
            <div className="flex w-full justify-between items-center">
              <span>{translation("reviews")}</span>
              <div className="flex">
                <Rating points={profile.averagePoints} />
                <span className="text-independence text-sm ml-1">
                  ({profile.reviewsCount})
                </span>
              </div>
            </div>
            <ReviewsList
              lang={lang}
              initialReviews={reviews}
              userId={profile.id}
            />
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
    description: profile.biography,
  };
};

export const generateStaticParams = async () => {
  const users = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
    .then((res) => res.json())
    .then(({ items }) => items);

  return users.map((user: User) => ({
    username: user.username,
  }));
};

export default Profile;
