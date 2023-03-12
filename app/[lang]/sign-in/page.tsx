import { Language, useTranslation } from "@app/i18n";
import SignInForm from "./sign-in.form";

import FirstFigure from "@app/public/signin-figure-first.svg";
import SecondFigure from "@app/public/signin-figure-second.svg";
import ThirdFigure from "@app/public/signin-figure-third.svg";
import FourthFigure from "@app/public/signin-figure-fourth.svg";

interface SignInProps {
  params: {
    lang: Language;
  };
}

const SignIn = ({ params: { lang } }: SignInProps) => {
  return (
    <section className="flex grow justify-center">
      <article className="bg-white min-w-min flex items-center justify-center">
        <SignInForm lang={lang} />
      </article>
      <aside className="grow bg-cetacean-blue hidden lg:block relative">
        <FirstFigure className="absolute top-20 right-28 motion-safe:animate-spin-slow" />
        <SecondFigure className="absolute top-44 left-28 hidden xl:block motion-safe:animate-spin-slow" />
        <FourthFigure className="absolute top-[40%] right-[45%] hidden 2xl:block motion-safe:animate-spin-slow" />
        <ThirdFigure className="absolute bottom-24 right-72 motion-safe:animate-spin-slow" />
      </aside>
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<SignInProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "sign-in");

  return {
    title: translation("title"),
  };
};

export default SignIn;
