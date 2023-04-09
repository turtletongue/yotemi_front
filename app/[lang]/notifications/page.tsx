import { Notifications } from "@components";
import { Language, useTranslation } from "@app/i18n";

interface NotificationsPageProps {
  params: {
    lang: Language;
  };
}

const NotificationsPage = ({ params: { lang } }: NotificationsPageProps) => {
  return (
    <section className="bg-cetacean-blue grow flex justify-center p-4">
      <Notifications lang={lang} />
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<NotificationsPageProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "notifications");

  return {
    title: translation("title"),
  };
};

export default NotificationsPage;
