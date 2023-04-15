"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button, Label, Textarea } from "flowbite-react";

import { Modal } from "@components";
import { Language, useTranslation } from "@app/i18n/client";

interface ConfirmPaymentModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => unknown;
  onConfirm: (comment: string) => unknown;
}

const ConfirmPaymentModal = ({
  lang,
  isOpen,
  onConfirm,
  onClose,
}: ConfirmPaymentModalProps) => {
  const { translation } = useTranslation(lang, "confirm-payment-modal");

  const [comment, setComment] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title className="font-bold text-xl mt-4 text-center">
        {translation("title")}
      </Dialog.Title>

      <div className="w-full my-6 text-[#7A8999]">
        <Label htmlFor="payerComment">
          <span className="font-bold mb-1">{translation("comment")}</span>
        </Label>
        <Textarea
          id="payerComment"
          name="payerComment"
          placeholder={translation("placeholder") ?? ""}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>

      <Button
        className="mx-auto w-full"
        onClick={() => {
          onConfirm(comment);
          onClose();
        }}
      >
        {translation("confirm")}
      </Button>
    </Modal>
  );
};

export default ConfirmPaymentModal;
