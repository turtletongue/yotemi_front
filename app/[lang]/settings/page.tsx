import { Language, useTranslation } from "@app/i18n";
import ChangeSettingsForm from "./change-settings.form";
import ChangeMediaSection from "./change-media-section";

interface SettingsProps {
  params: {
    lang: Language;
  };
}

const Settings = ({ params: { lang } }: SettingsProps) => {
  return (
    <section className="grow bg-cetacean-blue text-white p-4 flex flex-col justify-center items-center">
      <div className="w-full md:w-96 lg:w-fit">
        <ChangeMediaSection lang={lang} />
        <ChangeSettingsForm lang={lang} />
      </div>
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<SettingsProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "settings");

  return {
    title: translation("title"),
  };
};

export default Settings;
