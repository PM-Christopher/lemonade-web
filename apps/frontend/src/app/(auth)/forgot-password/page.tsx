"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Button, Input, Label } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "@/redux/hook";
import { useForgotPasswordMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "@lemonade/validation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [cookie, setCookie] = useCookies(["newToken", "email"]);
  const forgotPasswordMutation = useForgotPasswordMutation();
  const loading = forgotPasswordMutation.isPending;

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    validateOnMount: true,
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
      <form
        onSubmit={formik.handleSubmit}
        className="flex h-full w-full max-w-[1100px] items-center justify-center gap-10"
      >
        <div className="hidden min-w-0 flex-col tablet:flex">
          <div>
            <p className="font-ruso text-display-s font-bold">Forgot Password</p>
            <p className="text-body-xl mt-2 max-w-[26rem] font-sans font-normal text-text-grey">
              Enter your email address and a 4-digit code will be sent to reset your password.
            </p>
          </div>
          <Image
            src={"/images/forgot_password.png"}
            alt=""
            width={511}
            height={520}
            className="mt-2 h-auto max-h-[40vh] w-auto object-contain"
          />
        </div>
        <Card className="w-full max-w-[440px] p-6">
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-label">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janedoe@example.com"
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
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
      </form>
    </AuthLayout>
  );
}
