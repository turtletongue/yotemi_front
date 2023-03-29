"use client";

import { Dialog } from "@headlessui/react";
import { Button } from "flowbite-react";

import { Modal } from "@components";
import { Language, useTranslation } from "@app/i18n/client";
import ErrorNotification from "./error-notification";

interface ErrorDialogProps {
  error?: ErrorNotification | null;
  onClose: () => unknown;
  lang: Language;
}

const ErrorDialog = ({ error, onClose, lang }: ErrorDialogProps) => {
  const { translation } = useTranslation(lang, "error-dialog");

  return (
    <Modal isOpen={!!error} onClose={onClose}>
      <Dialog.Title className="font-bold text-xl mt-4 text-center">
        {error?.title}
      </Dialog.Title>
      <Dialog.Description className="my-6 text-[#7A8999] text-center">
        {error?.description}
      </Dialog.Description>

      <Button color="failure" className="mx-auto w-full" onClick={onClose}>
        {translation("close")}
      </Button>
    </Modal>
  );
};

export default ErrorDialog;
