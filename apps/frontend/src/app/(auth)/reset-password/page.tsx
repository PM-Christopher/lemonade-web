"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Button, Input, Label } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useResetPasswordMutation } from "@/features/authentication/mutations";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@lemonade/validation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resetPasswordMutation = useResetPasswordMutation();
  const loading = resetPasswordMutation.isPending;

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: resetPasswordSchema,
    validateOnMount: true,
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
      <form
        onSubmit={formik.handleSubmit}
        className="flex h-full w-full max-w-[1100px] items-center justify-center gap-10"
      >
        <div className="hidden min-w-0 flex-col tablet:flex">
          <div>
            <p className="font-ruso text-display-s font-bold">Reset password</p>
            <p className="text-body-xl mt-2 max-w-[26rem] font-sans font-normal text-text-grey">
              Stronger password, stronger protection! Combine uppercase, lowercase, numbers, and
              symbols to protect your account.
            </p>
          </div>
          <Image
            src={"/images/reset_password.png"}
            alt=""
            width={511}
            height={520}
            className="mt-2 h-auto max-h-[36vh] w-auto object-contain"
          />
        </div>
        <Card className="w-full max-w-[440px] p-6">
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-label">
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
                  <span className="text-grey-40 font-sans text-[12px]">
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
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
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
      </form>
    </AuthLayout>
  );
}
