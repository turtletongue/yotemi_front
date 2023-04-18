import { Language } from "@app/i18n";
import MembersGrid from "./members-grid";

interface MembersProps {
  params: {
    lang: Language;
  };
}

const Members = ({ params: { lang } }: MembersProps) => {
  return (
    <div className="max-w-screen-[1955px] mx-auto w-full grow flex flex-col">
      <MembersGrid lang={lang} />
    </div>
  );
};

export default Members;
