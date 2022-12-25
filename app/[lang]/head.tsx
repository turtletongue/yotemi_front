import { Head } from "@components";
import { Language, useTranslation } from "@app/i18n";

interface RootHeadProps {
  params: {
    lang: Language;
  };
}

const RootHead = async ({ params: { lang } }: RootHeadProps) => {
  const { translation } = await useTranslation(lang, "homepage");

  return <Head title={translation("title")!} />;
};

export default RootHead;
