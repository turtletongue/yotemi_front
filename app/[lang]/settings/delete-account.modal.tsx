"use client";

import { Dialog } from "@headlessui/react";
import { Button } from "flowbite-react";

import { Modal } from "@components";
import { Language, useTranslation } from "@app/i18n/client";

interface DeleteAccountModalProps {
  lang: Language;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => unknown;
  onDelete: () => unknown;
}

const DeleteAccountModal = ({
  lang,
  isOpen,
  isLoading = false,
  onClose,
  onDelete,
}: DeleteAccountModalProps) => {
  const { translation } = useTranslation(lang, "delete-account-modal");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title className="font-bold text-xl mt-4 text-center">
        {translation("title")}
      </Dialog.Title>

      <Dialog.Description className="my-6">
        {translation("description")}
      </Dialog.Description>

      <Button
        className="mx-auto w-full"
        color="failure"
        onClick={() => {
          onDelete();
          onClose();
        }}
        disabled={isLoading}
      >
        {translation("confirm")}
      </Button>
    </Modal>
  );
};

export default DeleteAccountModal;
