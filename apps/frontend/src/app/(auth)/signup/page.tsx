"use client";
import React from "react";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "@/redux/hook";
import { checkError } from "@lemonade/domain";
import { useFormik } from "formik";
import { signupSchema } from "@lemonade/validation";
import { signup } from "@/features/authentication/authApi";
import { Card, CardContent, CardFooter, Input, Label } from "@lemonade/ui";
import Image from "next/image";
import { FormikButton } from "@/components/global/FormikButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import { setIsRouting } from "@/redux/tempSlice";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { authUser } from "@/features/authentication/authSlice";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { useGoogleAuthMutation } from "@/features/authentication/mutations";
import { ONBOARDING_TOKEN_COOKIE } from "@/lib/cookie-names";
import { errorMessage } from "@/lib/api-error";
import dynamic from "next/dynamic";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";
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

// Off the initial bundle — only needed once a legal-document link is
// clicked (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const TermsOfUseModal = dynamic(() => import("@/components/TermsOfUseModal"), {
  ssr: false,
});
const PrivacyPolicyModal = dynamic(() => import("@/components/PrivacyPolicyModal"), {
  ssr: false,
});

export default function SignupPage() {
  const { push, getQueryParam } = useNavigation();
  const dispatch = useAppDispatch();
  const [, setCookie] = useCookies<string>([ONBOARDING_TOKEN_COOKIE]);
  const googleAuthMutation = useGoogleAuthMutation();
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
      // Prefill from ?referral=CODE; still editable.
      referral_code: getQueryParam("referral") ?? "",
    },
    validationSchema: signupSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      await signup({ ...values }, dispatch, { push }, setCookie);
    },
  });

  // Google sign-up: resume onboarding, or go home when the account is already finished.
  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    try {
      const result = await googleAuthMutation.mutateAsync(tokenResponse.access_token);
      dispatch(setIsRouting(true));
      dispatch(updateToastifyReducer({ show: true, message: "Successful", type: "success" }));

      if (result.needsOnboarding) {
        setCookie(ONBOARDING_TOKEN_COOKIE, result.token, {
          path: "/",
          maxAge: 3600 * 6,
          sameSite: "lax",
        });
        dispatch(authUser({ user: result.user }));
        window.location.assign(
          result.user.email_verified ? routes.PROFILE_SETUP : routes.VERIFY_EMAIL,
        );
        return;
      }

      setTimeout(() => {
        push(routes.HOME);
      }, 500);
    } catch (error) {
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(error, "Google sign-up failed"),
          type: "error",
        }),
      );
    }
  };

  return (
    <AuthLayout>
      <div className="mx-auto flex w-fit max-w-full items-start justify-center gap-10">
        <div className="tablet:flex hidden w-[400px] shrink-0 flex-col">
          <p className="font-ruso text-display-s font-bold">Create account</p>
          <p className="text-body-xl text-text-grey mt-2 font-sans font-normal">
            Join the network of diverse pool of talents.
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
            <p className="font-ruso text-title-xl text-primary-black font-bold">Create account</p>
            <p className="text-body-l text-text-grey mt-1 font-sans font-normal">
              Join the network of diverse pool of talents.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="w-full">
            {/* p-0 on content/footer — Card already owns padding; default Card* p-6 left empty space. */}
            <Card className="tablet:p-6 w-full rounded-2xl border-none p-5 shadow-none">
              <CardContent className="grid gap-4 p-0">
                <div className="grid gap-2">
                  <Label
                    htmlFor="fullname"
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
                <div className="grid gap-2">
                  <Label
                    htmlFor="referral_code"
                    className="text-text-grey font-sans text-[14px] font-normal"
                  >
                    Referral code (optional)
                  </Label>
                  <Input
                    id="referral_code"
                    type="text"
                    placeholder="e.g. ABC123XYZ"
                    value={formik.values.referral_code}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                  />
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
                  {/* <SocialMark src={images.APPLE} label="Apple" /> */}
                  {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                    <GoogleAuthButton onSuccess={handleGoogleSuccess} />
                  ) : (
                    <SocialMark src={images.GOOGLE} label="Google" />
                  )}
                  {/* <SocialMark src={images.FACEBOOK} label="Facebook" /> */}
                </div>
              </CardContent>
              <CardFooter className="mt-4 flex justify-center p-0">
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
