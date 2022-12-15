import { MouseEventHandler } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bell } from "react-feather";
import Link from "next/link";

import Notification from "./notification";
import { bellIconText, buttonText, titleText } from "./text.i18n";
import INewFollowerNotification from "./new-follower-notification.interface";
import INewLectureNotification from "./new-lecture-notification.interface";

import type { LanguageParams } from "@app/i18n.params";

interface NotificationsProps extends LanguageParams {
  onClick?: MouseEventHandler;
}

const Notifications = ({ lang, onClick }: NotificationsProps) => {
  const notifications: (INewFollowerNotification | INewLectureNotification)[] =
    [
      {
        id: 1,
        type: "new-lecture",
        lecture: {
          title: "Algorithms and Data Structures",
          coverUrl: "https://avatars.dicebear.com/api/identicon/lecture.svg",
          author: {
            name: "Jessy",
            avatarUrl:
              "https://avatars.dicebear.com/api/croodles-neutral/bob.svg",
          },
        },
      },
      {
        id: 2,
        type: "new-follower",
        follower: {
          name: "Pete",
          avatarUrl: "https://avatars.dicebear.com/api/identicon/follower.svg",
        },
      },
      {
        id: 3,
        type: "new-follower",
        follower: {
          name: "Pete",
          avatarUrl: "https://avatars.dicebear.com/api/identicon/follower.svg",
        },
      },
      {
        id: 4,
        type: "new-follower",
        follower: {
          name: "Pete",
          avatarUrl: "https://avatars.dicebear.com/api/identicon/follower.svg",
        },
      },
      {
        id: 5,
        type: "new-follower",
        follower: {
          name: "Pete",
          avatarUrl: "https://avatars.dicebear.com/api/identicon/follower.svg",
        },
      },
    ];

  return (
    <>
      <Link
        href={`/${lang}/notifications`}
        className="sm:hidden"
        aria-label={bellIconText[lang]}
        onClick={onClick}
      >
        <Bell className="text-white cursor-pointer" />
      </Link>
      <Popover className="relative hidden sm:block">
        <Popover.Button className="flex items-center mr-5">
          <Bell
            className="sm:text-white cursor-pointer"
            aria-label={bellIconText[lang]}
          />
        </Popover.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel className="absolute overflow-x-hidden rounded-lg bg-white text-left shadow-xl top-2 -left-80 border border-gray-100">
            <div className="w-96 px-5 py-4">
              <div className="flex w-full justify-between items-center">
                <span className="font-medium">
                  {titleText[lang]} ({notifications.length})
                </span>
                <button className="text-sm cursor-pointer">
                  <span className="text-transparent font-bold bg-simple-blue-gradient bg-clip-text">
                    {buttonText[lang]}
                  </span>
                </button>
              </div>
            </div>
            <hr />
            <div className="overflow-y-auto scrollbar w-full max-h-64">
              {notifications.map((notification) => (
                <Notification
                  key={notification.id}
                  {...toNotification[notification.type](notification as any)}
                />
              ))}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

const toNotification = {
  "new-lecture": ({
    lecture: {
      title,
      coverUrl,
      author: { name },
    },
  }: INewLectureNotification) => ({
    imageUrl: coverUrl,
    text: `${name} published new lecture. ${title}`,
  }),
  "new-follower": ({
    follower: { name, avatarUrl },
  }: INewFollowerNotification) => ({
    imageUrl: avatarUrl,
    text: `${name} started following you.`,
    isDisabled: true,
  }),
};

export default Notifications;
