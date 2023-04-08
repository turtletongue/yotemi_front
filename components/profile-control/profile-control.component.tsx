"use client";

import { useRouter } from "next/navigation";
import { useTonConnectUI } from "@tonconnect/ui-react";

import { Button, FollowingControlButton } from "@components";
import { loggedOut, selectUser } from "@redux/features/auth";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";
import { useGetUserQuery } from "@redux/features/users";

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

  if (!authenticatedUser || !profile) {
    return <></>;
  }

  if (profileId !== authenticatedUser.id) {
    return (
      <FollowingControlButton
        lang={lang}
        profile={profile}
        disabled={!authenticatedUser}
      />
    );
  }

  const onSettingsOpen = () => {
    router.push("/settings");
  };

  const onLogOut = () => {
    dispatch(loggedOut());
    tonConnectUI.disconnect().then(() => router.push("/"));
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