"use client";

import { Label } from "flowbite-react";
import { Camera } from "react-feather";
import classnames from "classnames";

import { Avatar, ImageRemover, ImageUploader } from "@components";
import { useGetUserQuery, usersApi } from "@store/features/users";
import { useAppDispatch, useAppSelector } from "@store/store-config/hooks";
import { selectUser } from "@store/features/auth";
import { Language, useTranslation } from "@app/i18n/client";
import { useState } from "react";

interface ChangeMediaSectionProps {
  lang: Language;
}

const ChangeMediaSection = ({ lang }: ChangeMediaSectionProps) => {
  const dispatch = useAppDispatch();
  const { translation } = useTranslation(lang, "settings");

  const authenticatedUser = useAppSelector(selectUser);
  const { data } = useGetUserQuery(authenticatedUser?.id!, {
    skip: !authenticatedUser?.id,
  });

  const [isCoverLoading, setIsCoverLoading] = useState(false);

  if (!data) {
    return <></>;
  }

  /* Cache invalidation */

  const invalidateCache = () => {
    dispatch(usersApi.util.invalidateTags([{ type: "Users", id: data.id }]));
  };

  /* Common routes */

  const changeAvatarRoute = `/users/${data.id}/avatar`;
  const changeCoverRoute = `/users/${data.id}/cover`;

  return (
    <section>
      <div className="flex flex-col items-center">
        <ImageRemover
          route={changeAvatarRoute}
          onRemoved={invalidateCache}
          active={!!data.avatarPath}
        >
          <Avatar img={data.avatarPath} size="lg" rounded />
        </ImageRemover>
        <ImageUploader
          lang={lang}
          className="mt-2"
          progressClassName="my-2 w-32"
          route={changeAvatarRoute}
          onUploaded={invalidateCache}
          aspect={1}
          minWidth={40}
          minHeight={40}
          rounded
        >
          <span className="text-sm text-vivid-dark font-bold cursor-pointer">
            {translation("upload")}
          </span>
        </ImageUploader>
      </div>
      <div>
        <Label>
          <span className="text-white">{translation("headerImage")}</span>
        </Label>
        <ImageUploader
          lang={lang}
          className="w-full lg:w-[30rem] 2xl:w-[38rem] flex justify-center items-center"
          progressClassName="my-10 w-56"
          route={`/users/${data.id}/cover`}
          onUploaded={invalidateCache}
          minWidth={80}
          minHeight={30}
          disabled={!!data.coverPath || isCoverLoading}
        >
          <div
            className={classnames(
              "rounded-2xl w-full h-20 flex justify-center items-center cursor-pointer overflow-hidden",
              !data.coverPath && "bg-white"
            )}
          >
            {data.coverPath && !isCoverLoading ? (
              <ImageRemover
                route={changeCoverRoute}
                onRemoved={invalidateCache}
                active={!!data.coverPath && !isCoverLoading}
                className="h-full w-full"
              >
                <img
                  src={data.coverPath}
                  alt={translation("headerImage") ?? ""}
                  onLoadStart={() => setIsCoverLoading(true)}
                  onLoad={() => setIsCoverLoading(false)}
                />
              </ImageRemover>
            ) : (
              <Camera size={23} className="text-cetacean-blue" />
            )}
          </div>
        </ImageUploader>
      </div>
    </section>
  );
};

export default ChangeMediaSection;
