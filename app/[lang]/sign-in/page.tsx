import { Suspense } from "react";

import { Language, useTranslation } from "@app/i18n";
import { TonProofProvider, TonProvider } from "@utils";
import SignInForm from "./sign-in.form";
import SignInFigureFirst from "./sign-in-figure-first.component";
import SignInFigureSecond from "./sign-in-figure-second.component";
import SignInFigureThird from "./sign-in-figure-third.component";
import SignInFigureFourth from "./sign-in-figure-fourth.component";

interface SignInProps {
  params: {
    lang: Language;
  };
}

const SignIn = ({ params: { lang } }: SignInProps) => {
  return (
    <section className="flex grow justify-center">
      <article className="bg-white min-w-min flex items-center justify-center">
        <TonProvider lang={lang}>
          <TonProofProvider>
            <SignInForm lang={lang} />
          </TonProofProvider>
        </TonProvider>
      </article>
      <aside className="grow bg-cetacean-blue hidden lg:block relative">
        <Suspense>
          <SignInFigureFirst />
        </Suspense>
        <Suspense>
          <SignInFigureSecond />
        </Suspense>
        <Suspense>
          <SignInFigureFourth />
        </Suspense>
        <Suspense>
          <SignInFigureThird />
        </Suspense>
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
