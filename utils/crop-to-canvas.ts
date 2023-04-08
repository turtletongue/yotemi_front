import { Crop } from "react-image-crop";

export const cropToCanvas = async (
  imageElement: HTMLImageElement,
  crop: Crop
): Promise<File | null> => {
  if (!crop) {
    return null;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  const scaleX = imageElement.naturalWidth / imageElement.width;
  const scaleY = imageElement.naturalHeight / imageElement.height;

  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  context.scale(pixelRatio, pixelRatio);

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  context.save();

  context.translate(-cropX, -cropY);

  context.drawImage(
    imageElement,
    0,
    0,
    imageElement.naturalWidth,
    imageElement.naturalHeight,
    0,
    0,
    imageElement.naturalWidth,
    imageElement.naturalHeight
  );

  return new Promise((res, rej) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return rej();
      }

      res(new File([blob], "crop.png", { type: "image/png" }));
    }, "image/png");
  });
};

export default cropToCanvas;
