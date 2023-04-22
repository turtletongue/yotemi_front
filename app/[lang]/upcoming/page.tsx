import { Language, useTranslation } from "@app/i18n";
import UpcomingList from "./upcoming-list.component";

interface UpcomingProps {
  params: {
    lang: Language;
  };
}

const Upcoming = async ({ params: { lang } }: UpcomingProps) => {
  return (
    <section className="grow flex flex-col items-center bg-cetacean-blue text-white pt-12 px-4 pb-4">
      <UpcomingList lang={lang} />
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<UpcomingProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "upcoming");

  return {
    title: translation("title"),
  };
};

export default Upcoming;
