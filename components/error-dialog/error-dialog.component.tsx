"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "flowbite-react";

import ErrorNotification from "./error-notification";
import { Language, useTranslation } from "@app/i18n/client";

interface ErrorDialogProps {
  error?: ErrorNotification | null;
  onClose: () => unknown;
  lang: Language;
}

const ErrorDialog = ({ error, onClose, lang }: ErrorDialogProps) => {
  const { translation } = useTranslation(lang, "error-dialog");

  return (
    <Transition appear show={!!error} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        open={!!error}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                <Dialog.Title className="font-bold text-xl mt-4">
                  {error?.title}
                </Dialog.Title>
                <Dialog.Description className="my-6 text-[#7A8999]">
                  {error?.description}
                </Dialog.Description>

                <Button
                  color="failure"
                  className="mx-auto w-full"
                  onClick={onClose}
                >
                  {translation("close")}
                </Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ErrorDialog;
