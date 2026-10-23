"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@lemonade/validation";
import { BrandLogo } from "@/components/global/BrandLogo";
import { Card, CardContent, Label, Input, FieldError } from "@lemonade/ui";
import { SubmitButton } from "@/components/global/SubmitButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import { routes } from "@/lib/routes";
import { useResetPasswordMutation } from "@/features/authentication/mutations";
import { useNavigation } from "@/hooks/useNavigation";
import { errorMessage } from "@/lib/api-error";
import { apiMessage } from "@/lib/api-message";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

function ResetPasswordPage({}) {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const resetMutation = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: ResetPasswordInput) => {
    resetMutation.mutate(values.password, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage("Password updated. Log in with your new password."),
            type: "success",
          }),
        );
        push(routes.LOGIN);
      },
      onError: (error) =>
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(error, "Couldn't update your password. Please try again."),
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
            <BrandLogo />
          </div>
        </div>
        <div className="tablet:flex-row tablet:items-start tablet:px-4 mt-24 flex flex-col items-center justify-center gap-16">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="tablet:w-120 w-full rounded-2xl border-none p-6 shadow-sm">
              <CardContent className="tablet:gap-10 grid gap-6">
                <div>
                  <p className="font-ruso text-title-l leading-normal font-normal">
                    Reset Password
                  </p>
                  <p className="text-text-grey text-body-s font-normal">
                    Stronger password, stronger protection! Combine uppercase, lowercase, numbers,
                    and symbols to protect your account.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("password")}
                  />
                  <FieldError message={errors.password?.message} />
                  <p className={"text-grey-40 text-meta leading-normal font-normal"}>
                    Password must be at least 8 character long
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="confirm_password"
                    className="text-text-grey text-body-s font-sans font-normal"
                  >
                    Confirm password
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    {...register("confirm_password")}
                  />
                  <FieldError message={errors.confirm_password?.message} />
                </div>
                <SubmitButton
                  loading={resetMutation.isPending}
                  title="Save password"
                  isValid={isValid}
                  classes="w-full h-12 rounded-xl"
                />
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
