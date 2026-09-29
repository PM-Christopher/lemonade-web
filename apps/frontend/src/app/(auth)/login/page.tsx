"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, Input, Label } from "@lemonade/ui";
import Image from "next/image";

import { useFormik } from "formik";
import * as yup from "yup";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { useLoginMutation } from "@/features/authentication/mutations";
import AuthLayout from "@/components/layouts/AuthLayout";
import { setIsRouting } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { authSuccess, authUser } from "@/features/authentication/authSlice";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { axiosInstance } from "@/lib/axiosInstane";
import { useFcm } from "@/context/FcmContext";

function safeNext(raw: string | null) {
  // Prevent open redirects: only allow relative paths
  if (!raw) return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  return raw;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  // "token" here is only for the Google OAuth flow below (handleLoginSuccess),
  // which isn't covered by this cutover — see its own comment.
  const [cookie, setCookie] = useCookies(["newToken", "token"]);
  const { fcmToken, notification } = useFcm();
  const loginMutation = useLoginMutation();

  const loginSchema = yup.object({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup.string().min(8).required("Password is required"),
    notification: yup.object({
      device_token: yup.string().nullable(),
      device_type: yup.string().nullable(),
      platform: yup.string().nullable(),
    }),
  });

  const next = useMemo(() => safeNext(searchParams.get("next")), [searchParams]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      notification: {
        device_token: fcmToken,
        device_type: "desktop",
        platform: "",
      },
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const result = await loginMutation.mutateAsync(values);
        dispatch(setIsRouting(true));

        if (result.needsOnboarding) {
          // Pre-verification / profile-incomplete state — this
          // narrower flow keeps its own short-lived, JS-readable
          // token, unchanged from before the httpOnly cutover.
          // See app/api/auth/login/route.ts.
          setCookie("newToken", result.token, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
          });
          router.push(result.user.status == 0 ? "/verify-email" : "/profile-setup");
          return;
        }

        dispatch(
          updateToastifyReducer({
            show: true,
            message: "successful",
            type: "success",
          }),
        );

        setTimeout(() => {
          router.push(next || "/");
        }, 500);
      } catch (error: any) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "Error trying to login",
            type: "error",
          }),
        );
      }
    },
  });

  useEffect(() => {
    if (fcmToken) {
      formik.setFieldValue("notification.device_token", fcmToken);
    }
    // formik's returned object is recreated on every keystroke (it embeds
    // current values/errors), so adding it here would re-run this sync
    // on every render, fighting the user's own edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fcmToken]);

  // Google OAuth flow — deliberately NOT covered by the httpOnly cutover.
  // It still calls the backend directly and sets a JS-readable "token"
  // cookie, same as every path did before this cutover. Bringing it onto
  // the same secure flow as email/password login needs its own BFF route
  // (a /api/auth/google mirroring app/api/auth/login/route.ts) — real,
  // separate follow-up work, not something to fold in here silently.
  const handleLoginSuccess = async (res: any) => {
    try {
      if (res.status) {
        dispatch(setIsRouting(true));
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Successful",
            type: "success",
          }),
        );

        if (res.data.data.token_type === "account_verification_token") {
          setCookie("newToken", res.data.data.token, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
          });
          dispatch(authUser(res?.data?.data));
          router.push("/verify-email");
        } else {
          const user = res.data?.data?.user;
          if (user.status == 0) {
            setCookie("newToken", res.data.data.token, {
              path: "/",
              maxAge: 3600 * 6, // Expires after 6hrs
              sameSite: false,
              // domain: env === 'development' ? '' : ''
            });
            router.push("/verify-email");
          } else if (user.username === null) {
            setCookie("newToken", res.data.data.token, {
              path: "/",
              maxAge: 3600 * 6, // Expires after 6hrs
              sameSite: false,
              // domain: env === 'development' ? '' : ''
            });
            router.push("/profile-setup");
          } else {
            setCookie("token", res.data.data.token, {
              path: "/",
              maxAge: 3600 * 6, // Expires after 6hrs
              sameSite: false,
            });
            dispatch(
              updateToastifyReducer({
                show: true,
                message: "successful",
                type: "success",
              }),
            );
            dispatch(authSuccess(res.data.data));
            setTimeout(() => {
              router.push("/");
            }, 500);
          }
        }
      } else {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: res.message || "error",
            type: "error",
          }),
        );
      }
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    try {
      const res = await axiosInstance.post(`/user/auth/google`, {
        token: tokenResponse.access_token,
      });

      await handleLoginSuccess(res);
    } catch (error) {
      console.error("Error sending code to backend:", error);
    }
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
            <Link href="/signup">
              <p className="text-bl rounded-xl border-2 p-[9px] px-[16px] font-sans">Sign up</p>
            </Link>
          </div>
        </div>
        <div className="mt-24 flex flex-col items-center justify-center gap-16 tablet:flex-row tablet:items-start tablet:px-4">
          <div className="flex flex-col phone:mb-[16px]">
            <div className="text-center phone:text-left">
              <p className="font-ruso text-[40px] font-bold leading-[48px]">Login</p>
              <p className="mt-2 font-sans text-[18px] font-normal leading-[27px]">
                Let&apos;s get you back into your account
              </p>
            </div>
            {/* Show image only on desktop and laptop screens */}
            <div className="hidden tablet:flex">
              <Image
                src={"/images/signup_image.png"}
                alt="signup image"
                width={511.06}
                height={519.77}
              />
            </div>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <Card className="w-full rounded-[16px] border-none p-[24px] shadow-none tablet:w-[480px]">
              <CardContent className="grid gap-[24px] tablet:gap-[40px]">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="font-sans text-[14px] font-normal text-text-grey"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janedoe@example.com"
                    className="form-font h-12 rounded-xl border-0 bg-light_grey"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className="font-sans text-[14px] font-normal text-text-grey"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="form-font h-12 rounded-xl border-0 bg-light_grey"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <Link href="/forgot-password">
                  <p className="text-bl cursor-pointer font-sans text-light-green underline">
                    Forgot password?
                  </p>
                </Link>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Login"
                  error={formik.isValid}
                  classes="w-full h-[48px] rounded-[12px]"
                />
                <div className="flex items-center justify-around">
                  <div className="h-[2px] w-[60px] bg-border-grey" />
                  <p className="text-center text-[14px] font-normal text-grey-light">
                    Or continue with
                  </p>
                  <div className="h-[2px] w-[60px] bg-border-grey" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-[24px]">
                  {/*<div className="app-icon-border flex justify-center items-center">*/}
                  {/*  <Image*/}
                  {/*    src={"/images/apple.png"}*/}
                  {/*    alt="logo"*/}
                  {/*    width={24}*/}
                  {/*    height={24}*/}
                  {/*  />*/}
                  {/*</div>*/}
                  {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                    <GoogleAuthButton onSuccess={handleGoogleSuccess} />
                  )}
                  {/*<div className="app-icon-border flex justify-center items-center">*/}
                  {/*  <Image*/}
                  {/*    src={"/images/facebook.png"}*/}
                  {/*    alt="logo"*/}
                  {/*    width={24}*/}
                  {/*    height={24}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
}
