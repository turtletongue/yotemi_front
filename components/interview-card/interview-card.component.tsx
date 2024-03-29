"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DateTime } from "luxon";
import { ExternalLink } from "react-feather";
import classnames from "classnames";

import {
  Avatar,
  ConfirmPaymentModal,
  ErrorDialog,
  ErrorNotification,
} from "@components";
import {
  Interview,
  useConfirmInterviewPaymentMutation,
} from "@store/features/interviews";
import {
  useCancelContractMutation,
  useFinishContractMutation,
  useGetContractInfoQuery,
  usePurchaseContractMutation,
} from "@store/features/contract";
import { useAppSelector } from "@store/store-config/hooks";
import { selectUser } from "@store/features/auth";
import { extractErrorNotification, formatTime } from "@utils";
import { Language, useTranslation } from "@app/i18n/client";
import InterviewStatus from "./interview-status.component";
import interviewCardErrors from "./interview-card.errors";

import TonSymbol from "@app/public/ton_symbol.svg";

interface InterviewCardProps {
  lang: Language;
  interview: Interview;
  userToShow?: "participant" | "creator";
}

const errorInfo = {
  status: "notConnected",
  creatorAddress: null,
  payerAddress: null,
} as const;

const InterviewCard = ({
  lang,
  interview,
  userToShow = "participant",
}: InterviewCardProps) => {
  const router = useRouter();
  const { translation } = useTranslation(lang, "interview-card");

  const authenticatedUser = useAppSelector(selectUser);
  const { data, isFetching } = useGetContractInfoQuery(interview.address);

  const info = data ?? errorInfo;

  const [purchase, { error: purchaseError, isLoading: isPurchaseLoading }] =
    usePurchaseContractMutation();
  const [cancel, { error: cancelError, isLoading: isCancelLoading }] =
    useCancelContractMutation();
  const [finish, { error: finishError, isLoading: isFinishLoading }] =
    useFinishContractMutation();
  const [confirm, { error: confirmError, isLoading: isConfirmLoading }] =
    useConfirmInterviewPaymentMutation();

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

  useEffect(() => {
    const error = purchaseError || cancelError || finishError || confirmError;

    if (error) {
      const errorNotification = extractErrorNotification(
        error,
        interviewCardErrors,
        translation,
        ["USER_REJECTED_CALL"]
      );

      if (errorNotification) {
        setDialogError(errorNotification);
      }
    }
  }, [translation, purchaseError, cancelError, finishError, confirmError]);

  if (isFetching) {
    return (
      <div className="bg-card rounded-3xl w-72 p-5 mb-4 break-inside-avoid shadow-md animate-pulse">
        <div className="h-2.5 mx-auto mb-2.5 bg-gray-400 rounded-full"></div>
        <div className="h-2.5 bg-gray-400 mb-2.5 rounded-full w-1/3"></div>
        <div className="h-2.5 bg-gray-400 rounded-full w-2/3"></div>
      </div>
    );
  }

  const isCreator = info.creatorAddress === authenticatedUser?.accountAddress;
  const isPayer = info.payerAddress === authenticatedUser?.accountAddress;

  const isStarted = DateTime.now() > DateTime.fromISO(interview.startAt);
  const remainingMinutes = DateTime.fromISO(interview.startAt).diffNow(
    "minutes"
  ).minutes;

  const isActual = new Date(interview.endAt).getTime() >= Date.now();

  const canCancel =
    ((info.status === "paid" && isPayer) || isCreator) &&
    info.status !== "finished" &&
    (!isStarted || remainingMinutes > 5);
  const canPurchase = info.status === "created" && !isCreator;
  const canConfirmPayment =
    info.status === "paid" && isPayer && !interview.participant;

  const isInterviewMember = interview.participant && (isCreator || isPayer);
  const hasPaidAccess = info.status === "paid" && isInterviewMember;

  const canConnect = hasPaidAccess && isActual;
  const canFinish = hasPaidAccess && !isActual;

  const hasButtons =
    !["canceled", "finished", "notConnected"].includes(info.status) &&
    authenticatedUser;

  return (
    <>
      <article
        className={`bg-card rounded-3xl w-72 px-5 pt-5 mb-4 break-inside-avoid shadow-md mx-auto ${
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
        <span className="text-sm mt-1">
          {translation("showOn")}{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_TONSCAN_URL}/address/${interview.address}`}
            target="_blank"
            className="text-vivid-dark"
          >
            <span>Tonscan</span>
            <ExternalLink className="inline relative bottom-1" size={11} />
          </Link>
        </span>
        {userToShow === "participant" &&
          interview.participant &&
          isInterviewMember && (
            <>
              <div className="flex justify-between items-center my-3 text-sm">
                <span>{interview.participant.fullName}</span>
                <Avatar
                  img={interview.participant.avatarPath}
                  size="sm"
                  rounded
                />
              </div>
              {interview.payerComment &&
                interview.payerComment.split("\n").map((commentPart, index) => (
                  <p key={index} className="text-sm">
                    {commentPart}
                  </p>
                ))}
            </>
          )}
        {userToShow === "creator" && interview.creator && isInterviewMember && (
          <div className="flex justify-between items-center my-3 text-sm">
            <span>{interview.creator.fullName}</span>
            <Avatar img={interview.creator.avatarPath} size="sm" rounded />
          </div>
        )}
        {hasButtons && (
          <div className="flex justify-around w-full mt-6 text-sm font-bold gap-6">
            {canCancel && (
              <button
                className={`text-red-500 ${classnames(
                  isCancelLoading && "opacity-70"
                )}`}
                disabled={isCancelLoading}
                onClick={() => cancel(interview.address)}
              >
                {translation("cancel")}
              </button>
            )}
            {canPurchase && (
              <button
                className={`text-blue-400 ${classnames(
                  isPurchaseLoading && "opacity-70"
                )}`}
                disabled={isPurchaseLoading}
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
                className={`text-blue-400 ${classnames(
                  isConfirmLoading && "opacity-70"
                )}`}
                disabled={isConfirmLoading}
                onClick={() => setIsModalOpened(true)}
              >
                {translation("confirm")}
              </button>
            )}
            {canConnect && (
              <button
                className="text-blue-400"
                onClick={() => router.push(`/interviews/${interview.id}`)}
              >
                {translation("connect")}
              </button>
            )}
            {canFinish && (
              <button
                className={`text-blue-400 ${classnames(
                  isFinishLoading && "opacity-70"
                )}`}
                disabled={isFinishLoading}
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
      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
    </>
  );
};

export default InterviewCard;
