"use client";

import { Bell } from "react-feather";

import { Language, useTranslation } from "@app/i18n/client";

interface NotificationBellProps {
  lang: Language;
  hasNotifications: boolean;
}

const NotificationBell = ({
  lang,
  hasNotifications,
}: NotificationBellProps) => {
  const { translation } = useTranslation(lang, "notifications");

  return (
    <div className="relative text-white">
      <Bell
        className="sm:text-white cursor-pointer"
        aria-label={translation("bell-icon")!}
      />
      {hasNotifications && (
        <div className="h-2 w-2 rounded-full bg-danger absolute top-0 left-3" />
      )}
    </div>
  );
};

export default NotificationBell;
