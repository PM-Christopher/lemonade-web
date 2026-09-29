"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@lemonade/ui";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { checkError } from "@lemonade/domain";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormikButton } from "@/components/global/FormikButton";
import {
  useResendOtpMutation,
  useVerifyAccountOtpMutation,
} from "@/features/authentication/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/redux/store";

export default function VerifyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, code } = useSelector((state: RootState) => state.auth);
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
  const verifySchema = yup.object({
    code: yup.string().length(4, "Code must be 4 characters").required("Code is required"),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: verifySchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      await verifyOtp(values);
    },
  });

  const [otp, setOtp] = useState(formik.values.code);

  const verifyOtp = (values: any) => {
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
      <section className="h-full min-h-screen overflow-hidden bg-gradient-light-green">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <Link href={"/login"}>
              <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
            </Link>
          </div>
          <div>
            <Link href="/login">
              <p className="text-bl rounded-xl border-2 p-[9px] px-[16px] font-sans">Login</p>
            </Link>
          </div>
        </div>
        <div className="mt-24 flex flex-col items-center justify-center gap-16 tablet:flex-row tablet:items-start tablet:px-4">
          <div className="flex flex-col phone:mb-[16px]">
            <div className="text-center phone:text-left">
              <p className="font-ruso text-[24px] font-bold leading-[48px] tablet:text-[40px]">
                Verify email address
              </p>
              <p className="w-[327px] text-[14px] font-normal leading-[27px] tablet:w-[421px] tablet:text-[18px]">
                Enter the 4-digit code sent to {user?.email} to verify your account
              </p>
            </div>
            <div className="mt-[24px] hidden tablet:flex">
              <Image
                src={"/images/verification.png"}
                alt="signup image"
                width={320}
                height={257.55}
              />
            </div>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <Card className="w-full rounded-[16px] border-none p-[24px] shadow-none tablet:w-[480px]">
              <CardContent className="grid gap-[24px] tablet:gap-[40px]">
                <div className="flex flex-col items-center justify-center">
                  <OtpInput
                    value={formik.values.code}
                    onChange={(e) => {
                      setOtp(e);
                      formik.setFieldValue("code", e, true);
                      // Automatically submit when OTP is fully entered
                      // if (e.length === 4) {
                      //     setTimeout(() => {
                      //         formik.submitForm();
                      //     }, 0);
                      // }
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
                <div className="mb-[5px] flex justify-center">
                  {canResend ? (
                    <p
                      className="cursor-pointer font-sans text-[16px] font-semi-normal text-light-green"
                      onClick={handleResend}
                    >
                      Send code again
                    </p>
                  ) : (
                    <p className="font-sans text-[16px] font-semi-normal text-light-green">
                      Resend code in {seconds} secs
                    </p>
                  )}
                </div>
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
      </section>
    </AuthLayout>
  );
}
