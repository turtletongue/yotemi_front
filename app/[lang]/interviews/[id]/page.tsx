import { notFound } from "next/navigation";

import { Language, useTranslation } from "@app/i18n";
import MediaSession from "./media-session.component";
import InterviewChat from "./interview-chat.component";
import fetchInterview from "./fetch-interview";
import fetchIceServers from "./fetch-ice-servers";

interface InterviewPageProps {
  params: {
    lang: Language;
    id: string;
  };
}

const InterviewPage = async ({ params: { lang, id } }: InterviewPageProps) => {
  const { isFound, interview } = await fetchInterview(id);

  if (!isFound || !interview) {
    return notFound();
  }

  const iceServers = await fetchIceServers();

  return (
    <section className="grow bg-cetacean-blue text-white flex">
      <MediaSession lang={lang} interview={interview} iceServers={iceServers} />
      <InterviewChat
        lang={lang}
        interviewId={interview.id}
        creatorId={interview.creatorId}
        participantId={interview.participant!.id}
      />
    </section>
  );
};

export const generateMetadata = async ({
  params: { lang },
}: Pick<InterviewPageProps, "params">) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { translation } = await useTranslation(lang, "interview");

  return {
    title: translation("title"),
  };
};

export default InterviewPage;
