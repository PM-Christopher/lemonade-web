"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, FieldError, Input, Label } from "@lemonade/ui";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@lemonade/validation";
import { SubmitButton } from "@/components/global/SubmitButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useForgotPasswordMutation } from "@/features/authentication/mutations";
import { useNavigation } from "@/hooks/useNavigation";
import { errorMessage } from "@/lib/api-error";
import { apiMessage } from "@/lib/api-message";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

function ForgotPasswordClient() {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const forgotMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    forgotMutation.mutate(values, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("A verification code has been sent to your email"),
            type: "success",
          }),
        );
        push(routes.VERIFY_CODE);
      },
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't send the code. Please try again."),
            type: "error",
          }),
        ),
    });
  };

  return (
    <AuthLayout>
      <section className="bg-light-grey h-full min-h-screen overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <Image src={images.LOGO} alt="logo" width={127} height={56} />
          </div>
        </div>
        <div className="tablet:flex-row tablet:items-start tablet:px-4 mt-24 flex flex-col items-center justify-center gap-16">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="tablet:w-120 w-full rounded-2xl border-none p-6 shadow-sm">
              <CardContent className="tablet:gap-10 grid gap-6">
                <div>
                  <p className="font-ruso text-title-l leading-normal font-normal">
                    Forgot password
                  </p>
                  <p className="text-text-grey text-body-s font-normal">
                    Enter your email address and we will send you a code to reset your password.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janedoe@example.com"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                <SubmitButton
                  loading={forgotMutation.isPending}
                  title="Send code"
                  isValid={isValid}
                  classes="w-full h-12 rounded-xl"
                />
                <Link
                  href={routes.LOGIN}
                  className="text-light-green text-body-l text-center font-medium underline"
                >
                  Back to login
                </Link>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
}

export default ForgotPasswordClient;
