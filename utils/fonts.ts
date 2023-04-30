import { Mulish, Noto_Sans } from "next/font/google";

export const notoSans = Noto_Sans({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans",
  subsets: ["cyrillic", "latin"],
  fallback: ["system-ui", "PT Sans", "sans-serif"],
});

export const mulish = Mulish({
  weight: ["400"],
  variable: "--font-mulish",
  subsets: ["cyrillic", "latin"],
  fallback: ["system-ui", "PT Sans", "sans-serif"],
});
