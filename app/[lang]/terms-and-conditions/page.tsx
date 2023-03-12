import { Language, useTranslation } from "@app/i18n";
import { TextLink } from "@components";

interface TermsAndConditionsProps {
  params: {
    lang: Language;
  };
}

const TermsAndConditions = async ({
  params: { lang },
}: TermsAndConditionsProps) => {
  const { translation } = await useTranslation(lang, "terms-and-conditions");

  return (
    <section className="grow bg-white flex items-center justify-center px-4">
      <div className="p-6 my-10 w-full lg:w-1/2">
        <h1 className="text-center font-bold text-2xl mb-4">
          {translation("content.title")}
        </h1>
        <p className="font-bold">{translation("content.lastUpdate")}</p>
        <p className="my-4">{translation("content.introduction")}</p>
        {(translation("content.parts", { returnObjects: true }) as any[]).map(
          (part, index) => {
            return (
              <div key={index}>
                <h2 className="my-2 font-bold">{part.title}</h2>
                <ul>
                  {(part.elements as any[]).map((element, index) => (
                    <li key={index}>{element}</li>
                  ))}
                </ul>
              </div>
            );
          }
        )}
        <p className="mt-6">
          {translation("content.seeAlso")}{" "}
          <TextLink href="/privacy-policy">
            {translation("content.privacyPolicy")}
          </TextLink>
        </p>
      </div>
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<TermsAndConditionsProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "terms-and-conditions");

  return {
    title: translation("title"),
  };
};

export default TermsAndConditions;
