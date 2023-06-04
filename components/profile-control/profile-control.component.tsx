"use client";

import { useRouter } from "next/navigation";
import { useTonConnectUI } from "@tonconnect/ui-react";

import { Button, FollowingControlButton } from "@components";
import { selectUser, useLogoutMutation } from "@store/features/auth";
import { useAppDispatch, useAppSelector } from "@store/store-config/hooks";
import { useGetUserQuery, usersApi } from "@store/features/users";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";

interface ProfileControlProps {
  lang: Language;
  profileId: Id;
}

const ProfileControl = ({ lang, profileId }: ProfileControlProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { translation } = useTranslation(lang, "profile");
  const [tonConnectUI] = useTonConnectUI();

  const authenticatedUser = useAppSelector(selectUser);
  const { data: profile } = useGetUserQuery(profileId);
  const [logout] = useLogoutMutation();

  if (!authenticatedUser || !profile) {
    return <></>;
  }

  if (profileId !== authenticatedUser.id) {
    return (
      <FollowingControlButton
        lang={lang}
        profile={profile}
        disabled={!authenticatedUser}
        addition
      />
    );
  }

  const onSettingsOpen = () => {
    router.push("/settings");
  };

  const onLogOut = () => {
    logout();
    dispatch(
      usersApi.util.invalidateTags([{ type: "Users", id: "PARTIAL-LIST" }])
    );

    if (tonConnectUI.connected) {
      tonConnectUI.disconnect().then(() => router.push("/"));
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center gap-4 mt-2 sm:ml-12">
      <Button outline onClick={onSettingsOpen}>
        {translation("settings")}
      </Button>
      <Button outline color="danger" onClick={onLogOut}>
        {translation("signOut")}
      </Button>
    </div>
  );
};

export default ProfileControl;
