import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import { GradientButton } from "@components";
import { Language, useTranslation } from "@app/i18n";
import ProjectDescription from "./project-description";
import HomepageFigureFirst from "./homepage-figure-first.component";
import HomepageFigureSecond from "./homepage-figure-second.component";
import HomepageFigureThird from "./homepage-figure-third.component";
import HomepageFigureFourth from "./homepage-figure-fourth.component";

import MacMock from "@app/public/mac-mock.webp";

interface HomeProps {
  params: {
    lang: Language;
  };
}

const Home = async ({ params: { lang } }: HomeProps) => {
  const { translation } = await useTranslation(lang, "homepage");

  return (
    <section className="grow bg-cetacean-blue flex items-center w-full px-4 overflow-hidden">
      <div className="w-full lg:w-1/2 h-full flex justify-center items-center text-white relative">
        <Suspense>
          <HomepageFigureFirst />
        </Suspense>
        <Suspense>
          <HomepageFigureSecond />
        </Suspense>
        <Suspense>
          <HomepageFigureThird />
        </Suspense>
        <article className="absolute select-none max-w-[35rem]">
          <h1 className="font-black text-4xl sm:text-5xl 2xl:text-6xl">
            {translation("heading.normal")}{" "}
            <span className="bg-title-blue-gradient bg-clip-text text-transparent">
              {translation("heading.colored")}{" "}
            </span>
          </h1>
          <ProjectDescription translation={translation} />
          <Link href="/members">
            <GradientButton
              className="w-40 h-12 sm:w-48 sm:h-14 mt-5 font-bold"
              animated
            >
              {translation("button")}
            </GradientButton>
          </Link>
        </article>
      </div>
      <div className="hidden lg:block relative w-1/2 h-full flex justify-center items-center text-white">
        <Suspense>
          <HomepageFigureFourth />
        </Suspense>
        <div className="w-[48vw] h-[40vw] 2xl:w-[37vw] 2xl:h-[30vw] object-cover relative">
          <Image
            className="relative"
            src={MacMock}
            alt={translation("mock")}
            quality={100}
            priority
            fill
            sizes="(max-width: 1736px) 48vw, 37vw"
          />
        </div>
      </div>
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<HomeProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "homepage");

  return {
    title: translation("title"),
    description: translation("metaDescription"),
  };
};

export default Home;
