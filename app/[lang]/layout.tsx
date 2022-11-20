import { ReactNode } from "react";
import { notFound } from "next/navigation";

import { Navbar } from "@components";
import { supportedLanguages } from "@app/i18n.params";
import { fonts } from "@utils";

import type { I18nParams } from "@types";
import "../../styles/globals.css";

export const generateStaticParams = () => {
  return supportedLanguages.map((lang) => ({ lang }));
};

interface LayoutProps extends I18nParams {
  children: ReactNode;
}

const RootLayout = ({ children, params: { lang } }: LayoutProps) => {
  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  return (
    <html lang={lang}>
      <body
        className={`flex flex-col w-full min-h-screen ${fonts.mitr.variable} ${fonts.inter.variable} ${fonts.robotoMono.variable}`}
      >
        <Navbar lang={lang} />
        <main className="flex flex-col grow">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
