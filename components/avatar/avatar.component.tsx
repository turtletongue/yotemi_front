"use client";

import { Avatar, AvatarProps } from "flowbite-react";

interface CustomAvatarProps extends Omit<AvatarProps, "img"> {
  img?: string | null;
}

const CustomAvatar = ({ img, ...props }: CustomAvatarProps) => {
  return <Avatar img={img ?? undefined} {...props} />;
};

export default CustomAvatar;
