import { Head } from "@components";
import { titleText } from "./text.i18n";

import { I18nParams } from "@types";

interface RootHeadProps extends I18nParams {}

const RootHead = ({ params: { lang } }: RootHeadProps) => {
  return <Head title={titleText[lang]} />;
};

export default RootHead;
