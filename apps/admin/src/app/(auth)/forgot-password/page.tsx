"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@lemonade/ui";
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
    validateOnMount: true,
    onSubmit: async () => {},
  });

  const [, setOtp] = useState(formik.values.code);
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
                <p className="font-ruso text-[24px] font-normal">Verification Code</p>
                <p className="text-text-grey text-[14px] font-normal">
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
              <p className="text-light-green text-center text-[16px] font-medium">
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
