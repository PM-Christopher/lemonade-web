"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Button } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import OtpInput from "react-otp-input";
import { checkError } from "@lemonade/domain";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { otpSchema } from "@lemonade/validation";
import {
  useResendOtpMutation,
  useVerifyPasswordResetOtpMutation,
} from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { FormikButton } from "@/components/global/FormikButton";

export default function VerifyCodePage() {
  const COUNTDOWN_DURATION = Number(process.env.NEXT_PUBLIC_COUNTDOWN_DURATION) || 60;
  const STORAGE_KEY = process.env.NEXT_PUBLIC_COUNTDOWN_STORAGE_KEY || "otp_timer_start";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookie, setCookie] = useCookies(["newToken", "email"]);
  const { user } = useSelector((state: any) => state.auth);
  const [seconds, setSeconds] = useState<number>(COUNTDOWN_DURATION);
  const [canResend, setCanResend] = useState<boolean>(false);
  const resendOtpMutation = useResendOtpMutation();
  const verifyPasswordResetOtpMutation = useVerifyPasswordResetOtpMutation();

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
      onError: (error: any) => {
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

  const [otp, setOtp] = useState(formik.values.code);

  const verifyOtp = (values: any) => {
    verifyPasswordResetOtpMutation.mutate(values, {
      onSuccess: (result) => {
        // check-otp deletes the forgot-password token it was called
        // with and issues a new, differently-scoped one (ability
        // "password_reset", not "password_reset_verification") —
        // reset-password only accepts that new token. Confirmed
        // live: calling reset-password with the old cookie value
        // 403s "Invalid Token" even though check-otp itself
        // succeeded.
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
        formik.resetForm();
        router.push("/reset-password");
      },
      onError: (error: any) => {
        setCanResend(true);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message,
            type: "error",
          }),
        );
        formik.setFieldValue("code", null);
      },
    });
  };

  return (
    <AuthLayout>
      <div className="flex h-full w-full max-w-[1100px] items-center justify-center gap-10">
        <div className="hidden min-w-0 flex-col tablet:flex">
          <div>
            <p className="font-ruso text-display-s font-bold">Verification code</p>
            <p className="text-body-xl mt-2 max-w-[26rem] font-sans font-normal text-text-grey">
              Enter the 4-digit code sent to {cookie.email} to verify your account
            </p>
          </div>
          <Image
            src={"/images/verification.png"}
            alt=""
            width={320}
            height={258}
            className="mt-4 h-auto max-h-[36vh] w-auto object-contain"
          />
        </div>
        <form onSubmit={formik.handleSubmit} className="w-full max-w-[440px]">
          <Card className="w-full p-6">
              <CardContent className="flex justify-center">
                <div className="flex flex-col items-center justify-center">
                  <OtpInput
                    value={formik.values.code}
                    onChange={(e) => {
                      setOtp(e);
                      formik.setFieldValue("code", e, true);
                      // Automatically submit when OTP is fully entered
                      if (e.length === 4) {
                        setTimeout(() => {
                          formik.submitForm();
                        }, 0);
                      }
                    }}
                    numInputs={4}
                    renderSeparator={<span style={{ width: "12px" }}></span>}
                    renderInput={(props) => (
                      <div
                        style={{
                          borderRadius: "12px",
                          padding: "2px", // thickness of gradient border
                          background: "linear-gradient(90deg, #9BE303, #7FBB00)", // gradient green
                        }}
                      >
                        <input
                          {...props}
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "10px", // slightly smaller to show gradient
                            border: "none",
                            backgroundColor: "#E5E7EB", // gray background
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
                  {checkError("code", formik) ? (
                    <p className="mt-[8px] text-[12px] text-[#FF8D8D]">{formik.errors.code}</p>
                  ) : null}
                </div>
              </CardContent>
              <CardContent className="mt-[10px] mb-[10px] flex justify-center">
                <div className="mt-[10px] mb-[5px] flex cursor-pointer justify-center">
                  {canResend ? (
                    <p
                      className="font-semi-normal text-light-green cursor-pointer font-sans text-[16px]"
                      onClick={handleResend}
                    >
                      Send code again
                    </p>
                  ) : (
                    <p className="font-semi-normal text-light-green font-sans text-[16px]">
                      Resend code in {seconds} secs
                    </p>
                  )}
                </div>
              </CardContent>
              <CardContent className="flex flex-col space-y-2">
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Verify"
                  error={formik.isValid}
                  classes="w-full h-[48px] rounded-[12px]"
                />
              </CardContent>
          </Card>
        </form>
      </div>
    </AuthLayout>
  );
}
