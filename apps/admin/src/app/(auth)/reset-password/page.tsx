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
    validateOnMount: true,
    onSubmit: async () => {},
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
          <Card className="tablet:w-[480px] w-full rounded-[16px] border-none p-[24px] shadow-sm">
            <CardContent className="tablet:gap-[40px] grid gap-[24px]">
              <div>
                <p className="font-ruso text-[24px] font-normal">Reset Password</p>
                <p className="text-text-grey text-[14px] font-normal">
                  Stronger password, stronger protection! Combine uppercase, lowercase, numbers, and
                  symbols to protect your account.
                </p>
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
                <p className={"text-grey-40 text-[12px] font-normal"}>
                  Password must be at least 8 character long
                </p>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-text-grey font-sans text-[14px] font-normal"
                >
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="form-font bg-light-grey h-12 rounded-xl border-0"
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
