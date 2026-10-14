"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@lemonade/ui";
import OtpInput from "react-otp-input";
import { SubmitButton } from "@/components/global/SubmitButton";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpCodeInput } from "@lemonade/validation";
import { images } from "@/lib/images";

function ForgotPasswordPage({}) {
  // Not wired to the backend yet: there's no admin reset-code endpoint to submit to.
  const {
    control,
    formState: { isValid, isSubmitting },
  } = useForm<OtpCodeInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
    mode: "onChange",
  });
  return (
    <AuthLayout>
      <section className="bg-light-grey h-full min-h-screen overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <Image src={images.LOGO} alt="logo" width={127} height={56} />
          </div>
        </div>
        <div className="tablet:flex-row tablet:items-start tablet:px-4 mt-24 flex flex-col items-center justify-center gap-16">
          <Card className="tablet:w-[480px] w-full rounded-2xl border-none p-6 shadow-sm">
            <CardContent className="tablet:gap-10 grid gap-6">
              <div>
                <p className="font-ruso text-[24px] font-normal">Verification Code</p>
                <p className="text-text-grey text-[14px] font-normal">
                  Enter the 4-digit code sent adminlogin@admin.com to reset your password.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
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
                  )}
                />
              </div>
              <p className="text-light-green text-center text-[16px] font-medium">
                Resend in 60 secs
              </p>
              <SubmitButton
                loading={isSubmitting}
                title="Verify"
                isValid={isValid}
                classes="w-full h-12 rounded-xl"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
