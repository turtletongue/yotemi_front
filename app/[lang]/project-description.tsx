import { TFunction } from "i18next";

interface ProjectDescriptionProps {
  translation: TFunction<string, string, string>;
}

const ProjectDescription = ({ translation }: ProjectDescriptionProps) => {
  return (
    <p className="text-xs sm:text-sm 2xl:text-base tracking-widest uppercase mt-6 mb-4 text-gray-50 font-mulish">
      <span className="text-concentrated-blue font-mulish">
        {translation("description.companyName")}
      </span>{" "}
      {translation("description.platform")}{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.experience")}
      </span>{" "}
      {translation("description.instruments")}{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.doNotWorry")}
      </span>{" "}
      {translation("description.about")}{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.reliability")}
      </span>
      ,{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.speed")}
      </span>{" "}
      {translation("description.and")}{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.security")}
      </span>{" "}
      {translation("description.guaranteed")}{" "}
      <span className="text-concentrated-blue font-mulish">
        {translation("description.blockchain")}
      </span>
    </p>
  );
};

export default ProjectDescription;
