import { TFunction } from "i18next";

interface ProjectDescriptionProps {
  translation: TFunction<string, string, string>;
}

const ProjectDescription = ({ translation }: ProjectDescriptionProps) => {
  return (
    <p className="text-sm 2xl:text-base tracking-widest uppercase mt-4 mb-3 text-gray-50 font-mulish">
      <span className="text-concentrated-blue font-mulish">
        {translation("description.companyName")}
      </span>{" "}
      {translation("description.platform")}{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.experience")}
      </span>
      , {translation("description.instruments")}{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.cryptocurrency")}
      </span>
    </p>
  );
};

export default ProjectDescription;
