import { useState } from "react";
import { AxiosError, AxiosRequestConfig } from "axios";

import { axiosInstance } from "@utils";

interface FileRemoverParams {
  route?: string;
  onRemoved?: () => unknown;
  accessToken: string;
}

const useFileRemover = ({
  route = "/uploads",
  onRemoved,
  accessToken,
}: FileRemoverParams) => {
  const url = process.env.NEXT_PUBLIC_API_URL + route;

  const [isLoading, setIsLoading] = useState(false);

  const onRemove = async () => {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    setIsLoading(true);

    try {
      await axiosInstance.post(url, { file: null }, config);
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) {
        throw error;
      }
    } finally {
      onRemoved?.();
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onRemove,
  };
};

export default useFileRemover;
