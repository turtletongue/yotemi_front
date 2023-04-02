"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import * as yup from "yup";
import classnames from "classnames";

import { ErrorDialog, ErrorNotification, GradientButton } from "@components";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
import {
  interviewsApi,
  useAddInterviewMutation,
  useCheckInterviewTimeConflictMutation,
} from "@redux/features/interviews";
import { selectUser } from "@redux/features/auth";
import { Language, useTranslation } from "@app/i18n/client";
import { useInterviewDeploy } from "@app/hooks";
import { extractErrorNotification, getDateFromTime, MINUTE } from "@utils";
import createInterviewErrors from "./create-interview.errors";

interface CreateInterviewFormProps {
  lang: Language;
  contractCode: string;
  date: Date;
}

interface CreateInterviewSchema {
  price: number;
  startAt: Date;
  endAt: Date;
}

const MIN_PRICE = 0.000000001;

const createInterviewSchema = yup.object().shape({
  price: yup.number().moreThan(0).required(),
  startAt: yup
    .date()
    .required()
    .test({
      name: "min",
      exclusive: false,
      params: {},
      message: "${path} must be in the future",
      test: function (value) {
        return value?.getTime() > Date.now() + 5 * MINUTE;
      },
    }),
  endAt: yup
    .date()
    .required()
    .test({
      name: "min",
      exclusive: false,
      params: {},
      message: "${path} must be greater than startAt on more than 5 minutes",
      test: function (value) {
        return value?.getTime() >= this.parent.startAt?.getTime() + 5 * MINUTE;
      },
    }),
});

const CreateInterviewForm = ({
  lang,
  contractCode,
  date,
}: CreateInterviewFormProps) => {
  const dispatch = useAppDispatch();
  const { translation } = useTranslation(lang, "create-interview");

  const isDisabled =
    new Date(date.toDateString()).getTime() <
    new Date(new Date().toDateString()).getTime();

  const authenticatedUser = useAppSelector(selectUser);

  /* Form initialization */

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm<CreateInterviewSchema>({
    mode: "onChange",
    resolver: yupResolver(createInterviewSchema),
  });

  register("startAt");
  register("endAt");

  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

  /* Submit handler */

  const [addInterview, { error, isLoading: isInterviewCreation }] =
    useAddInterviewMutation();
  const [
    checkInterviewTimeConflict,
    { isLoading: isCheckTimeConflictsLoading },
  ] = useCheckInterviewTimeConflictMutation();
  const initializeDeploy = useInterviewDeploy(contractCode);
  const [isDeployLoading, setIsDeployLoading] = useState(false);
  const [isDeploySuccess, setIsDeploySuccess] = useState(false);

  const isLoading =
    isCheckTimeConflictsLoading || isDeployLoading || isInterviewCreation;

  const createInterview = async ({
    price,
    startAt,
    endAt,
  }: CreateInterviewSchema) => {
    if (!authenticatedUser) {
      return;
    }

    try {
      await checkInterviewTimeConflict({ startAt, endAt }).unwrap();
    } catch (error: unknown) {
      return setDialogError(
        extractErrorNotification(
          error as FetchBaseQueryError,
          createInterviewErrors,
          translation
        )
      );
    }

    const { address, executeTransaction } = initializeDeploy(
      price,
      authenticatedUser.accountAddress,
      startAt,
      endAt
    );

    addInterview({
      address,
      price,
      startAt,
      endAt,
    });

    setIsDeployLoading(true);
    const deployedAddress = await executeTransaction();
    setIsDeployLoading(false);

    if (!deployedAddress) {
      return setDialogError(
        translation("deployFailedError", { returnObjects: true })
      );
    }

    setIsDeploySuccess(true);

    dispatch(
      interviewsApi.util.invalidateTags([
        { type: "Interviews", id: "PARTIAL-LIST" },
      ])
    );
  };

  useEffect(() => {
    if (isDeploySuccess) {
      reset();
      setIsDeploySuccess(false);
    }
  }, [reset, isDeploySuccess]);

  useEffect(() => {
    if (error) {
      setDialogError(
        extractErrorNotification(error, createInterviewErrors, translation)
      );
    }
  }, [translation, error]);

  return (
    <>
      <form
        className="m-auto w-64 md:w-76 xl:w-64 flex flex-col items-center"
        onSubmit={handleSubmit(createInterview)}
      >
        <div className={`w-full ${classnames(isDisabled && "opacity-70")}`}>
          <Label htmlFor="price mb-1">
            <span className="text-white">{translation("price")}</span>
            <TextInput
              type="number"
              min={MIN_PRICE}
              step={MIN_PRICE}
              color={errors.price ? "failure" : "gray"}
              disabled={isDisabled}
              {...register("price")}
            />
          </Label>
        </div>
        <div
          className={`w-full mt-3 ${classnames(isDisabled && "opacity-70")}`}
        >
          <Label htmlFor="startAt">
            <span className="text-white mb-1">{translation("startAt")}</span>
          </Label>
          <TextInput
            type="time"
            color={errors.startAt ? "failure" : "gray"}
            helperText={
              errors.startAt && (
                <span className="text-danger">
                  {translation("startAtError")}
                </span>
              )
            }
            disabled={isDisabled}
            name="startAt"
            id="startAt"
            onChange={(event) => {
              setValue("startAt", getDateFromTime(event.target.value, date));
            }}
          />
        </div>
        <div
          className={`w-full mt-3 ${classnames(isDisabled && "opacity-70")}`}
        >
          <Label htmlFor="endAt">
            <span className="text-white mb-1">{translation("endAt")}</span>
          </Label>
          <TextInput
            type="time"
            color={errors.endAt ? "failure" : "gray"}
            helperText={
              errors.endAt && (
                <span className="text-danger">{translation("endAtError")}</span>
              )
            }
            disabled={isDisabled}
            name="endAt"
            id="endAt"
            onChange={(event) => {
              setValue("endAt", getDateFromTime(event.target.value, date));
            }}
          />
        </div>
        <div className="text-sm text-gray-500 text-center">
          <p className="mt-4">
            {translation("firstTipPart")}{" "}
            <Link
              href={`${process.env.NEXT_PUBLIC_TONSCAN_URL}/address/${authenticatedUser?.accountAddress}`}
              className="text-concentrated-blue"
            >
              {translation("wallet")}
            </Link>{" "}
            {translation("secondTipPart")}
          </p>
          <p className="mt-2">{translation("thirdTipPart")}</p>
        </div>
        <GradientButton
          className="w-full h-12 mt-6"
          animated
          loading={isLoading}
          loadingText={translation("loading")}
          disabled={isDisabled}
        >
          {translation("submit")}
        </GradientButton>
      </form>
      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
    </>
  );
};

export default CreateInterviewForm;
