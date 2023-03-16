import Image from "next/image";

import { Button } from "@components";
import { Language, useTranslation } from "@app/i18n";
import FirstFigure from "@app/public/homepage-figure-first.svg";
import SecondFigure from "@app/public/homepage-figure-second.svg";
import ThirdFigure from "@app/public/homepage-figure-third.svg";
import FourthFigure from "@app/public/homepage-figure-fourth.svg";
import MacMock from "@app/public/mac-mock.png";

interface HomeProps {
  params: {
    lang: Language;
  };
}

const Home = async ({ params: { lang } }: HomeProps) => {
  const { translation } = await useTranslation(lang, "homepage");

  return (
    <section className="grow bg-cetacean-blue flex items-center w-full px-4 overflow-hidden">
      <div className="w-full md:w-1/2 h-full flex justify-center items-center text-white relative">
        <FirstFigure className="absolute -top-48 left-48 motion-safe:animate-spin-slow" />
        <SecondFigure className="absolute top-72 left-16 motion-safe:animate-spin-slow" />
        <ThirdFigure className="absolute top-72 right-28 hidden lg:block motion-safe:animate-spin-slow" />
        <article className="flex flex-col items-center select-none">
          <h1 className="flex flex-col text-center items-center font-black text-5xl sm:text-6xl">
            {translation("heading.normal")}{" "}
            <span className="bg-title-blue-gradient bg-clip-text text-transparent h-20">
              {translation("heading.colored")}
            </span>
          </h1>
          <Button
            className="w-40 h-12 sm:w-48 sm:h-14 sm:mt-2 font-bold"
            animated
          >
            {translation("button")}
          </Button>
        </article>
      </div>
      <div className="hidden md:block relative w-1/2 h-full flex justify-center items-center text-white">
        <FourthFigure className="absolute -top-20 motion-safe:animate-spin-slow" />
        <Image
          className="relative"
          src={MacMock}
          alt={translation("mock")}
          width={700}
          unoptimized
          priority
        />
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
  };
};

export default Home;
