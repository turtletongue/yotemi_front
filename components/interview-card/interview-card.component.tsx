"use client";

import { DateTime } from "luxon";

import {
  Interview,
  useConfirmInterviewPaymentMutation,
} from "@redux/features/interviews";
import { formatTime } from "@utils";
import InterviewStatus from "./interview-status.component";

import { Avatar, ConfirmPaymentModal } from "@components";
import {
  useCancelContractMutation,
  useFinishContractMutation,
  useGetContractInfoQuery,
  usePurchaseContractMutation,
} from "@redux/features/contract";
import TonSymbol from "@app/public/ton_symbol.svg";
import { Language, useTranslation } from "@app/i18n/client";
import { useState } from "react";

interface InterviewCardProps {
  lang: Language;
  interview: Interview;
  userAddress: string;
}

const errorInfo = {
  status: "missing",
  creatorAddress: null,
  payerAddress: null,
} as const;

const InterviewCard = ({
  lang,
  interview,
  userAddress,
}: InterviewCardProps) => {
  const { translation } = useTranslation(lang, "interview-card");

  const { data, isFetching } = useGetContractInfoQuery(interview.address);

  const info = data ? data : errorInfo;

  const [purchase] = usePurchaseContractMutation();
  const [cancel] = useCancelContractMutation();
  const [finish] = useFinishContractMutation();
  const [confirm] = useConfirmInterviewPaymentMutation();

  const [isModalOpened, setIsModalOpened] = useState(false);

  if (isFetching) {
    return (
      <div className="bg-card rounded-3xl w-72 px-5 py-5 mb-4 break-inside-avoid shadow-md animate-pulse">
        <div className="h-2.5 mx-auto mb-2.5 bg-gray-400 rounded-full"></div>
        <div className="h-2.5 bg-gray-400 rounded-full w-1/3"></div>
      </div>
    );
  }

  const isCreator = info.creatorAddress === userAddress;
  const isPayer = info.payerAddress === userAddress;

  const isStarted = DateTime.now() > DateTime.fromISO(interview.startAt);
  const remainingMinutes = DateTime.fromISO(interview.startAt).diffNow(
    "minutes"
  ).minutes;

  const canCancel =
    ((info.status === "paid" && isPayer) || isCreator) &&
    info.status !== "finished" &&
    (!isStarted || remainingMinutes < 5);
  const canPurchase = info.status === "created" && !isCreator;
  const canConfirmPayment =
    info.status === "paid" && isPayer && !interview.participant;
  const canConnect =
    info.status === "paid" && interview.participant && (isCreator || isPayer);
  const canFinish =
    canConnect && new Date(interview.endAt).getTime() < Date.now();

  const hasButtons = !["canceled", "finished", "missing"].includes(info.status);

  return (
    <>
      <article
        className={`bg-card rounded-3xl w-72 px-5 pt-5 mb-4 break-inside-avoid shadow-md ${
          hasButtons ? "pb-3" : "pb-5"
        }`}
      >
        <div className="flex justify-between text-sm">
          <span>
            {formatTime(interview.startAt)} - {formatTime(interview.endAt)}
          </span>
          <InterviewStatus lang={lang} status={info.status} />
        </div>
        <span className="flex items-center">
          <span className="text-sm mr-1">{interview.price}</span>
          <TonSymbol />
        </span>
        {interview.participant && (
          <>
            <div className="flex justify-between items-center my-3">
              <span>{interview.participant.fullName}</span>
              <Avatar
                img={interview.participant.avatarPath ?? undefined}
                size="sm"
                rounded
              />
            </div>
            {interview.payerComment &&
              interview.payerComment
                .split("\n")
                .map((commentPart, index) => <p key={index}>{commentPart}</p>)}
          </>
        )}
        {hasButtons && (
          <div className="flex justify-around w-full mt-6 text-sm font-bold gap-6">
            {canCancel && (
              <button
                className="text-red-500"
                onClick={() => cancel(interview.address)}
              >
                {translation("cancel")}
              </button>
            )}
            {canPurchase && (
              <button
                className="text-blue-400"
                onClick={() => {
                  purchase({
                    address: interview.address,
                    value: interview.price,
                  });
                }}
              >
                {translation("purchase")}
              </button>
            )}
            {canConfirmPayment && (
              <button
                className="text-blue-400"
                onClick={() => setIsModalOpened(true)}
              >
                {translation("confirm")}
              </button>
            )}
            {canConnect && (
              <button className="text-blue-400">
                {translation("connect")}
              </button>
            )}
            {canFinish && (
              <button
                className="text-blue-400"
                onClick={() => finish(interview.address)}
              >
                {translation("finish")}
              </button>
            )}
          </div>
        )}
      </article>
      <ConfirmPaymentModal
        lang={lang}
        isOpen={isModalOpened}
        onClose={() => setIsModalOpened(false)}
        onConfirm={(comment) => confirm({ id: interview.id, comment })}
      />
    </>
  );
};

export default InterviewCard;
