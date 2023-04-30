import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { dir } from "i18next";

import { Navbar } from "@components";
import { Language, languages } from "@app/i18n";
import { fonts } from "@utils";
import TonProvider from "./ton-provider";
import ReduxProvider from "./redux-provider";
import TonProofProvider from "./ton-proof-provider";

import "flowbite";
import "buffer";
import "@app/styles/globals.css";

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
        className={`flex flex-col w-full min-h-screen dark-scrollbar ${fonts.mulish.variable} ${fonts.notoSans.variable} font-noto-sans`}
      >
        <ReduxProvider>
          <TonProvider lang={lang}>
            <TonProofProvider>
              <>
                <Navbar lang={lang} />
                <main className="flex flex-col grow">{children}</main>
              </>
            </TonProofProvider>
          </TonProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};

export const generateMetadata = async () => {
  return {
    icons: "/favicon.ico",
  };
};

export default RootLayout;
