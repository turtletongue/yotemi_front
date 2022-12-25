import Image from "next/image";

import { Button } from "@components";
import { Language, useTranslation } from "@app/i18n";
import FirstFigure from "../../public/homepage-figure-first.svg";
import SecondFigure from "../../public/homepage-figure-second.svg";
import ThirdFigure from "../../public/homepage-figure-third.svg";
import FourthFigure from "../../public/homepage-figure-fourth.svg";
import MacMock from "../../public/mac-mock.png";

interface HomeProps {
  params: {
    lang: Language;
  };
}

const Home = async ({ params: { lang } }: HomeProps) => {
  const { translation } = await useTranslation(lang, "homepage");

  return (
    <section className="grow bg-cetacean-blue flex items-center w-screen px-4">
      <div className="w-full md:w-1/2 h-full flex justify-center items-center text-white relative">
        <FirstFigure className="absolute -top-40 left-48 motion-safe:animate-spin-slow" />
        <SecondFigure className="absolute top-72 left-16 motion-safe:animate-spin-slow" />
        <ThirdFigure className="absolute top-72 right-28 hidden lg:block motion-safe:animate-spin-slow" />
        <article className="flex flex-col items-center select-none">
          <h1 className="flex flex-col text-center items-center font-inter font-black text-5xl sm:text-6xl">
            {translation("heading.normal")}{" "}
            <span>
              <span className="bg-title-blue-gradient bg-clip-text text-transparent">
                {translation("heading.colored")}
              </span>
            </span>
          </h1>
          <Button className="w-40 h-12 sm:w-48 sm:h-14 mt-7 font-bold">
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

export default Home;
