"use client";

import { useRef, useState } from "react";
import { Button } from "flowbite-react";
import ReactCrop, { Crop } from "react-image-crop";

import { Modal } from "@components";
import { Language, useTranslation } from "@app/i18n/client";

import "react-image-crop/dist/ReactCrop.css";
import cropToCanvas from "@app/utils/crop-to-canvas";

interface CropModalProps {
  lang: Language;
  rounded?: boolean;
  src?: string;
  isOpened: boolean;
  onClose: () => unknown;
  aspect?: number;
  minWidth?: number;
  minHeight?: number;
  onCrop: (file: File | null) => unknown;
}

const CropModal = ({
  lang,
  rounded,
  src,
  isOpened,
  onClose,
  aspect,
  minHeight = 35,
  minWidth = 35,
  onCrop,
}: CropModalProps) => {
  const { translation } = useTranslation(lang, "crop-modal");

  const initialCrop = {
    unit: "px",
    width: minWidth,
    height: minHeight,
    x: 25,
    y: 25,
  } as const;
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const imgRef = useRef<HTMLImageElement>(null);

  const applyCrop = async (src?: string) => {
    if (!src || !imgRef.current || !crop) {
      return null;
    }

    return await cropToCanvas(imgRef.current, crop);
  };

  const handleClose = () => {
    setCrop(initialCrop);
    onClose();
  };

  const onSubmit = async () => {
    onCrop(await applyCrop(src));
    handleClose();
  };

  return (
    <Modal isOpen={isOpened} onClose={handleClose}>
      <div className="mb-4 flex w-full justify-center">
        <ReactCrop
          crop={crop}
          onChange={setCrop}
          aspect={aspect}
          minHeight={minHeight}
          minWidth={minWidth}
          circularCrop={rounded}
        >
          <img
            src={src}
            alt={translation("cropPreviewAlt")!}
            ref={imgRef}
            crossOrigin="anonymous"
          />
        </ReactCrop>
      </div>

      <Button className="mx-auto w-full" onClick={onSubmit}>
        {translation("crop")}
      </Button>
    </Modal>
  );
};

export default CropModal;
