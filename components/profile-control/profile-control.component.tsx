"use client";

import { useRouter } from "next/navigation";

import { Button } from "@components";
import { loggedOut, selectUser } from "@redux/features/auth";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
import { Language } from "@app/i18n";
import { useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";
import FollowingControlButton from "./following-control-button";
import { useTonConnectUI } from "@tonconnect/ui-react";

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

  if (profileId !== authenticatedUser?.id) {
    return (
      <FollowingControlButton
        lang={lang}
        profileId={profileId}
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
    <div className="flex items-center gap-4">
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
