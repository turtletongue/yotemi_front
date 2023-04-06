import { useState } from "react";
import { AxiosError, AxiosRequestConfig } from "axios";

import { axiosInstance } from "@utils";

interface FileUploaderParams {
  route?: string;
  onUploaded?: () => unknown;
  accessToken: string;
}

const useFileUploader = ({
  route = "/uploads",
  onUploaded,
  accessToken,
}: FileUploaderParams) => {
  const url = process.env.NEXT_PUBLIC_API_URL + route;

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onUpload = async (file: File | null) => {
    setError(null);
    setIsSuccess(false);

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const config: AxiosRequestConfig = {
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total ?? progressEvent.loaded;

        setProgress(Math.round((progressEvent.loaded / total) * 100));
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    setIsLoading(true);

    try {
      await axiosInstance.post(url, formData, config);

      setIsSuccess(true);
    } catch (error: unknown) {
      if (!(error instanceof AxiosError)) {
        throw error;
      }

      setError(error);
      setProgress(0);
    } finally {
      onUploaded?.();
      setIsLoading(false);
    }
  };

  return {
    progress,
    isLoading,
    isSuccess,
    resetSuccess: () => setIsSuccess(false),
    error,
    resetError: () => setError(null),
    onUpload,
  };
};

export default useFileUploader;
