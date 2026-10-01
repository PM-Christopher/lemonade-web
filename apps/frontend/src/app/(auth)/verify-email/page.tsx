"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@lemonade/ui";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { useFormik } from "formik";
import { otpSchema } from "@lemonade/validation";
import { FormikButton } from "@/components/global/FormikButton";
import {
  useResendOtpMutation,
  useVerifyAccountOtpMutation,
} from "@/features/authentication/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import type { VerifyOtpPayload } from "@/features/authentication/api";

export default function VerifyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const resendOtpMutation = useResendOtpMutation();
  const verifyAccountOtpMutation = useVerifyAccountOtpMutation();
  const COUNTDOWN_DURATION = Number(process.env.NEXT_PUBLIC_COUNTDOWN_DURATION) || 60;
  const STORAGE_KEY = process.env.NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY || "otp_timer_start";

  const [seconds, setSeconds] = useState<number>(COUNTDOWN_DURATION);
  const [canResend, setCanResend] = useState<boolean>(false);

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

  const handleResend = () => {
    formik.setFieldValue("code", null);
    resendOtpMutation.mutate(undefined, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `A new code has been sent to ${user?.email}. Please try again`,
            type: "success",
          }),
        );
        const newStartTime = Date.now();
        localStorage.setItem(STORAGE_KEY, newStartTime.toString());
        setSeconds(COUNTDOWN_DURATION);
        setCanResend(false);
      },
      onError: (error: { message?: string }) => {
        setCanResend(true);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message,
            type: "error",
          }),
        );
      },
    });
  };

  //form validation
  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: otpSchema,
    validateOnMount: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      await verifyOtp(values);
    },
  });

  const [, setOtp] = useState(formik.values.code);

  const verifyOtp = (values: VerifyOtpPayload) => {
    verifyAccountOtpMutation.mutate(values, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Email verified",
            type: "success",
          }),
        );
        formik.resetForm();
        router.push("/profile-setup");
      },
      onError: () => {
        setCanResend(true);
        formik.setFieldError("code", "Invalid code");
      },
    });
  };
  const invalidCode = Boolean(formik.errors.code);

  return (
    <AuthLayout>
      <div className="flex h-full w-full max-w-[1100px] items-center justify-center gap-10">
        <div className="tablet:flex hidden min-w-0 flex-col">
          <p className="font-ruso text-display-s font-bold">Verify email address</p>
          <p className="text-body-xl text-text-grey mt-2 max-w-[26rem] font-sans font-normal">
            Enter the 4-digit code sent{" "}
            <span className="text-primary-black font-semibold">{user?.email}</span> to verify your
            account
          </p>
          <Image
            src="/images/verification.png"
            alt=""
            width={320}
            height={258}
            className="mt-6 h-auto max-h-[36vh] w-auto object-contain"
          />
        </div>
        <div className="flex h-full min-h-0 w-full max-w-[440px] flex-col justify-center">
          <div className="tablet:hidden mb-4 text-center">
            <p className="font-ruso text-title-xl font-bold">Verify email address</p>
            <p className="text-body-l text-text-grey mt-2 font-sans font-normal">
              Enter the 4-digit code sent{" "}
              <span className="text-primary-black font-semibold">{user?.email}</span> to verify your
              account
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <Card className="w-full rounded-2xl border-none p-6 shadow-none">
              <CardContent className="grid gap-6">
                <div className="flex flex-col items-center">
                  <OtpInput
                    value={formik.values.code || ""}
                    onChange={(value) => {
                      setOtp(value);
                      formik.setFieldValue("code", value, false);
                      if (formik.errors.code) formik.setFieldError("code", undefined);
                    }}
                    numInputs={4}
                    renderSeparator={<span className="w-3" />}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "12px",
                          border: invalidCode ? "1px solid #E24B4B" : "1px solid transparent",
                          backgroundColor: invalidCode ? "#fff" : "#F3F4F6",
                          color: invalidCode ? "#E24B4B" : "#111827",
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: 500,
                          outline: "none",
                        }}
                      />
                    )}
                    containerStyle={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                  {invalidCode ? (
                    <p className="text-meta mt-3 flex items-center gap-1 text-[#E24B4B]">
                      <span
                        aria-hidden
                        className="inline-block h-3.5 w-3.5 rounded-full border border-[#E24B4B] text-center text-[10px] leading-[12px]"
                      >
                        !
                      </span>
                      Invalid code
                    </p>
                  ) : null}
                </div>
                <div className="flex justify-center">
                  {canResend ? (
                    <button
                      type="button"
                      className="text-light-green text-body-s cursor-pointer font-sans font-semibold"
                      onClick={handleResend}
                    >
                      Resend code
                    </button>
                  ) : (
                    <p className="text-light-green text-body-s font-sans font-semibold">
                      Resend code in {seconds} secs
                    </p>
                  )}
                </div>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Verify"
                  error={(formik.values.code?.length ?? 0) === 4 && !invalidCode}
                  classes="w-full h-12 rounded-xl"
                />
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
