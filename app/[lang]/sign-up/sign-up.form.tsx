"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@components";
import { Language, useTranslation } from "@app/i18n/client";
import { Label, TextInput } from "flowbite-react";

interface SignUpFormProps {
  lang: Language;
}

interface SignUpSchema {
  firstName: string;
  lastName: string;
}

const signUpSchema = {
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(2).required(),
};

const SignUpForm = ({ lang }: SignUpFormProps) => {
  const { translation } = useTranslation(lang, "sign-up");

  /* Form initialization */

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignUpSchema>({
    mode: "onChange",
    resolver: yupResolver(signUpSchema),
  });

  const firstNameProps = register("firstName");
  const lastNameProps = register("lastName");

  /* Submit handler */

  const signUp = (data: SignUpSchema) => {
    console.log(data);
  };

  return (
    <form className="py-10 bg-white" onSubmit={handleSubmit(signUp)}>
      <div>
        <Label htmlFor="firstName">{translation("firstName")}</Label>
        <TextInput {...firstNameProps} />
      </div>
      <div>
        <Label htmlFor="lastName">{translation("lastName")}</Label>
        <TextInput {...lastNameProps} />
      </div>
      <Button>{translation("submit")}</Button>
    </form>
  );
};

export default SignUpForm;
