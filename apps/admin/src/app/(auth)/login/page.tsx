"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import Image from "next/image";
import { Card, CardContent, Input, Label } from "@lemonade/ui";
import { FormikButton } from "@/components/global/FormikButton";
import { useFormik } from "formik";
import { loginSchema } from "@lemonade/validation";
import { useLoginMutation } from "@/features/authentication/mutations";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { updateToastifyReducer } from "@/redux/toastifySlice";

function LoginPage({}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [, setCookie] = useCookies(["newToken"]);
  const loginMutation = useLoginMutation();

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

        if (result.needsOnboarding) {
          // Profile-incomplete admin — narrower flow keeps its
          // own short-lived, JS-readable token, unchanged from
          // before the httpOnly cutover. See
          // app/api/auth/login/route.ts.
          setCookie("newToken", result.token, {
            path: "/",
            maxAge: 3600 * 6,
            sameSite: false,
          });
          router.push("/profile-setup");
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
          router.push("/");
        }, 500);
      } catch (error) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message:
              (error instanceof Error && error.message) ||
              "Something went wrong. Please try again.",
            type: "error",
          }),
        );
      }
    },
  });
  return (
    <AuthLayout>
      <section className="bg-light-grey h-full min-h-screen overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
          </div>
        </div>
        <div className="tablet:flex-row tablet:items-start tablet:px-4 mt-24 flex flex-col items-center justify-center gap-16">
          <form onSubmit={formik.handleSubmit}>
            <Card className="tablet:w-[480px] w-full rounded-[16px] border-none p-[24px] shadow-sm">
              <CardContent className="tablet:gap-[40px] grid gap-[24px]">
                <div>
                  <p className="font-ruso text-[24px] font-normal">Login</p>
                  <p className="text-text-grey text-[14px] font-normal">
                    Login with your email address and password.
                  </p>
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
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
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
                    className="form-font bg-light-grey h-12 rounded-xl border-0"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <p className="text-light-green text-[16px] font-medium underline">
                  Forgot password
                </p>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Login"
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

export default LoginPage;
