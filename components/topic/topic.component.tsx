import { X } from "react-feather";
import classnames from "classnames";

import { TopicLabel } from "@store/features/topics";
import { Language } from "@app/i18n";

interface TopicProps {
  lang: Language;
  colorHex: string;
  labels: TopicLabel[];
  deletable?: boolean;
  showDeleteAlways?: boolean;
  onDelete?: () => unknown;
}

const Topic = ({
  lang,
  colorHex,
  labels,
  deletable = false,
  showDeleteAlways = false,
  onDelete,
}: TopicProps) => {
  return (
    <div
      className={`rounded-full pl-4 pr-4 py-1 text-sm text-center w-fit ${classnames(
        deletable &&
          `group flex items-center cursor-pointer transition-all duration-300 ease-in-out ${
            showDeleteAlways ? "pr-2" : "hover:pr-2 hover:opacity-90"
          }`
      )}`}
      style={{ backgroundColor: `#${colorHex}` }}
      onClick={onDelete}
    >
      <span>
        {labels.find((label) => label.language === lang)?.value ??
          labels[0].value}
      </span>
      <X
        size={17}
        className={`ml-2 ${
          showDeleteAlways ? "block" : "hidden group-hover:block"
        }`}
      />
    </div>
  );
};

export default Topic;
