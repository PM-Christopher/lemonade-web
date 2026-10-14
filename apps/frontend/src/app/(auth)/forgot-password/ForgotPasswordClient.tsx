"use client";
import React from "react";
import { Card, CardContent, Button, Input, Label } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "@/redux/hook";
import { useForgotPasswordMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@lemonade/validation";
import { images } from "@/lib/images";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import { errorMessage } from "@/lib/api-error";
import { applyServerErrors } from "@/lib/form-errors";
import { FieldError } from "@/components/global/FieldError";

export default function ForgotPasswordPage() {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const [, setCookie] = useCookies(["newToken", "email"]);
  const forgotPasswordMutation = useForgotPasswordMutation();
  const loading = forgotPasswordMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    forgotPasswordMutation.mutate(
      { email: values.email },
      {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Please check your inbox and click on verification link.",
              type: "success",
            }),
          );
          setCookie("newToken", result.token, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
          });
          setCookie("email", result.email, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
          });
          push(routes.VERIFY_CODE);
        },
        onError: (error) => {
          // Field problems show under the field; anything else as a toast.
          if (applyServerErrors(error, setError, ["email"])) return;
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
          <p className="font-ruso text-display-s font-bold">Forgot Password</p>
          <p className="text-body-xl text-text-grey mt-2 max-w-[26rem] font-sans font-normal">
            Enter your email address and a 4-digit code will be sent to reset your password.
          </p>
          <Image
            src={images.FORGOT_PASSWORD}
            alt=""
            width={511}
            height={520}
            className="mt-4 h-auto w-full object-contain"
          />
        </div>
        <Card className="tablet:p-6 w-full max-w-[440px] shrink-0 rounded-2xl border-none p-5 shadow-none">
          <CardContent className="grid gap-4 p-0">
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-label">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. Janedoe@example.com"
                className="form-font bg-light_grey h-12 rounded-xl border-0"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${
                loading
                  ? "cursor-not-allowed bg-green-700 opacity-90"
                  : "bg-gradient-green hover:brightness-110 active:scale-[0.98]"
              } `}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                "Send Code"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </AuthLayout>
  );
}
