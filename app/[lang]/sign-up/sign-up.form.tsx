"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox, Label, TextInput } from "flowbite-react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { toast } from "react-toastify";
import * as yup from "yup";

import { Button, TextLink } from "@components";
import { Language, useTranslation } from "@app/i18n/client";

interface SignUpFormProps {
  lang: Language;
}

interface SignUpSchema {
  firstName: string;
  lastName: string;
  agreed: boolean;
}

const signUpSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  agreed: yup.boolean().isTrue().required(),
});

const SignUpForm = ({ lang }: SignUpFormProps) => {
  const { translation } = useTranslation(lang, "sign-up");
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

  const firstNameProps = register("firstName");
  const lastNameProps = register("lastName");
  const agreedProps = register("agreed");

  /* Submit handler */

  const signUp = async (data: SignUpSchema) => {
    if (!tonConnectUI.account) {
      try {
        await tonConnectUI.connectWallet();
      } catch {
        toast.error(translation("walletConnectionError"));
      }
    }

    const address = tonConnectUI.account?.address as string;

    console.log(address);
  };

  return (
    <form
      className="sm:mx-36 w-64 bg-white flex flex-col items-center"
      onSubmit={handleSubmit(signUp)}
    >
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
      <Button className="w-full h-12 mt-6" animated disabled={!isValid}>
        {translation("submit")}
      </Button>
    </form>
  );
};

export default SignUpForm;
