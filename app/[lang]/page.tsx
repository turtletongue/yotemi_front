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
      <div className="w-full lg:w-1/2 h-full flex justify-center items-center text-white relative">
        <FirstFigure className="absolute -top-48 left-48 motion-safe:animate-spin-slow" />
        <SecondFigure className="absolute top-72 left-16 motion-safe:animate-spin-slow" />
        <ThirdFigure className="absolute top-60 right-28 hidden lg:block motion-safe:animate-spin-slow" />
        <article className="flex flex-col items-center select-none">
          <h1 className="flex flex-col text-center items-center font-black text-4xl sm:text-5xl 2xl:text-6xl">
            {translation("heading.normal")}{" "}
            <span className="bg-title-blue-gradient bg-clip-text text-transparent">
              {translation("heading.colored")}
            </span>
          </h1>
          <p className="my-4 text-sm sm:text-md text-center uppercase tracking-widest max-w-xs sm:max-w-md">
            {translation("description")}
          </p>
          <Button
            className="w-40 h-12 sm:w-48 sm:h-14 sm:mt-2 font-bold"
            animated
          >
            {translation("button")}
          </Button>
        </article>
      </div>
      <div className="hidden lg:block relative w-1/2 h-full flex justify-center items-center text-white">
        <FourthFigure className="absolute -top-20 motion-safe:animate-spin-slow" />
        <div className="w-[48vw] h-[40vw] 2xl:w-[37vw] 2xl:h-[30vw] object-cover relative">
          <Image
            className="relative"
            src={MacMock}
            alt={translation("mock")}
            priority
            fill
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
  };
};

export default Home;
