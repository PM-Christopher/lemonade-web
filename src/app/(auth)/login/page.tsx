"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { useFormik } from "formik";
import * as yup from "yup";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import { useCookies } from "react-cookie";
import { login } from "@/features/authentication/authApi";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cookie, setCookie] = useCookies(["token", "newToken"]);

  const [loading, setLoading] = useState(false);

  const loginSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup.string().min(8).required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "jasondurello@gmail.com",
      password: "K@k@4chel$e@",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await login({ ...values }, dispatch, router, setCookie);
    },
  });

  return (
    <AuthLayout>
      <section className="bg-gradient-light-green min-h-screen h-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 px-10">
          <div>
            <Image
              src={"/images/logo.png"}
              alt="logo"
              width={127}
              height={56}
            />
          </div>
          <div>
            <Link href="/signup">
              <p className="border-2 rounded-xl font-sans p-[9px] px-[16px] text-bl">
                Sign up
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col mt-24 items-center tablet:items-start justify-center gap-16 tablet:px-4 tablet:flex-row">
          <div className="flex flex-col phone:mb-[16px]">
            <div className="text-center phone:text-left">
              <p className="text-[40px] font-bold leading-[48px] font-ruso">
                Login
              </p>
              <p className="text-[18px] font-normal leading-[27px] font-sans mt-2">
                Let's get you back into your account
              </p>
            </div>
            {/* Show image only on desktop and laptop screens */}
            <div className="hidden tablet:flex">
              <Image
                src={"/images/signup_image.png"}
                alt="signup image"
                width={511.06}
                height={519.77}
              />
            </div>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <Card className="p-[24px] w-full tablet:w-[480px] rounded-[16px] shadow-none border-none">
              <CardContent className="grid gap-[24px] tablet:gap-[40px]">
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="font-sans text-text-grey font-normal text-[14px]"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janedoe@example.com"
                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="password"
                    className="font-sans text-text-grey font-normal text-[14px]"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Login"
                  error={formik.isValid}
                  classes="w-full h-[48px] rounded-[12px]"
                />
                <div className="flex justify-around items-center">
                  <div className="w-[60px] h-[2px] bg-border-grey" />
                  <p className="text-grey-light font-normal text-[14px] text-center">
                    Or continue with
                  </p>
                  <div className="w-[60px] h-[2px] bg-border-grey" />
                </div>
                <div className="flex justify-center items-center gap-[24px] mt-4">
                  <div className="app-icon-border flex justify-center items-center">
                    <Image
                      src={"/images/apple.png"}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="app-icon-border flex justify-center items-center">
                    <Image
                      src={"/images/google.png"}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="app-icon-border flex justify-center items-center">
                    <Image
                      src={"/images/facebook.png"}
                      alt="logo"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
}
