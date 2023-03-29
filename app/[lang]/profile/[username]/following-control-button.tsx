"use client";

import { Spinner } from "flowbite-react";

import { Button } from "@components";
import {
  useFollowUserMutation,
  useGetUserQuery,
  useUnfollowUserMutation,
} from "@redux/features/users";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";

interface FollowingControlButtonProps {
  lang: Language;
  profileId: Id;
}

const FollowingControlButton = ({
  lang,
  profileId,
}: FollowingControlButtonProps) => {
  const { translation } = useTranslation(lang, "profile");

  const { data: profile } = useGetUserQuery(profileId);

  const [follow] = useFollowUserMutation();
  const [unfollow] = useUnfollowUserMutation();

  if (!profile) {
    return (
      <Button>
        <Spinner size="sm" />
      </Button>
    );
  }

  return (
    <>
      {!profile.isFollowing ? (
        <Button
          addition={profile.followersCount}
          onClick={() => follow(profile.id)}
        >
          {translation("follow")}
        </Button>
      ) : (
        <Button
          outline
          addition={profile.followersCount}
          onClick={() => unfollow(profile.id)}
        >
          {translation("unfollow")}
        </Button>
      )}
    </>
  );
};

export default FollowingControlButton;
