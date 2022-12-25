"use client";

import Image from "next/image";

interface IAvatarProps {
  imageUrl: string;
  alt: string;
  width?: number;
  height?: number;
}

const Avatar = ({ imageUrl, alt, width = 29, height = 29 }: IAvatarProps) => {
  return (
    <Image
      width={width}
      height={height}
      src={imageUrl}
      alt={alt}
      className="rounded-full bg-white"
    />
  );
};

export default Avatar;
