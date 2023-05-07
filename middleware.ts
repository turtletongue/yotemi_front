import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";

import { FALLBACK_LANGUAGE, languages } from "./i18n";

acceptLanguage.languages(languages as unknown as string[]);

export const config = {
  matcher: "/:lng*",
};

const cookieName = "i18next";

export function middleware(req: NextRequest) {
  const lang = req.cookies.has(cookieName)
    ? acceptLanguage.get(req.cookies.get(cookieName)?.value)
    : acceptLanguage.get(req.headers.get("Accept-Language")) ??
      FALLBACK_LANGUAGE;

  if (
    [
      "/tonconnect-manifest.json",
      "/favicon.ico",
      "/logo.svg",
      "/app-icon.png",
    ].includes(req.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }

  // Redirect if lang in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    const pathname = req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname;

    return NextResponse.redirect(new URL(`/${lang}${pathname}`, req.url));
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer")!);

    const langInReferer = languages.find((language) =>
      refererUrl.pathname.startsWith(`/${language}`)
    );

    const response = NextResponse.next();

    if (langInReferer) {
      response.cookies.set(cookieName, langInReferer);
    }

    return response;
  }

  return NextResponse.next();
}
