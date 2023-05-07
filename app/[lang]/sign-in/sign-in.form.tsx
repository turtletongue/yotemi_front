"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Label, TextInput } from "flowbite-react";
import * as yup from "yup";

import { ErrorDialog, ErrorNotification, GradientButton } from "@components";
import { Language, useTranslation } from "@app/i18n/client";
import { changeTargetUsername, useLoginMutation } from "@store/features/auth";
import { usersApi } from "@store/features/users";
import { useAppDispatch } from "@store/store-config/hooks";
import { errorNameToError, extractErrorNotification } from "@utils";
import signInErrors from "./sign-in.errors";

interface SignInFormProps {
  lang: Language;
}

interface SignInSchema {
  username: string;
}

const signInSchema = yup.object().shape({
  username: yup.string().required(),
});

const SignInForm = ({ lang }: SignInFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { translation } = useTranslation(lang, "sign-in");

  /* TON connection */

  const [tonConnectUI] = useTonConnectUI();

  /* Form initialization */

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<SignInSchema>({
    mode: "onChange",
    resolver: yupResolver(signInSchema),
  });

  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

  useEffect(() => {
    const subscription = watch(({ username }) => {
      dispatch(changeTargetUsername(username ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch, watch]);

  /* Submit handler */

  const [login, { error, isLoading, isSuccess }] = useLoginMutation();

  const signIn = async () => {
    try {
      if (tonConnectUI.wallet) {
        await tonConnectUI.disconnect();
        await tonConnectUI.connectWallet();
      } else {
        await tonConnectUI.connectWallet();
      }

      const wallet = tonConnectUI.wallet;

      if (!wallet) {
        return;
      }

      const tonProof = wallet.connectItems?.tonProof;

      if (!tonProof || !("proof" in tonProof)) {
        return setDialogError(
          errorNameToError("userNotFoundError", translation)
        );
      }

      login({
        accountAddress: wallet.account.address,
        signature: tonProof.proof,
      });
    } catch {
      return setDialogError(
        errorNameToError("walletConnectionError", translation)
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        usersApi.util.invalidateTags([{ type: "Users", id: "PARTIAL-LIST" }])
      );
      router.push("/");
      dispatch(changeTargetUsername(null));
    }
  }, [dispatch, router, translation, tonConnectUI, isSuccess]);

  useEffect(() => {
    if (error) {
      setDialogError(
        extractErrorNotification(error, signInErrors, translation)
      );

      tonConnectUI.disconnect();
    }
  }, [translation, tonConnectUI, error]);

  return (
    <>
      <form
        className="sm:mx-36 w-64 bg-white flex flex-col items-center"
        onSubmit={handleSubmit(signIn)}
      >
        <div className="w-full mb-4">
          <Label htmlFor="username">
            <span className="font-bold">{translation("username")}</span>
          </Label>
          <TextInput
            color={errors.username ? "failure" : "gray"}
            helperText={errors.username ? translation("usernameError") : ""}
            {...register("username")}
          />
        </div>
        <GradientButton
          className="w-full h-12 mt-2"
          animated
          disabled={!isValid || isLoading}
        >
          {translation("submit")}
        </GradientButton>
      </form>
      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
    </>
  );
};

export default SignInForm;
