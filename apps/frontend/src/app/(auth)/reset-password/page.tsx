"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Button, Input, Label } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAppDispatch } from "@/redux/hook";
import Link from "next/link";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useResetPasswordMutation } from "@/features/authentication/mutations";
import * as yup from "yup";
import { useFormik } from "formik";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resetPasswordMutation = useResetPasswordMutation();
  const loading = resetPasswordMutation.isPending;

  const resetPasswordSchema = yup.object({
    password: yup.string().required("Password is required"),

    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      await onSignup(values);
    },
  });

  const onSignup = async (values: any) => {
    resetPasswordMutation.mutate(
      { password: values.password, confirm_password: values.confirm_password },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Password reset successfully",
              type: "success",
            }),
          );
          router.push("/login");
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
                <p className="font-ruso text-[40px] font-bold leading-[48px]">Reset password</p>
                <p className="mt-2 font-sans text-[18px] font-normal leading-[27px]">
                  Stronger password, stronger protection! Combine <br /> uppercase, lowercase,
                  numbers, and symbols to <br /> protect your account.
                </p>
              </div>
              <div>
                <Image
                  src={"/images/reset_password.png"}
                  alt="signup image"
                  width={511.06}
                  height={519.77}
                />
              </div>
            </div>
            <Card className="w-[480px] p-10">
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-label">
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
                  <span className="font-sans text-[12px] text-grey-40">
                    Password must be at least 8 character long
                  </span>
                  {formik.touched.password && formik.errors.password ? (
                    <p className="text-left text-[12px] text-[#FF8D8D]">{formik.errors.password}</p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-label">
                    Confirm password
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    className="form-font h-12 rounded-xl border-0 bg-light_grey"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.confirm_password && formik.errors.confirm_password ? (
                    <p className="text-left text-[12px] text-[#FF8D8D]">
                      {formik.errors.confirm_password}
                    </p>
                  ) : null}
                </div>
              </CardContent>
              <CardContent className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  disabled={loading || !formik.isValid || !formik.dirty}
                  aria-busy={loading}
                  aria-disabled={loading || !formik.isValid}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ${
                    loading || !formik.isValid
                      ? "cursor-not-allowed bg-green-700 opacity-90"
                      : "bg-gradient-green hover:brightness-110 active:scale-[0.98]"
                  } `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save password"
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
