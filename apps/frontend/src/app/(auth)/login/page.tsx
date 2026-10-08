"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { Card, CardContent, Input, Label } from "@lemonade/ui";
import Image from "next/image";

import { useFormik } from "formik";
import { loginSchema } from "@lemonade/validation";
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
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";
import { localLoginDefaults } from "@/lib/env.client";
import { useNavigation } from "@/hooks/useNavigation";

// Placeholder mark when Google is not configured, or for unused Apple/Facebook UI.
function SocialMark({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="border-border-grey flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border bg-white">
        <Image src={src} alt="" width={24} height={24} />
      </span>
      <span className="text-meta text-text-grey">{label}</span>
    </div>
  );
}

interface GoogleLoginResponse {
  status?: number;
  message?: string;
  data?: {
    data?: {
      token_type?: string;
      token?: string;
      user?: { status?: number; username?: string | null; email_verified?: boolean };
    };
  };
}

function safeNext(raw: string | null) {
  // Only allow same-site relative paths.
  if (!raw) return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  return raw;
}

export default function LoginPage() {
  const { push, getQueryParam } = useNavigation();
  const dispatch = useAppDispatch();
  // Google login still uses a JS-readable token cookie.
  const [, setCookie] = useCookies(["newToken", "token"]);
  const loginMutation = useLoginMutation();
  const next = useMemo(() => safeNext(getQueryParam("next")), [getQueryParam]);

  const formik = useFormik({
    initialValues: localLoginDefaults(),
    validationSchema: loginSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const result = await loginMutation.mutateAsync(values);
        dispatch(setIsRouting(true));

        if (result.needsOnboarding) {
          // Resume signup: verified email → profile setup, otherwise verify email.
          setCookie("newToken", result.token, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
          });
          dispatch(authUser({ user: result.user }));
          push(result.user.email_verified ? routes.PROFILE_SETUP : routes.VERIFY_EMAIL);
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
          push(next || routes.HOME);
        }, 500);
      } catch (error) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error instanceof Error ? error.message : "Error trying to login",
            type: "error",
          }),
        );
      }
    },
  });

  // Google still talks to the backend directly (not the password-login BFF).
  const handleLoginSuccess = async (res: GoogleLoginResponse) => {
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

        if (res.data?.data?.token_type === "account_verification_token") {
          setCookie("newToken", res.data.data.token, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
          });
          dispatch(authUser(res?.data?.data));
          // Resume signup based on whether email is already verified.
          push(res.data?.data?.user?.email_verified ? routes.PROFILE_SETUP : routes.VERIFY_EMAIL);
        } else {
          const user = res.data?.data?.user;
          const token = res.data?.data?.token;
          if (user?.status == 0 || user?.username === null) {
            setCookie("newToken", token, {
              path: "/",
              maxAge: 3600 * 6, // Expires after 6hrs
              sameSite: false,
            });
            push(user?.email_verified ? routes.PROFILE_SETUP : routes.VERIFY_EMAIL);
          } else {
            setCookie("token", token, {
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
            dispatch(authSuccess(res.data?.data));
            setTimeout(() => {
              push(routes.HOME);
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
      {/* Same shell as signup — natural art size + tight gap (Figma). */}
      <div className="mx-auto flex w-fit max-w-full items-start justify-center gap-10">
        <div className="tablet:flex hidden w-[400px] shrink-0 flex-col">
          <p className="font-ruso text-display-s font-bold">Login</p>
          <p className="text-body-xl text-text-grey mt-2 font-sans font-normal">
            Let&apos;s get you back into your account
          </p>
          <Image
            src={images.SIGNUP_BG}
            alt=""
            width={511}
            height={520}
            priority
            className="mt-4 h-auto w-full object-contain"
          />
        </div>
        <div className="flex w-full max-w-[440px] shrink-0 flex-col">
          <div className="tablet:hidden mb-4 shrink-0 text-center">
            <p className="font-ruso text-title-xl text-primary-black font-bold">Login</p>
            <p className="text-body-l text-text-grey mt-1 font-sans font-normal">
              Let&apos;s get you back into your account
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <Card className="tablet:p-6 w-full rounded-2xl border-none p-5 shadow-none">
              <CardContent className="grid gap-4 p-0">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janedoe@example.com"
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <Link href={routes.FORGOT_PASSWORD}>
                  <p className="text-bl text-light-green cursor-pointer font-sans underline">
                    Forgot password?
                  </p>
                </Link>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Login"
                  error={formik.isValid}
                  classes="w-full h-12 rounded-xl"
                />
                <div className="flex items-center gap-3">
                  <div className="bg-border-grey h-px flex-1" />
                  <p className="text-text-grey text-body-s font-normal">Or continue with</p>
                  <div className="bg-border-grey h-px flex-1" />
                </div>
                <div className="flex items-start justify-center gap-6">
                  {/* <SocialMark src={images.APPLE} label="Apple" /> */}
                  {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                    <GoogleAuthButton onSuccess={handleGoogleSuccess} />
                  ) : (
                    <SocialMark src={images.GOOGLE} label="Google" />
                  )}
                  {/* <SocialMark src={images.FACEBOOK} label="Facebook" /> */}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
