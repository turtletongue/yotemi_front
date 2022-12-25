import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { dir } from "i18next";

import { Navbar } from "@components";
import { Language, languages } from "@app/i18n";
import { fonts } from "@utils";

import "../../styles/globals.css";

export const generateStaticParams = () => {
  return languages.map((lang) => ({ lang }));
};

interface LayoutProps {
  params: {
    lang: Language;
  };
  children: ReactNode;
}

const RootLayout = async ({ children, params: { lang } }: LayoutProps) => {
  if (!languages.includes(lang)) {
    notFound();
  }

  return (
    <html lang={lang} dir={dir(lang)}>
      <body
        className={`flex flex-col w-full min-h-screen ${fonts.inter.variable}`}
      >
        <Navbar lang={lang} />
        <main className="flex flex-col grow">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
