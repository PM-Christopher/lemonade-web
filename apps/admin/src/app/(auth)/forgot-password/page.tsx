"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, Label, Input } from "@lemonade/ui";
import OtpInput from "react-otp-input";
import { FormikButton } from "@/components/global/FormikButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import * as yup from "yup";
import { useFormik } from "formik";

function ForgotPasswordPage({}) {
  const forgotPasswordSchema = yup.object({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {},
  });

  const [otp, setOtp] = useState(formik.values.code);
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
                <p className="font-ruso text-[24px] font-normal">Verification Code</p>
                <p className="text-[14px] font-normal text-text-grey">
                  Enter the 4-digit code sent adminlogin@admin.com to reset your password.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <OtpInput
                  value={formik.values.code}
                  onChange={(e) => {
                    setOtp(e);
                    formik.setFieldValue("code", e);
                  }}
                  numInputs={4}
                  renderSeparator={<span> </span>}
                  renderInput={(props) => <input {...props} />}
                  containerStyle="gap-2"
                  inputStyle={{
                    width: "48px",
                    height: "48px",
                    background: "#F9FAFA",
                    borderRadius: "12px",
                  }}
                />
              </div>
              <p className="text-center text-[16px] font-medium text-light-green">
                Resend in 60 secs
              </p>
              <FormikButton
                loading={formik.isSubmitting}
                title="Verify"
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

export default ForgotPasswordPage;
