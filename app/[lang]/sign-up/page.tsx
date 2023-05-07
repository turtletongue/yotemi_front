import { Suspense } from "react";

import { Language, useTranslation } from "@app/i18n";
import SignUpForm from "./sign-up.form";
import SignUpFigureFirst from "./sign-up-figure-first.component";
import SignUpFigureSecond from "./sign-up-figure-second.component";
import SignUpFigureThird from "./sign-up-figure-third.component";
import SignUpFigureFourth from "./sign-up-figure-fourth.component";

interface SignUpProps {
  params: {
    lang: Language;
  };
}

const SignUp = async ({ params: { lang } }: SignUpProps) => {
  return (
    <section className="flex grow justify-center">
      <aside className="grow bg-cetacean-blue hidden lg:block relative">
        <Suspense>
          <SignUpFigureFirst />
        </Suspense>
        <Suspense>
          <SignUpFigureSecond />
        </Suspense>
        <Suspense>
          <SignUpFigureFourth />
        </Suspense>
        <Suspense>
          <SignUpFigureThird />
        </Suspense>
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
