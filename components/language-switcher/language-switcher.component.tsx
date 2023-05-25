"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import GB from "country-flag-icons/react/1x1/GB";
import RU from "country-flag-icons/react/1x1/RU";

import { Language, languages } from "@app/i18n";
import classnames from "classnames";

interface LanguageSwitcher {
  lang: Language;
  id?: string;
  className?: string;
}

const icons = {
  en: <GB className="rounded-full h-6 w-6" />,
  ru: <RU className="rounded-full h-6 w-6" />,
} as const;

const LanguageSwitcher = ({ lang, id, className }: LanguageSwitcher) => {
  const pathname = usePathname();
  const pathnameWithoutLocale =
    languages.reduce((result, language) => {
      if (result.startsWith(`/${language}`)) {
        return result.replace(`/${language}`, "");
      }

      return result;
    }, pathname) || "/";

  return (
    <Menu as="div" className="text-white relative flex sm:block gap-2">
      <Menu.Button
        className={classnames("px-3 py-2 uppercase", className)}
        id={id}
      >
        {icons[lang]}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="sm:absolute right-0 left-0 w-100">
          <div className="sm:bg-space-cadet w-100 text-center flex gap-2 sm:block rounded-md">
            {languages
              .filter((language) => language !== lang)
              .map((language) => (
                <Menu.Item key={language}>
                  <div className="w-100 py-2 px-1">
                    <Link
                      className="uppercase h-fit block flex justify-center"
                      href={`/${language}${pathnameWithoutLocale}`}
                    >
                      {icons[language]}
                    </Link>
                  </div>
                </Menu.Item>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSwitcher;
