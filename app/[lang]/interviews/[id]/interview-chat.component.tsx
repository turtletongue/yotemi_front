"use client";

import { Fragment, KeyboardEventHandler, useRef, useState } from "react";
import { Spinner, Textarea } from "flowbite-react";

import { AuthorBadge, Button, InterviewMessage } from "@components";
import {
  useAddInterviewMessageMutation,
  useListInterviewMessagesQuery,
} from "@redux/features/interview-messages";
import { useGetUserQuery, User } from "@redux/features/users";
import { useAppSelector } from "@redux/store-config/hooks";
import { selectUser } from "@redux/features/auth";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";
import { DateTime } from "luxon";

interface InterviewChatProps {
  lang: Language;
  interviewId: Id;
  creatorId: Id;
  participantId: Id;
}

const InterviewChat = ({
  lang,
  interviewId,
  creatorId,
  participantId,
}: InterviewChatProps) => {
  const { translation } = useTranslation(lang, "interview-chat");
  const scrollBoundaryRef = useRef<HTMLDivElement>(null);

  const authenticatedUser = useAppSelector(selectUser);
  const [message, setMessage] = useState("");

  const [addMessage, { isLoading: isAdding }] =
    useAddInterviewMessageMutation();
  const onSend = () => {
    addMessage({ content: message.trim(), interviewId });
    setMessage("");

    if (scrollBoundaryRef.current) {
      scrollBoundaryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { data: { items: messages } = {}, isLoading } =
    useListInterviewMessagesQuery(interviewId);

  const { data: creator } = useGetUserQuery(creatorId);
  const { data: participant } = useGetUserQuery(participantId);

  const onEnter: KeyboardEventHandler = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    if (isAdding || message.trim().length === 0) {
      return;
    }

    onSend();
  };

  return (
    <article className="w-full md:w-96 bg-white text-black flex flex-col pb-4 pl-4">
      <section className="grow relative overflow-y-scroll scrollbar mb-4">
        <div className="absolute w-full pr-4">
          {!isLoading &&
            messages &&
            messages.map((message, index) => {
              const nextMessage = messages[index + 1];
              const isNextMessageHaveOtherAuthor =
                !nextMessage || nextMessage.authorId !== message.authorId;

              const isAuthorsFetched = creator && participant;
              const messageAuthor = (
                isAuthorsFetched
                  ? message.authorId === creator.id
                    ? creator
                    : participant
                  : null
              ) as User | null;

              const previousMessage = messages[index - 1];
              const isPreviousMessageInOtherDay =
                !previousMessage ||
                new Date(previousMessage.createdAt).toDateString() !==
                  new Date(message.createdAt).toDateString();

              return (
                <Fragment key={message.id}>
                  {isPreviousMessageInOtherDay && (
                    <div className="flex justify-center my-3 text-sm text-gray-500 capitalize">
                      {DateTime.fromISO(message.createdAt).toRelativeCalendar()}
                    </div>
                  )}
                  <InterviewMessage
                    content={message.content}
                    createdAt={message.createdAt}
                    isOwn={message.authorId === authenticatedUser?.id}
                  />
                  {isNextMessageHaveOtherAuthor && messageAuthor && (
                    <AuthorBadge
                      lang={lang}
                      firstName={messageAuthor.firstName}
                      avatarPath={messageAuthor.avatarPath}
                      isOwn={messageAuthor.id === authenticatedUser?.id}
                    />
                  )}
                </Fragment>
              );
            })}
          <div ref={scrollBoundaryRef} />
        </div>
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner color="purple" size="lg" />
          </div>
        )}
      </section>
      <div className="flex w-full justify-between items-center gap-4">
        <Textarea
          id="messageInput"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={translation("messageInputPlaceholder") ?? ""}
          onKeyDown={onEnter}
          className="grow min-h-[3.5rem] max-h-[20rem]"
        />
        <Button
          className="text-white mr-4"
          onClick={onSend}
          disabled={isAdding || message.trim().length === 0}
        >
          {translation("send")}
        </Button>
      </div>
    </article>
  );
};

export default InterviewChat;
