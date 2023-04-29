"use client";

import { MouseEventHandler, useEffect, useState } from "react";
import { Label, Spinner, Textarea, TextInput } from "flowbite-react";
import { Plus } from "react-feather";
import { redirect, useRouter } from "next/navigation";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Button,
  CreatableAsyncPaginate,
  ErrorDialog,
  ErrorNotification,
  Topic as TopicBadge,
} from "@components";
import { selectUser, useLogoutMutation } from "@redux/features/auth";
import {
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "@redux/features/users";
import { Topic, useAddTopicMutation } from "@redux/features/topics";
import { useAppDispatch, useAppSelector } from "@redux/store-config/hooks";
import useTopicsSelect from "@hooks/use-topics-select";
import {
  MAX_BIOGRAPHY_LENGTH,
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_TOPICS_COUNT,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@app/constants";
import { Language, useTranslation } from "@app/i18n/client";
import { extractErrorNotification, getRandomColdColor } from "@utils";
import { Id } from "@app/declarations";
import DeleteAccountModal from "./delete-account.modal";
import changeSettingsFormErrors from "./change-settings-form.errors";

interface ChangeSettingsFormProps {
  lang: Language;
}

interface SettingsSchema {
  firstName: string;
  lastName: string;
  username: string;
  topics: Topic[];
  biography: string;
}

const settingsSchema = yup.object().shape({
  firstName: yup.string().max(MAX_FIRST_NAME_LENGTH).required(),
  lastName: yup.string().max(MAX_LAST_NAME_LENGTH).required(),
  username: yup
    .string()
    .min(MIN_USERNAME_LENGTH)
    .max(MAX_USERNAME_LENGTH)
    .required(),
  topics: yup
    .array()
    .max(MAX_TOPICS_COUNT)
    .required()
    .of(
      yup.object().shape({
        labels: yup
          .array()
          .required()
          .of(
            yup.object().shape({
              language: yup.string().required(),
              value: yup.string().required(),
            })
          ),
        colorHex: yup.string().required(),
      })
    ),
  biography: yup.string().max(MAX_BIOGRAPHY_LENGTH),
});

const ChangeSettingsForm = ({ lang }: ChangeSettingsFormProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { translation } = useTranslation(lang, "settings");

  const authenticatedUser = useAppSelector(selectUser);

  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);

  /* Form initialization */

  const {
    register,
    formState: { errors, isValid },
    control,
    setValue,
    handleSubmit,
  } = useForm<SettingsSchema>({
    mode: "onChange",
    resolver: yupResolver(settingsSchema),
  });

  const [selectedTopicId, setSelectedTopicId] = useState<Id | null>(null);
  const [isSelectedTopicLoading, setIsSelectedTopicLoading] = useState(false);
  const {
    fields: attachedTopics,
    append: attachTopic,
    remove: detachTopic,
  } = useFieldArray({
    name: "topics",
    control,
    keyName: "key",
  });

  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

  /* Fetching default values */

  const { data, isLoading } = useGetUserQuery(authenticatedUser?.id!, {
    skip: !authenticatedUser?.id,
  });

  useEffect(() => {
    if (data) {
      setValue("firstName", data.firstName);
      setValue("lastName", data.lastName);
      setValue("username", data.username);
      setValue("topics", data.topics);
      setValue("biography", data.biography);
    }
  }, [setValue, data]);

  /* Submit handler */

  const [
    updateUser,
    { error: updatingError, isLoading: isUpdating, isSuccess: isUpdated },
  ] = useUpdateUserMutation();

  const updateSettings = (data: SettingsSchema) => {
    if (authenticatedUser) {
      updateUser({
        id: authenticatedUser.id,
        ...data,
        topics: data.topics.map(({ id }) => id),
      });
    }
  };

  const [
    deleteUser,
    { error: deletingError, isLoading: isDeleting, isSuccess: isDeleted },
  ] = useDeleteUserMutation();

  const onDeleteAccount = () => {
    if (authenticatedUser) {
      deleteUser(authenticatedUser.id);
    }
  };

  /* Topics methods */

  const [addTopic, { error: addingTopicError }] = useAddTopicMutation();

  /* Success handler */

  useEffect(() => {
    if (isUpdated) {
      router.push(`/profile/${data?.username}`);
    }
  }, [router, isUpdated, data?.username]);

  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (isDeleted) {
      logout();
      router.push("/");
    }
  }, [dispatch, router, logout, isDeleted]);

  /* Error handler */

  useEffect(() => {
    const error = updatingError || deletingError;

    if (error) {
      setDialogError(
        extractErrorNotification(error, changeSettingsFormErrors, translation)
      );
    }
  }, [translation, updatingError, deletingError]);

  /* Data fetching for async select */

  const { topicsLoader, topicsMap, topicIdToOption } = useTopicsSelect(
    lang,
    selectedTopicId,
    attachedTopics.map(({ id }) => id)
  );

  /* Guards */

  if (!authenticatedUser) {
    return redirect("/");
  }

  if (isLoading) {
    return <Spinner color="purple" size="xl" />;
  }

  if (!data) {
    return <></>;
  }

  /* Topic handlers */

  const onTopicCreate = async (label: string) => {
    try {
      const { id } = await addTopic({
        labels: [{ language: lang, value: label }],
        colorHex: getRandomColdColor(),
      }).unwrap();

      setSelectedTopicId(id);
    } catch (error: unknown) {
      setDialogError(
        extractErrorNotification(
          error as FetchBaseQueryError,
          changeSettingsFormErrors,
          translation
        )
      );
    }
  };

  const onTopicSelect = (
    option:
      | (ReturnType<typeof topicIdToOption> & { __isNew__?: boolean })
      | null
  ) => {
    if (option?.__isNew__) {
      setIsSelectedTopicLoading(true);
      onTopicCreate(option.label).then(() => setIsSelectedTopicLoading(false));
    } else {
      setSelectedTopicId(option?.value ?? null);
    }
  };

  const onTopicAttach: MouseEventHandler = (event) => {
    event.preventDefault();

    if (!selectedTopicId) {
      return;
    }

    attachTopic(topicsMap[selectedTopicId]);
    setSelectedTopicId(null);
  };

  const isTopicsLimit = attachedTopics.length === MAX_TOPICS_COUNT;

  /* Delete modal handler */

  const onDeleteModalOpened: MouseEventHandler = (event) => {
    event.preventDefault();

    setIsDeleteModalOpened(true);
  };

  return (
    <>
      <form
        className="w-full md:w-96 lg:w-1/3 mt-6"
        onSubmit={handleSubmit(updateSettings)}
      >
        <div className="w-full flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-36 xl:w-48 2xl:w-64">
            <Label htmlFor="firstName">
              <span className="text-white">{translation("firstName")}</span>
            </Label>
            <TextInput
              color={errors.firstName ? "failure" : "gray"}
              helperText={errors.firstName ? translation("firstNameError") : ""}
              {...register("firstName")}
            />
          </div>
          <div className="w-full mt-2 lg:mt-0 lg:w-36 xl:w-48 2xl:w-64">
            <Label htmlFor="lastName">
              <span className="text-white">{translation("lastName")}</span>
            </Label>
            <TextInput
              color={errors.lastName ? "failure" : "gray"}
              helperText={errors.lastName ? translation("lastNameError") : ""}
              {...register("lastName")}
            />
          </div>
        </div>
        <div className="w-full mt-4 lg:w-36 xl:w-48 2xl:w-64">
          <Label htmlFor="username">
            <span className="text-white">{translation("username")}</span>
          </Label>
          <TextInput
            color={errors.username ? "failure" : "gray"}
            helperText={errors.username ? translation("usernameError") : ""}
            {...register("username")}
          />
        </div>
        <div className="w-full mt-4">
          <Label htmlFor="topicsSelect">
            <span className="text-white">{translation("topics")}</span>
          </Label>
          <div className="flex w-full">
            <CreatableAsyncPaginate
              name="topicsSelect"
              value={topicIdToOption(selectedTopicId)}
              onChange={onTopicSelect}
              loadOptions={topicsLoader}
              additional={{ page: 1 }}
              className="text-gray-500 grow lg:grow-0 lg:w-36 xl:w-48 2xl:w-64 mr-2"
              placeholder={translation("addTopicPlaceholder")}
              debounceTimeout={250}
              isClearable
              cacheUniqs={[attachedTopics.length]}
              isDisabled={isSelectedTopicLoading || isTopicsLimit}
            />
            <Button
              onClick={onTopicAttach}
              disabled={!selectedTopicId || isTopicsLimit}
            >
              <Plus size={20} />
            </Button>
          </div>
          {attachedTopics.length !== 0 && (
            <div className="mt-4 flex flex-col gap-4">
              {attachedTopics.map((topic, index) => (
                <TopicBadge
                  key={topic.key}
                  colorHex={topic.colorHex}
                  deletable
                  onDelete={() => detachTopic(index)}
                  lang={lang}
                  labels={topic.labels}
                />
              ))}
            </div>
          )}
        </div>
        <div className="w-full mt-4">
          <Label htmlFor="biography">
            <span className="text-white">{translation("biography")}</span>
          </Label>
          <Textarea
            id="biography"
            className="min-h-[15rem]"
            color={errors.biography ? "failure" : "gray"}
            helperText={errors.biography ? translation("biographyError") : ""}
            placeholder={translation("biographyPlaceholder") ?? ""}
            {...register("biography")}
          />
        </div>
        <div className="w-full flex flex-col xl:flex-row-reverse gap-4 justify-between mt-6">
          <Button className="w-full xl:w-fit justify-center h-10">
            {translation("submit")}
          </Button>
          <Button
            className="w-full xl:w-fit justify-center h-10"
            color="danger"
            outline
            onClick={onDeleteModalOpened}
          >
            {translation("deleteAccount")}
          </Button>
        </div>
      </form>
      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
      <DeleteAccountModal
        lang={lang}
        isOpen={isDeleteModalOpened}
        onClose={() => setIsDeleteModalOpened(false)}
        isLoading={isDeleting}
        onDelete={onDeleteAccount}
      />
    </>
  );
};

export default ChangeSettingsForm;
