"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@lemonade/ui";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import OtpInput from "react-otp-input";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpCodeInput } from "@lemonade/validation";
import { FieldError } from "@/components/global/FieldError";
import {
  useForgotPasswordMutation,
  useVerifyPasswordResetOtpMutation,
} from "@/features/authentication/mutations";
import { errorMessage } from "@/lib/api-error";
import { ONBOARDING_TOKEN_COOKIE } from "@/lib/cookie-names";
import { ApiError } from "@lemonade/api-client";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { setIsRouting } from "@/redux/tempSlice";
import { SubmitButton } from "@/components/global/SubmitButton";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";

export default function VerifyCodePage() {
  const COUNTDOWN_DURATION = Number(process.env.NEXT_PUBLIC_COUNTDOWN_DURATION) || 60;
  const STORAGE_KEY = process.env.NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY || "otp_timer_start";
  const { push } = useNavigation();
  const dispatch = useAppDispatch();
  const [cookie, setCookie] = useCookies(["newToken", "email"]);
  const [seconds, setSeconds] = useState<number>(COUNTDOWN_DURATION);
  const [canResend, setCanResend] = useState<boolean>(false);
  const forgotPasswordMutation = useForgotPasswordMutation();
  const verifyPasswordResetOtpMutation = useVerifyPasswordResetOtpMutation();
  const isVerifying = verifyPasswordResetOtpMutation.isPending;

  useEffect(() => {
    const frame = window.setTimeout(() => {
      const savedStartTime = localStorage.getItem(STORAGE_KEY);

      if (savedStartTime) {
        const elapsed = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
        const remaining = COUNTDOWN_DURATION - elapsed;

        if (remaining > 0) {
          setSeconds(remaining);
          setCanResend(false);
        } else {
          setSeconds(0);
          setCanResend(true);
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setSeconds(COUNTDOWN_DURATION);
        setCanResend(false);
      }
    }, 0);
    return () => window.clearTimeout(frame);
  }, [COUNTDOWN_DURATION, STORAGE_KEY]);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            localStorage.removeItem(STORAGE_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [seconds, STORAGE_KEY]);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OtpCodeInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
    mode: "onChange",
  });
  const code = useWatch({ control, name: "code" });

  const handleResend = () => {
    setValue("code", "");
    // A new reset request sends a fresh code and a fresh reset session.
    forgotPasswordMutation.mutate(
      { email: cookie.email },
      {
        onSuccess: (result) => {
          setCookie(ONBOARDING_TOKEN_COOKIE, result.token, {
            path: "/",
            maxAge: 3600 * 6,
            sameSite: "lax",
          });
          dispatch(
            updateToastifyReducer({
              show: true,
              message: `A new code has been sent to ${result.email}. Please try again`,
              type: "success",
            }),
          );
          const newStartTime = Date.now();
          localStorage.setItem(STORAGE_KEY, newStartTime.toString());
          setSeconds(COUNTDOWN_DURATION);
          setCanResend(false);
        },
        onError: (error) => {
          setCanResend(true);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "We couldn't send a new code. Please try again."),
              type: "error",
            }),
          );
        },
      },
    );
  };

  const onSubmit = async (values: OtpCodeInput) => {
    try {
      // check-otp swaps the verification token for a password_reset token.
      const result = await verifyPasswordResetOtpMutation.mutateAsync(values);
      setCookie("newToken", result.token, {
        path: "/",
        maxAge: 3600 * 6,
        sameSite: false,
      });
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Email verified",
          type: "success",
        }),
      );
      dispatch(setIsRouting(true));
      push(routes.RESET_PASSWORD);
    } catch (error) {
      setCanResend(true);
      setValue("code", "");
      dispatch(
        updateToastifyReducer({
          show: true,
          message: error instanceof ApiError ? error.message : "Invalid code",
          type: "error",
        }),
      );
    }
  };

  return (
    <AuthLayout>
      <div className="mx-auto flex w-fit max-w-full items-start justify-center gap-10">
        <div className="tablet:flex hidden w-[400px] shrink-0 flex-col">
          <p className="font-ruso text-display-s font-bold">Verification code</p>
          <p className="text-body-xl text-text-grey mt-2 max-w-[26rem] font-sans font-normal">
            Enter the 4-digit code sent to {cookie.email} to verify your account
          </p>
          <Image
            src={images.VERIFICATION}
            alt=""
            width={320}
            height={258}
            className="mt-4 h-auto w-full object-contain"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[440px] shrink-0">
          <Card className="tablet:p-6 w-full rounded-2xl border-none p-5 shadow-none">
            <CardContent className="grid gap-6 p-0">
              <div className="flex flex-col items-center justify-center">
                <OtpInput
                  value={code}
                  onChange={(value) => {
                    setValue("code", value, { shouldValidate: true });
                    // A full code submits itself.
                    if (value.length === 4) {
                      setTimeout(() => {
                        void handleSubmit(onSubmit)();
                      }, 0);
                    }
                  }}
                  numInputs={4}
                  renderSeparator={<span style={{ width: "12px" }}></span>}
                  renderInput={(props) => (
                    <div
                      style={{
                        borderRadius: "12px",
                        padding: "2px",
                        background: "linear-gradient(90deg, #9BE303, #7FBB00)",
                      }}
                    >
                      <input
                        {...props}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "10px",
                          border: "none",
                          backgroundColor: "#E5E7EB",
                          color: "#111827",
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: 500,
                          outline: "none",
                        }}
                      />
                    </div>
                  )}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                  }}
                />
                <FieldError message={errors.code?.message} />
              </div>
              <div className="flex justify-center">
                {canResend ? (
                  <button
                    type="button"
                    className="font-semi-normal text-light-green cursor-pointer font-sans text-[16px]"
                    onClick={handleResend}
                  >
                    Send code again
                  </button>
                ) : (
                  <p className="font-semi-normal text-light-green font-sans text-[16px]">
                    Resend code in {seconds} secs
                  </p>
                )}
              </div>
              <SubmitButton
                loading={isSubmitting || isVerifying}
                title="Verify"
                isValid={isValid && !isVerifying}
                classes="w-full h-12 rounded-xl"
              />
            </CardContent>
          </Card>
        </form>
      </div>
    </AuthLayout>
  );
}
