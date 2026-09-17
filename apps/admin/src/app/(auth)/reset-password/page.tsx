"use client";
import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import Image from "next/image";
import { Card, CardContent, Label, Input } from "@lemonade/ui";
import { FormikButton } from "@/components/global/FormikButton";
import AuthLayout from "@/components/layouts/AuthLayout";

function ResetPasswordPage({}) {
  const resetPasswordSchema = yup.object({
    password: yup.string().min(8).required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {},
  });
  return (
    <AuthLayout>
      <section className="h-full min-h-screen overflow-hidden bg-light-grey">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <Image src={"/images/logo.png"} alt="logo" width={127} height={56} />
          </div>
        </div>
        <div className="mt-24 flex flex-col items-center justify-center gap-16 tablet:flex-row tablet:items-start tablet:px-4">
          <Card className="w-full rounded-[16px] border-none p-[24px] shadow-sm tablet:w-[480px]">
            <CardContent className="grid gap-[24px] tablet:gap-[40px]">
              <div>
                <p className="font-ruso text-[24px] font-normal">Reset Password</p>
                <p className="text-[14px] font-normal text-text-grey">
                  Stronger password, stronger protection! Combine uppercase, lowercase, numbers, and
                  symbols to protect your account.
                </p>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="font-sans text-[14px] font-normal text-text-grey"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="form-font h-12 rounded-xl border-0 bg-light-grey"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <p className={"text-[12px] font-normal text-grey-40"}>
                  Password must be at least 8 character long
                </p>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="font-sans text-[14px] font-normal text-text-grey"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="form-font h-12 rounded-xl border-0 bg-light-grey"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <FormikButton
                loading={formik.isSubmitting}
                title="Save password"
                error={formik.isValid}
                classes="w-full h-[48px] rounded-[12px]"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
