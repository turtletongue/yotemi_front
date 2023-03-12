import { Language, useTranslation } from "@app/i18n";

interface PrivacyPolicyProps {
  params: {
    lang: Language;
  };
}

const PrivacyPolicy = async ({ params: { lang } }: PrivacyPolicyProps) => {
  const { translation } = await useTranslation(lang, "privacy-policy");

  return (
    <section className="grow bg-white flex items-center justify-center px-4">
      <div className="p-6 my-10 w-full lg:w-1/2">
        <h1 className="text-center font-bold text-2xl mb-4">
          {translation("content.title")}
        </h1>
        <p className="my-4">{translation("content.introduction")}</p>
        <ol>
          {(translation("content.data", { returnObjects: true }) as any[]).map(
            (element, index) => (
              <li key={index}>{element}</li>
            )
          )}
        </ol>
        <p className="my-4">{translation("content.mainPurpose")}</p>
        <ol>
          {(
            translation("content.purposes", { returnObjects: true }) as any[]
          ).map((element, index) => (
            <li key={index}>{element}</li>
          ))}
        </ol>
        <p className="my-4">{translation("content.durationOfAgreement")}</p>
        <h2 className="mb-2 font-bold">
          {translation("content.processingPurposes.title")}
        </h2>
        <p className="mb-4">{translation("content.processingPurposes.text")}</p>
        <h2 className="mb-2 font-bold">
          {translation("content.dataRemoving.title")}
        </h2>
        <p className="mb-4">{translation("content.dataRemoving.text")}</p>
      </div>
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<PrivacyPolicyProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "privacy-policy");

  return {
    title: translation("title"),
  };
};

export default PrivacyPolicy;
