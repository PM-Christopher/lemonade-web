"use client";
import React from "react";
import { Card, CardContent, Button, Input, Label } from "@lemonade/ui";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useResetPasswordMutation } from "@/features/authentication/mutations";
import { useFormik } from "formik";
import { resetPasswordSchema } from "@lemonade/validation";
import { routes } from "@/lib/routes";
import { images } from "@/lib/images";
import { useNavigation } from "@/hooks/useNavigation";

export default function ResetPasswordPage() {
  const { push } = useNavigation();
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

  const onSignup = async (values: { password: string; confirm_password: string }) => {
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
          push(routes.LOGIN);
        },
        onError: (error: Error) => {
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
        className="mx-auto flex w-fit max-w-full items-start justify-center gap-10"
      >
        <div className="tablet:flex hidden w-[400px] shrink-0 flex-col">
          <p className="font-ruso text-display-s font-bold">Reset password</p>
          <p className="text-body-xl text-text-grey mt-2 max-w-[26rem] font-sans font-normal">
            Stronger password, stronger protection! Combine uppercase, lowercase, numbers, and
            symbols to protect your account.
          </p>
          <Image
            src={images.RESET_PASSWORD}
            alt=""
            width={511}
            height={520}
            className="mt-4 h-auto w-full object-contain"
          />
        </div>
        <Card className="tablet:p-6 w-full max-w-[440px] shrink-0 rounded-2xl border-none p-5 shadow-none">
          <CardContent className="grid gap-4 p-0">
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
              <Label htmlFor="confirm_password" className="font-label">
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
