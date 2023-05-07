"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";

import { NotificationBell, Notifications } from "@components";
import { useListNotificationsQuery } from "@store/features/notifications";
import { Language, useTranslation } from "@app/i18n/client";

interface NotificationsPopoverProps {
  lang: Language;
  id?: string;
  onClick?: MouseEventHandler;
}

const NotificationsPopover = ({
  lang,
  id,
  onClick,
}: NotificationsPopoverProps) => {
  const { translation } = useTranslation(lang, "notifications");

  const { data: { notSeenCount } = {} } = useListNotificationsQuery();

  return (
    <div id={id}>
      <Link
        href={`/${lang}/notifications`}
        className="sm:hidden"
        aria-label={translation("bell-icon")!}
        onClick={onClick}
      >
        <NotificationBell lang={lang} hasNotifications={!!notSeenCount} />
      </Link>
      <Popover className="relative hidden sm:block">
        <Popover.Button className="flex items-center mr-5 relative">
          <NotificationBell lang={lang} hasNotifications={!!notSeenCount} />
        </Popover.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel className="absolute overflow-x-hidden rounded-lg bg-space-cadet text-white text-left shadow-xl top-2 -left-80">
            <Notifications lang={lang} reactOnHover />
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};

export default NotificationsPopover;
