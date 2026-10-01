"use client";
import React from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { checkError } from "@lemonade/domain";
import { useFormik } from "formik";
import { signupSchema } from "@lemonade/validation";
import { signup } from "@/features/authentication/authApi";
import { Card, CardContent, CardFooter, Input, Label } from "@lemonade/ui";
import Image from "next/image";
import { FormikButton } from "@/components/global/FormikButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import axios from "axios";
import { axiosInstance } from "@/lib/axiosInstane";
import { setIsRouting } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { authSuccess, authUser } from "@/features/authentication/authSlice";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import dynamic from "next/dynamic";

function SocialMark({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="border-border-grey flex h-14 w-14 items-center justify-center rounded-xl border bg-white">
        <Image src={src} alt="" width={24} height={24} />
      </span>
      <span className="text-meta text-text-grey">{label}</span>
    </div>
  );
}

// Off the initial bundle — only needed once a legal-document link is
// clicked (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const TermsOfUseModal = dynamic(() => import("@/components/TermsOfUseModal"), {
  ssr: false,
});
const PrivacyPolicyModal = dynamic(() => import("@/components/PrivacyPolicyModal"), {
  ssr: false,
});

type valuesType = {
  email: string;
  fullname: string;
  password: string;
};

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookie, setCookie] = useCookies(["token", "newToken"]);
  const [termOpen, setTermOpen] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);

  const togglePrivacy = () => {
    setPrivacyOpen(!privacyOpen);
  };

  const toggleTermOpen = () => {
    setTermOpen(!termOpen);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      password: "",
    },
    validationSchema: signupSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      await signup({ ...values }, dispatch, router, setCookie);
    },
  });

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
            setCookie("newToken", res.data.data.token, {
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
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-center gap-8">
        <div className="tablet:flex hidden min-w-0 flex-col">
          <p className="font-ruso text-display-s font-bold">Create account</p>
          <p className="text-body-xl text-text-grey mt-2 font-sans font-normal">
            Join the network of diverse pool of talents.
          </p>
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
            <p className="font-ruso text-title-xl text-primary-black font-bold">Create account</p>
            <p className="text-body-l text-text-grey mt-1 font-sans font-normal">
              Join the network of diverse pool of talents.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="min-h-0 w-full overflow-y-auto">
            <Card className="tablet:p-6 w-full rounded-2xl border-none p-5 shadow-none">
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="username"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Full name
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={formik.values.fullname}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                  />
                  {checkError("fullname", formik) ? (
                    <p className="text-[12px] text-[#FF8D8D]">{formik.errors.fullname}</p>
                  ) : null}
                </div>
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
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                  />
                  {checkError("email", formik) ? (
                    <p className="text-[12px] text-[#FF8D8D]">{formik.errors.email}</p>
                  ) : null}
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
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                  />

                  {checkError("password", formik) ? (
                    <p className="text-meta text-[#FF8D8D]">{formik.errors.password}</p>
                  ) : (
                    <p className="text-meta text-text-grey">
                      Password must be at least 8 character long
                    </p>
                  )}
                </div>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Create account"
                  error={formik.isValid}
                  classes="w-full h-12 rounded-xl"
                />
                <div className="flex items-center gap-3">
                  <div className="bg-border-grey h-px flex-1" />
                  <p className="text-text-grey text-body-s font-normal">Or continue with</p>
                  <div className="bg-border-grey h-px flex-1" />
                </div>
                <div className="flex items-start justify-center gap-6">
                  <SocialMark src="/images/apple.png" label="Apple" />
                  {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                    <GoogleAuthButton onSuccess={handleGoogleSuccess} />
                  ) : (
                    <SocialMark src="/images/google.png" label="Google" />
                  )}
                  <SocialMark src="/images/facebook.png" label="Facebook" />
                </div>
              </CardContent>
              <CardFooter className="mt-2 flex justify-center">
                <p className="text-body-s max-w-[22rem] text-center font-normal">
                  By continuing you agree with Lemonade network&apos;s{" "}
                  <button
                    type="button"
                    className="text-light-green cursor-pointer font-semibold underline"
                    onClick={toggleTermOpen}
                  >
                    Terms of Use
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-light-green cursor-pointer font-semibold underline"
                    onClick={togglePrivacy}
                  >
                    Privacy Policies
                  </button>
                </p>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
      <TermsOfUseModal toggle={toggleTermOpen} option={termOpen} />
      <PrivacyPolicyModal toggle={togglePrivacy} option={privacyOpen} />
    </AuthLayout>
  );
}
