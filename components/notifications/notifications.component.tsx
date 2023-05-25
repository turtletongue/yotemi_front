"use client";

import { Suspense } from "react";
import { Spinner } from "flowbite-react";
import classnames from "classnames";

import { NotificationSkeleton } from "@components";
import {
  useListNotificationsQuery,
  useMarkAllAsSeenMutation,
} from "@store/features/notifications";
import { Language, useTranslation } from "@app/i18n/client";
import NewFollowerNotification from "./new-follower-notification";
import InterviewScheduledNotification from "./interview-scheduled-notification";

interface NotificationsProps {
  lang: Language;
  reactOnHover?: boolean;
}

const Notifications = ({ lang, reactOnHover }: NotificationsProps) => {
  const { translation } = useTranslation(lang, "notifications");

  const { data: { items: notifications = [], notSeenCount } = {}, isLoading } =
    useListNotificationsQuery();

  const [markAllAsSeen, { isLoading: isMarkingAsSeen }] =
    useMarkAllAsSeenMutation();

  const isMarkAsSeenButtonActive = notifications.length > 0 && !isMarkingAsSeen;

  return (
    <div className="text-white">
      <div className="w-80 sm:w-96 px-5 py-4">
        <div className="flex w-full justify-between items-center">
          <span className="font-medium">
            {translation("title")} ({notSeenCount})
          </span>
          <button
            className={classnames(
              "text-sm",
              isMarkAsSeenButtonActive ? "cursor-pointer" : "opacity-70"
            )}
            onClick={() => markAllAsSeen()}
            disabled={!isMarkAsSeenButtonActive}
          >
            <span
              className={classnames(
                "font-black text-vivid-light",
                isMarkAsSeenButtonActive && "hover:text-vivid-medium"
              )}
            >
              {translation("button")}
            </span>
          </button>
        </div>
      </div>
      <hr className="border-gray-400" />
      <div className="overflow-y-auto scrollbar w-full max-h-64">
        {!isLoading &&
          (notifications.length !== 0 ? (
            notifications.map((notification) => {
              if (notification.type === "newFollower") {
                return (
                  <Suspense
                    key={notification.id}
                    fallback={<NotificationSkeleton />}
                  >
                    <NewFollowerNotification
                      lang={lang}
                      follower={notification.content!.follower}
                      isSeen={notification.isSeen}
                      reactOnHover={reactOnHover}
                    />
                  </Suspense>
                );
              }

              return (
                <Suspense
                  key={notification.id}
                  fallback={<NotificationSkeleton />}
                >
                  <InterviewScheduledNotification
                    lang={lang}
                    interview={notification.content!.interview}
                    creator={notification.content!.creator}
                    isSeen={notification.isSeen}
                    reactOnHover={reactOnHover}
                  />
                </Suspense>
              );
            })
          ) : (
            <p className="h-20 flex items-center justify-center text-gray-500 text-sm">
              {translation("noNotificationsFound")}
            </p>
          ))}
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner size="md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
