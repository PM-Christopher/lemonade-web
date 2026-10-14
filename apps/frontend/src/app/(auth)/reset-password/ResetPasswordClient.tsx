"use client";
import React from "react";
import { Card, CardContent, Button, Input, Label } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useResetPasswordMutation } from "@/features/authentication/mutations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@lemonade/validation";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";
import { errorMessage } from "@/lib/api-error";
import { applyServerErrors } from "@/lib/form-errors";
import { FieldError } from "@/components/global/FieldError";

export default function ResetPasswordPage() {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const resetPasswordMutation = useResetPasswordMutation();
  const loading = resetPasswordMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: ResetPasswordInput) => {
    resetPasswordMutation.mutate(
      { password: values.password, confirm_password: values.confirm_password },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Password reset successfully",
              type: "success",
            }),
          );
          push(routes.LOGIN);
        },
        onError: (error) => {
          // Field problems show under the field; anything else as a toast.
          if (applyServerErrors(error, setError, ["password", "confirm_password"])) return;
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "Something went wrong. Please try again."),
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-fit max-w-full items-start justify-center gap-10"
      >
        <div className="tablet:flex hidden w-[400px] shrink-0 flex-col">
          <p className="font-ruso text-display-s font-bold">Reset password</p>
          <p className="text-body-xl text-text-grey mt-2 max-w-[26rem] font-sans font-normal">
            Stronger password, stronger protection! Combine uppercase, lowercase, numbers, and
            symbols to protect your account.
          </p>
          <Image
            src={images.RESET_PASSWORD}
            alt=""
            width={511}
            height={520}
            className="mt-4 h-auto w-full object-contain"
          />
        </div>
        <Card className="tablet:p-6 w-full max-w-[440px] shrink-0 rounded-2xl border-none p-5 shadow-none">
          <CardContent className="grid gap-4 p-0">
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-label">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="form-font bg-light_grey h-12 rounded-xl border-0"
                {...register("password")}
              />
              <span className="text-grey-40 font-sans text-[12px]">
                Password must be at least 8 character long
              </span>
              <FieldError message={errors.password?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password" className="font-label">
                Confirm password
              </Label>
              <Input
                id="confirm_password"
                type="password"
                className="form-font bg-light_grey h-12 rounded-xl border-0"
                {...register("confirm_password")}
              />
              <FieldError message={errors.confirm_password?.message} />
            </div>
            <Button
              type="submit"
              disabled={loading || !isValid || !isDirty}
              aria-busy={loading}
              aria-disabled={loading || !isValid}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${
                loading || !isValid
                  ? "cursor-not-allowed bg-green-700 opacity-90"
                  : "bg-gradient-green hover:brightness-110 active:scale-[0.98]"
              } `}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save password"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </AuthLayout>
  );
}
