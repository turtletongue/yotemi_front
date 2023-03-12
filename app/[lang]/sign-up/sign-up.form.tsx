"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox, Label, TextInput } from "flowbite-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import * as yup from "yup";

import { Button, ErrorDialog, ErrorNotification, TextLink } from "@components";
import { Language, useTranslation } from "@app/i18n/client";
import { useAddUserMutation } from "@redux/features/users";
import { errorNameToError, extractErrorNotification } from "@utils";
import signUpErrors from "./sign-up.errors";

interface SignUpFormProps {
  lang: Language;
}

interface SignUpSchema {
  username: string;
  firstName: string;
  lastName: string;
  agreed: boolean;
}

const signUpSchema = yup.object().shape({
  username: yup.string().min(3).required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  agreed: yup.boolean().isTrue().required(),
});

const SignUpForm = ({ lang }: SignUpFormProps) => {
  const router = useRouter();
  const { translation } = useTranslation(lang, "sign-up");

  /* TON connection */

  const [tonConnectUI] = useTonConnectUI();

  /* Form initialization */

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<SignUpSchema>({
    mode: "onChange",
    resolver: yupResolver(signUpSchema),
  });

  const usernameProps = register("username");
  const firstNameProps = register("firstName");
  const lastNameProps = register("lastName");
  const agreedProps = register("agreed");

  const [dialogError, setDialogError] = useState<ErrorNotification | null>(
    null
  );

  /* Submit handler */

  const [addUser, { error, isLoading, isSuccess }] = useAddUserMutation();

  const signUp = async ({ username, firstName, lastName }: SignUpSchema) => {
    if (!tonConnectUI.account) {
      try {
        await tonConnectUI.connectWallet();
      } catch {
        return setDialogError(
          errorNameToError("walletConnectionError", translation)
        );
      }
    }

    const address = tonConnectUI.account?.address;

    if (!address) {
      return;
    }

    addUser({
      username,
      accountAddress: address,
      firstName,
      lastName,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      setDialogError(
        extractErrorNotification(error, signUpErrors, translation)
      );

      tonConnectUI.disconnect();
    }
  }, [tonConnectUI, error]);

  return (
    <>
      <form
        className="sm:mx-36 w-64 bg-white flex flex-col items-center"
        onSubmit={handleSubmit(signUp)}
      >
        <div className="w-full mb-4">
          <Label htmlFor="username">
            <span className="font-bold">{translation("username")}</span>
          </Label>
          <TextInput
            color={errors.username ? "failure" : "gray"}
            helperText={errors.username ? translation("usernameError") : ""}
            {...usernameProps}
          />
        </div>
        <div className="w-full mb-4">
          <Label htmlFor="firstName">
            <span className="font-bold">{translation("firstName")}</span>
          </Label>
          <TextInput
            color={errors.firstName ? "failure" : "gray"}
            helperText={errors.firstName ? translation("firstNameError") : ""}
            {...firstNameProps}
          />
        </div>
        <div className="w-full">
          <Label htmlFor="lastName">
            <span className="font-bold">{translation("lastName")}</span>
          </Label>
          <TextInput
            color={errors.lastName ? "failure" : "gray"}
            helperText={errors.lastName ? translation("lastNameError") : ""}
            {...lastNameProps}
          />
        </div>
        <div className="w-full mt-3 flex items-center gap-2">
          <Checkbox id="agree" className="text-purple-600" {...agreedProps} />
          <Label htmlFor="agree">
            <span className="font-normal text-gray-400">
              {translation("agree")}{" "}
              <TextLink href="/">{translation("rules")}</TextLink>
            </span>
          </Label>
        </div>
        <Button
          className="w-full h-12 mt-6"
          animated
          disabled={!isValid || isLoading}
        >
          {translation("submit")}
        </Button>
      </form>
      <ErrorDialog
        error={dialogError}
        onClose={() => setDialogError(null)}
        lang={lang}
      />
    </>
  );
};

export default SignUpForm;
