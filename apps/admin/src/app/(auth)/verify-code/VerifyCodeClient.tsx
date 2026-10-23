"use client";
import React, { useState, useSyncExternalStore } from "react";
import { BrandLogo } from "@/components/global/BrandLogo";
import OtpInput from "react-otp-input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@lemonade/ui";
import { otpSchema, type OtpCodeInput } from "@lemonade/validation";
import { SubmitButton } from "@/components/global/SubmitButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import {
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
} from "@/features/authentication/mutations";
import { useNavigation } from "@/hooks/useNavigation";
import { errorMessage } from "@/lib/api-error";
import { apiMessage } from "@/lib/api-message";
import { routes } from "@/lib/routes";
import { RESET_EMAIL_KEY } from "@/lib/reset-email";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

const RESEND_SECONDS = 60;

const noSubscription = () => () => {};
const readEmail = () => {
  try {
    return sessionStorage.getItem(RESET_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
};

function VerifyCodeClient() {
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const verifyMutation = useVerifyResetCodeMutation();
  const resendMutation = useForgotPasswordMutation();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const email = useSyncExternalStore(noSubscription, readEmail, () => "");

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<OtpCodeInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
    mode: "onChange",
  });

  const toast = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  // Counts down once a second until the code can be sent again.
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const onSubmit = (values: OtpCodeInput) => {
    verifyMutation.mutate(values.code, {
      onSuccess: () => push(routes.RESET_PASSWORD),
      onError: (error) => {
        toast(errorMessage(error, "That code didn't work. Please try again."), "error");
        reset();
      },
    });
  };

  const resend = () => {
    resendMutation.mutate(
      {},
      {
        onSuccess: () => {
          toast(apiMessage("A new code has been sent"), "success");
          setSecondsLeft(RESEND_SECONDS);
        },
        onError: (error) => toast(errorMessage(error, "Couldn't send a new code."), "error"),
      },
    );
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
                    Verification Code
                  </p>
                  <p className="text-text-grey text-body-s font-normal">
                    Enter the 4-digit code sent {email ? <strong>{email}</strong> : "to your email"}{" "}
                    to reset your password.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Controller
                    control={control}
                    name="code"
                    render={({ field }) => (
                      <OtpInput
                        value={field.value}
                        onChange={field.onChange}
                        numInputs={4}
                        inputType="tel"
                        renderSeparator={<span> </span>}
                        renderInput={(props) => <input {...props} aria-label="Verification code" />}
                        containerStyle="gap-2"
                        inputStyle={{
                          width: "48px",
                          height: "48px",
                          background: "#F9FAFA",
                          borderRadius: "12px",
                        }}
                      />
                    )}
                  />
                </div>
                {secondsLeft > 0 ? (
                  <p className="text-light-green text-body-l text-center font-medium">
                    Resend code in {secondsLeft} secs
                  </p>
                ) : (
                  <button
                    type="button"
                    className="text-light-green text-body-l text-center font-medium underline"
                    onClick={resend}
                    disabled={resendMutation.isPending}
                  >
                    Resend code
                  </button>
                )}
                <SubmitButton
                  loading={verifyMutation.isPending}
                  title="Verify"
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

export default VerifyCodeClient;
