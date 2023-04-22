import { ReactNode } from "react";

import { Language, useTranslation } from "@app/i18n";
import MemberFilters from "./member-filters";

interface MembersLayoutProps {
  params: {
    lang: Language;
  };
  children: ReactNode;
}

const MembersLayout = ({ params: { lang }, children }: MembersLayoutProps) => {
  return (
    <section className="grow flex flex-col bg-cetacean-blue text-white p-4 lg:p-6">
      <MemberFilters lang={lang} />
      {children}
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<MembersLayoutProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "members");

  return {
    title: translation("title"),
  };
};

export default MembersLayout;
