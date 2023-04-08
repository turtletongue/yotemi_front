"use client";

import { Spinner } from "flowbite-react";

import { Button } from "@components";
import {
  useFollowUserMutation,
  User,
  useUnfollowUserMutation,
} from "@redux/features/users";
import { Language, useTranslation } from "@app/i18n/client";

interface FollowingControlButtonProps {
  lang: Language;
  profile: User;
  className?: string;
  disabled?: boolean;
  addition?: boolean;
}

const FollowingControlButton = ({
  lang,
  profile,
  className,
  disabled,
  addition = false,
}: FollowingControlButtonProps) => {
  const { translation } = useTranslation(lang, "profile");

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
          addition={addition ? profile.followersCount : undefined}
          onClick={() => follow(profile.id)}
          className={className}
          disabled={disabled}
        >
          {translation("follow")}
        </Button>
      ) : (
        <Button
          outline
          addition={addition ? profile.followersCount : undefined}
          className={className}
          onClick={() => unfollow(profile.id)}
        >
          {translation("unfollow")}
        </Button>
      )}
    </>
  );
};

export default FollowingControlButton;
