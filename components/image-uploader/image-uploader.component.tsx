"use client";

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Progress } from "flowbite-react";

import { ErrorDialog, ErrorNotification } from "@components";
import { selectAccessToken } from "@redux/features/auth";
import { useAppSelector } from "@redux/store-config/hooks";
import useFileUploader from "@hooks/use-file-uploader";
import { Language, useTranslation } from "@app/i18n/client";
import CropModal from "./crop-modal.component";

interface FileUploaderProps {
  lang: Language;
  route?: string;
  onUploaded?: () => unknown;
  disabled?: boolean;
  className?: string;
  rounded?: boolean;
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  progressClassName?: string;
  children?: ReactNode;
}

const ImageUploader = ({
  lang,
  route,
  onUploaded,
  disabled = false,
  className,
  rounded,
  aspect,
  minHeight,
  minWidth,
  progressClassName,
  children,
}: FileUploaderProps) => {
  const { translation } = useTranslation(lang, "image-uploader");

  const accessToken = useAppSelector(selectAccessToken);
  const {
    progress,
    isLoading,
    isSuccess,
    resetSuccess,
    error,
    resetError,
    onUpload,
  } = useFileUploader({
    route,
    onUploaded,
    accessToken: accessToken ?? "",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string>();
  const [isCropModalOpened, setIsCropModalOpened] = useState(false);

  useEffect(() => {
    if (isSuccess && inputRef.current) {
      inputRef.current.value = "";
      resetSuccess();
    }
  }, [isSuccess, resetSuccess]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPreviewSrc(URL.createObjectURL(file));
    setIsCropModalOpened(true);
  };

  const onModalClose = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setIsCropModalOpened(false);
  };

  const errorNotification =
    error &&
    (translation("uploadingError", {
      returnObjects: true,
    }) as ErrorNotification);

  const id = `imageUploader-[${route}]`;

  return (
    <>
      <label htmlFor={id} className={className}>
        <input
          type="file"
          id={id}
          name="file"
          className="hidden"
          accept="image/png,image/jpeg,image/gif,image/webp"
          ref={inputRef}
          onChange={onChange}
          disabled={disabled}
        />
        {!isLoading ? (
          children
        ) : (
          <Progress
            progress={progress}
            color="purple"
            size="sm"
            className={`min-w-[3.5rem] ${progressClassName}`}
          />
        )}
      </label>
      <ErrorDialog error={errorNotification} onClose={resetError} lang={lang} />
      <CropModal
        lang={lang}
        src={previewSrc}
        isOpened={isCropModalOpened}
        onClose={onModalClose}
        rounded={rounded}
        aspect={aspect}
        minHeight={minHeight}
        minWidth={minWidth}
        onCrop={onUpload}
      />
    </>
  );
};

export default ImageUploader;
