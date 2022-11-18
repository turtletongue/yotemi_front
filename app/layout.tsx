import { ReactNode } from "react";

import { Navbar } from "@components";
import { mitr, mochiyPopOne, secularOne } from "../utils/fonts";

import "../styles/globals.css";

interface LayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html lang="en">
      <body
        className={`flex flex-col w-full min-h-screen ${mitr.variable} ${mochiyPopOne.variable} ${secularOne.variable}`}
      >
        <Navbar />
        <main className="flex flex-col grow">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
