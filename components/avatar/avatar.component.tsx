import Image from "next/image";

interface IAvatarProps {
  imageUrl: string;
  alt: string;
  width?: number;
  height?: number;
}

const Avatar = ({ imageUrl, alt, width = 27, height = 27 }: IAvatarProps) => {
  return (
    <Image
      width={width}
      height={height}
      src={imageUrl}
      alt={alt}
      className="rounded-full bg-white border border-gray-300"
    />
  );
};

export default Avatar;
