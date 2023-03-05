import { Language, useTranslation } from "@app/i18n";
import SignUpForm from "./sign-up.form";

interface SignUpProps {
  params: {
    lang: Language;
  };
}

const SignUp = async ({ params: { lang } }: SignUpProps) => {
  return (
    <section className="flex grow">
      <aside className="grow bg-cetacean-blue hidden md:block"></aside>
      <article className="bg-white flex items-center">
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
