import { notFound } from "next/navigation";

import { Language, useTranslation } from "@app/i18n";
import MediaSession from "./media-session.component";
import InterviewChat from "./interview-chat.component";
import fetchInterview from "./fetch-interview";

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

  return (
    <section className="grow bg-cetacean-blue text-white flex overflow-hidden">
      <section className="grow relative flex items-center justify-center">
        <MediaSession lang={lang} interview={interview} />
      </section>
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
