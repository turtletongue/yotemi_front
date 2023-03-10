import { Language, useTranslation } from "@app/i18n";
import SignUpForm from "./sign-up.form";
import FirstFigure from "@app/public/signup-figure-first.svg";
import SecondFigure from "@app/public/signup-figure-second.svg";
import ThirdFigure from "@app/public/signup-figure-third.svg";
import FourthFigure from "@app/public/signup-figure-fourth.svg";

interface SignUpProps {
  params: {
    lang: Language;
  };
}

const SignUp = async ({ params: { lang } }: SignUpProps) => {
  return (
    <section className="flex grow justify-center">
      <aside className="grow bg-cetacean-blue hidden lg:block relative">
        <FirstFigure className="absolute top-20 left-28 motion-safe:animate-spin-slow" />
        <SecondFigure className="absolute top-44 right-28 hidden xl:block motion-safe:animate-spin-slow" />
        <FourthFigure className="absolute top-[40%] right-[45%] hidden 2xl:block motion-safe:animate-spin-slow" />
        <ThirdFigure className="absolute bottom-24 left-72 motion-safe:animate-spin-slow" />
      </aside>
      <article className="bg-white min-w-min flex items-center justify-center">
        <SignUpForm lang={lang} />
      </article>
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<SignUpProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "sign-up");

  return {
    title: translation("title"),
  };
};

export default SignUp;
