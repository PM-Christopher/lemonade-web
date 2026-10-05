"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

// Apple/Facebook sign-in have no backend integration yet (no OAuth app,
// no route, no action) — commented out rather than deleted so the button
// markup is ready the moment that work lands. See SocialMark's commented
// call sites below.
// function SocialMark({ src, label }: { src: string; label: string }) {
//   return (
//     <div className="flex flex-col items-center gap-2">
//       <span className="border-border-grey flex h-14 w-14 items-center justify-center rounded-xl border bg-white">
//         <Image src={src} alt="" width={24} height={24} />
//       </span>
//       <span className="text-meta text-text-grey">{label}</span>
//     </div>
//   );
// }

interface GoogleLoginResponse {
  status?: number;
  message?: string;
  data?: {
    data?: {
      token_type?: string;
      token?: string;
      user?: { status?: number; username?: string | null };
    };
  };
}

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
  const dispatch = useAppDispatch();
  // "token" here is only for the Google OAuth flow below (handleLoginSuccess),
  // which isn't covered by this cutover — see its own comment.
  const [, setCookie] = useCookies(["newToken", "token"]);
  const loginMutation = useLoginMutation();
  const next = useMemo(() => safeNext(searchParams.get("next")), [searchParams]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnMount: true,
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

  // Google OAuth flow — deliberately NOT covered by the httpOnly cutover.
  // It still calls the backend directly and sets a JS-readable "token"
  // cookie, same as every path did before this cutover. Bringing it onto
  // the same secure flow as email/password login needs its own BFF route
  // (a /api/auth/google mirroring app/api/auth/login/route.ts) — real,
  // separate follow-up work, not something to fold in here silently.
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
          router.push("/verify-email");
        } else {
          const user = res.data?.data?.user;
          const token = res.data?.data?.token;
          if (user?.status == 0) {
            setCookie("newToken", token, {
              path: "/",
              maxAge: 3600 * 6, // Expires after 6hrs
              sameSite: false,
              // domain: env === 'development' ? '' : ''
            });
            router.push("/verify-email");
          } else if (user?.username === null) {
            setCookie("newToken", token, {
              path: "/",
              maxAge: 3600 * 6, // Expires after 6hrs
              sameSite: false,
              // domain: env === 'development' ? '' : ''
            });
            router.push("/profile-setup");
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
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-center gap-8">
        <div className="tablet:flex hidden min-w-0 flex-col">
          <div>
            <p className="font-ruso text-display-s font-bold">Login</p>
            <p className="text-body-xl mt-2 font-sans font-normal">
              Let&apos;s get you back into your account
            </p>
          </div>
          <Image
            src={"/images/signup_image.png"}
            alt=""
            width={511}
            height={520}
            priority
            className="mt-2 h-auto max-h-[42vh] w-auto object-contain"
          />
        </div>
        <div className="flex w-full max-w-[440px] flex-col">
          <div className="tablet:hidden mb-4 shrink-0 text-center">
            <p className="font-ruso text-title-xl text-primary-black font-bold">Login</p>
            <p className="text-body-l text-text-grey mt-1 font-sans font-normal">
              Let&apos;s get you back into your account
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="w-full">
            <Card className="w-full rounded-2xl border-none p-6 shadow-none">
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-text-grey text-label font-sans font-normal"
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
                    className="text-text-grey text-label font-sans font-normal"
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
                <Link href="/forgot-password">
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
                <div className="flex items-center justify-around">
                  <div className="bg-border-grey h-0.5 w-[60px]" />
                  <p className="text-grey-light text-body-s text-center font-normal">
                    Or continue with
                  </p>
                  <div className="bg-border-grey h-0.5 w-[60px]" />
                </div>
                <div className="mt-4 flex items-start justify-center gap-6">
                  {/* <SocialMark src="/images/apple.png" label="Apple" /> */}
                  {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                    <GoogleAuthButton onSuccess={handleGoogleSuccess} />
                  ) : null}
                  {/* <SocialMark src="/images/facebook.png" label="Facebook" /> */}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
