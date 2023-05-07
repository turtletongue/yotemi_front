"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { Button, Textarea } from "flowbite-react";

import { Modal, Rating } from "@components";
import { useAppSelector } from "@store/store-config/hooks";
import { useAddReviewMutation } from "@store/features/reviews";
import { selectUser } from "@store/features/auth";
import { Language, useTranslation } from "@app/i18n/client";
import { Id } from "@app/declarations";

interface AddReviewModalProps {
  lang: Language;
  targetUserId: Id;
  isOpen: boolean;
  onClose: () => unknown;
  onError: () => unknown;
}

const AddReviewModal = ({
  lang,
  targetUserId,
  isOpen,
  onClose,
  onError,
}: AddReviewModalProps) => {
  const { translation } = useTranslation(lang, "add-review-modal");

  const [addReview, { isSuccess }] = useAddReviewMutation();
  const authenticatedUser = useAppSelector(selectUser);

  const router = useRouter();
  useEffect(() => {
    if (isSuccess && authenticatedUser?.username) {
      router.push(`/profile/${authenticatedUser.username}`);
    }
  }, [router, isSuccess, authenticatedUser?.username]);

  const [points, setPoints] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title className="font-bold text-xl mt-4 text-center">
        {translation("title")}
      </Dialog.Title>

      <div className="w-full flex flex-col gap-8 my-6 text-[#7A8999]">
        <div className="w-full flex justify-center">
          <Rating points={points} size={35} onClick={setPoints} />
        </div>
        <div className="w-full">
          <Textarea
            id="comment"
            name="comment"
            placeholder={translation("placeholder") ?? ""}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
      </div>

      <Button
        className="mx-auto w-full"
        onClick={() => {
          addReview({ points, comment, userId: targetUserId })
            .unwrap()
            .then(onClose)
            .catch(onError);
        }}
        disabled={points === 0}
      >
        {translation("confirm")}
      </Button>
    </Modal>
  );
};

export default AddReviewModal;
