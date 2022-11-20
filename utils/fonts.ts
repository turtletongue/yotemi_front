import { Inter, Mitr, Roboto_Mono } from "@next/font/google";

export const mitr = Mitr({
  weight: ["400"],
  variable: "--font-mitr",
  subsets: ["latin"],
});
export const inter = Inter({
  weight: ["700"],
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
});
export const robotoMono = Roboto_Mono({
  weight: ["400"],
  variable: "--font-roboto-mono",
  subsets: ["cyrillic", "latin"],
});
