"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Button, Input, Label } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useCookies } from "react-cookie";
import Link from "next/link";
import { useAppDispatch } from "@/redux/hook";
import { useForgotPasswordMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import * as yup from "yup";
import { useFormik } from "formik";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [cookie, setCookie] = useCookies(["newToken", "email"]);
  const forgotPasswordMutation = useForgotPasswordMutation();
  const loading = forgotPasswordMutation.isPending;

  const forgotPasswordSchema = yup.object({
    email: yup.string().required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      await onSignup(values);
    },
  });

  const onSignup = async (values: any) => {
    forgotPasswordMutation.mutate(
      { email: values.email },
      {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Please check your inbox and click on verification link.",
              type: "success",
            }),
          );
          setCookie("newToken", result.token, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
            // domain: env === 'development' ? '' : ''
          });
          setCookie("email", result.email, {
            path: "/",
            maxAge: 3600 * 6, // Expires after 6hrs
            sameSite: false,
            // domain: env === 'development' ? '' : ''
          });
          router.push("/verify-code");
        },
        onError: (error: any) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error.message,
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <AuthLayout>
      <section className="bg-gradient-light-green">
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
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-10 flex min-h-screen flex-wrap items-start justify-center gap-16">
            <div className="flex flex-col">
              <div>
                <p className="font-ruso text-[40px] font-bold leading-[48px]">Forgot Password</p>
                <p className="mt-2 font-sans text-[18px] font-normal leading-[27px]">
                  Enter your email address and a 4-digit code will <br /> be sent to reset your
                  password.
                </p>
              </div>
              <div>
                <Image
                  src={"/images/forgot_password.png"}
                  alt="signup image"
                  width={511.06}
                  height={519.77}
                />
              </div>
            </div>
            <Card className="w-[480px] p-10">
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-label">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janedoe@example.com"
                    className="form-font h-12 rounded-xl border-0 bg-light_grey"
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="text-left text-[12px] text-[#FF8D8D]">{formik.errors.email}</p>
                  ) : null}
                </div>
              </CardContent>
              <CardContent className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  aria-disabled={loading}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${
                    loading
                      ? "cursor-not-allowed bg-green-700 opacity-90"
                      : "bg-gradient-green hover:brightness-110 active:scale-[0.98]"
                  } `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Code"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </section>
    </AuthLayout>
  );
}
