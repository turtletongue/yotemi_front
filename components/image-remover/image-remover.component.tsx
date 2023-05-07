"use client";

import { ReactNode } from "react";
import { Trash } from "react-feather";
import classnames from "classnames";

import { selectAccessToken } from "@store/features/auth";
import { useAppSelector } from "@store/store-config/hooks";
import useFileRemover from "@hooks/use-file-remover";

interface ImageRemoverProps {
  className?: string;
  route?: string;
  onRemoved?: () => unknown;
  active?: boolean;
  children: ReactNode;
}

const ImageRemover = ({
  className,
  route,
  onRemoved,
  active = true,
  children,
}: ImageRemoverProps) => {
  const accessToken = useAppSelector(selectAccessToken);

  const { isLoading, onRemove } = useFileRemover({
    route,
    onRemoved,
    accessToken: accessToken ?? "",
  });

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      className={`${classnames(
        !isLoading && "group"
      )} cursor-pointer relative flex justify-center items-center ${className}`}
      onClick={onRemove}
    >
      <div className="group-hover:opacity-70 bg-black !rounded-full">
        {children}
      </div>
      <Trash size={30} className="absolute hidden group-hover:block" />
    </div>
  );
};

export default ImageRemover;
