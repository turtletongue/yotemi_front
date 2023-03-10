"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

interface ToastProviderProps {
  children?: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <>
      {children}
      <ToastContainer newestOnTop position="bottom-right" />
    </>
  );
};

export default ToastProvider;
