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
import { useGoogleAuthMutation, useLoginMutation } from "@/features/authentication/mutations";
import AuthLayout from "@/components/layouts/AuthLayout";
import { setIsRouting } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { authUser } from "@/features/authentication/authSlice";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import type { LoginResult } from "@/features/authentication/api";
import { ONBOARDING_TOKEN_COOKIE } from "@/lib/cookie-names";
import { errorMessage } from "@/lib/api-error";
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
  const [, setCookie] = useCookies([ONBOARDING_TOKEN_COOKIE]);
  const loginMutation = useLoginMutation();
  const googleAuthMutation = useGoogleAuthMutation();
  const next = useMemo(() => safeNext(getQueryParam("next")), [getQueryParam]);

  // Shared by password and Google sign-in: resume onboarding, or go to the original page.
  const handleAuthResult = (result: LoginResult) => {
    dispatch(setIsRouting(true));

    if (result.needsOnboarding) {
      // Resume signup: verified email → profile setup, otherwise verify email.
      setCookie(ONBOARDING_TOKEN_COOKIE, result.token, {
        path: "/",
        maxAge: 3600 * 6,
        sameSite: false,
      });
      dispatch(authUser({ user: result.user }));
      push(result.user.email_verified ? routes.PROFILE_SETUP : routes.VERIFY_EMAIL);
      return;
    }

    dispatch(updateToastifyReducer({ show: true, message: "successful", type: "success" }));
    setTimeout(() => {
      push(next || routes.HOME);
    }, 500);
  };

  const showLoginError = (error: unknown) => {
    dispatch(
      updateToastifyReducer({
        show: true,
        message: errorMessage(error, "Error trying to login"),
        type: "error",
      }),
    );
  };

  const formik = useFormik({
    initialValues: localLoginDefaults(),
    validationSchema: loginSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        handleAuthResult(await loginMutation.mutateAsync(values));
      } catch (error) {
        showLoginError(error);
      }
    },
  });

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    try {
      handleAuthResult(await googleAuthMutation.mutateAsync(tokenResponse.access_token));
    } catch (error) {
      showLoginError(error);
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
